import * as fs from 'fs';
import * as path from 'path';
import { Marked } from 'marked';
import * as chokidar from 'chokidar';

const rootDir = path.join(__dirname, '..');
const postsDir = path.join(rootDir, 'posts');
const buildDir = path.join(rootDir, 'build');
const htmlDirName = 'html';
const templatePath = path.join(rootDir, 'template', 'index.html');

type PostLink = { href: string; title: string };

function stripHtml(input: string): string {
  return input.replace(/<[^>]*>/g, '');
}

function decodeEntities(input: string): string {
  return input
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function slugifyHeading(input: string): string {
  return decodeEntities(stripHtml(input))
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function readTemplate(): string {
  return fs.readFileSync(templatePath, 'utf-8');
}

function getAllMarkdownFiles(): string[] {
  if (!fs.existsSync(postsDir)) {
    return [];
  }
  return fs.readdirSync(postsDir)
    .filter(file => file.endsWith('.md'))
    .map(file => path.join(postsDir, file));
}

function preserveMathSegments(markdown: string): { masked: string; segments: string[] } {
  const segments: string[] = [];
  let masked = '';
  let i = 0;

  while (i < markdown.length) {
    const ch = markdown[i];
    const prev = i > 0 ? markdown[i - 1] : '';

    if (ch === '$' && prev !== '\\') {
      const isDisplay = markdown[i + 1] === '$';
      const delim = isDisplay ? '$$' : '$';
      const start = i;
      i += delim.length;

      let end = -1;
      while (i < markdown.length) {
        const curr = markdown[i];
        const currPrev = i > 0 ? markdown[i - 1] : '';

        if (curr === '$' && currPrev !== '\\') {
          if (isDisplay && markdown[i + 1] === '$') {
            end = i + 2;
            break;
          }
          if (!isDisplay) {
            end = i + 1;
            break;
          }
        }
        i++;
      }

      if (end !== -1) {
        const segment = markdown.slice(start, end);
        const token = `@@MATH_SEGMENT_${segments.length}@@`;
        segments.push(segment);
        masked += token;
        i = end;
        continue;
      }

      i = start;
    }

    masked += ch;
    i++;
  }

  return { masked, segments };
}

function restoreMathSegments(html: string, segments: string[]): string {
  let restored = html;
  for (let i = 0; i < segments.length; i++) {
    const token = `@@MATH_SEGMENT_${i}@@`;
    restored = restored.split(token).join(segments[i]);
  }
  return restored;
}

function normalizeMarkdownLink(href: string): string {
  if (!href) {
    return href;
  }

  if (
    href.startsWith('#') ||
    href.startsWith('http://') ||
    href.startsWith('https://') ||
    href.startsWith('mailto:') ||
    href.startsWith('tel:')
  ) {
    return href;
  }

  const [pathPart, hash = ''] = href.split('#');
  const [cleanPath, query = ''] = pathPart.split('?');
  const normalizedPath = cleanPath.replace(/\\/g, '/');

  if (!normalizedPath.toLowerCase().endsWith('.md')) {
    return href;
  }

  const withoutPostsPrefix = normalizedPath.replace(/^\.?\/?posts\//i, '');
  const fileName = path.basename(withoutPostsPrefix, '.md');
  const target = `${fileName}.html`;
  const querySuffix = query ? `?${query}` : '';
  const hashSuffix = hash ? `#${hash}` : '';

  return `${target}${querySuffix}${hashSuffix}`;
}

async function convertMarkdownToHtml(mdPath: string) {
  const mdContent = fs.readFileSync(mdPath, 'utf-8');
  const { masked, segments } = preserveMathSegments(mdContent);
  const headingSlugCounts = new Map<string, number>();
  const parser = new Marked();

  parser.use({
    renderer: {
      heading(text: string, level: number): string {
        const baseSlug = slugifyHeading(text) || 'section';
        const seen = headingSlugCounts.get(baseSlug) ?? 0;
        headingSlugCounts.set(baseSlug, seen + 1);
        const slug = seen === 0 ? baseSlug : `${baseSlug}-${seen}`;
        return `<h${level} id="${slug}">${text}</h${level}>\n`;
      },
      link(href: string, title: string | null | undefined, text: string): string {
        const safeHref = href ? normalizeMarkdownLink(href) : '';
        const titleAttr = title ? ` title="${title}"` : '';
        return `<a href="${safeHref}"${titleAttr}>${text}</a>`;
      }
    }
  });

  const parsed = await parser.parse(masked);
  const htmlContent = restoreMathSegments(parsed, segments);
  const template = readTemplate();
  const fileName = path.basename(mdPath, '.md');
  const title = extractTitle(mdPath);

  const finalHtml = template
    .replace('{{TITLE}}', title)
    .replace('{{CONTENT}}', htmlContent);

  const outputPath = path.join(buildDir, `${fileName}.html`);
  fs.writeFileSync(outputPath, finalHtml);
  console.log(`Generated: ${fileName}.html`);
}

function extractTitle(mdPath: string): string {
  const content = fs.readFileSync(mdPath, 'utf-8');
  const match = content.match(/^#\s+(.+)$/m);
  if (match) {
    return match[1].trim();
  }
  const fileName = path.basename(mdPath, '.md');
  return fileName.charAt(0).toUpperCase() + fileName.slice(1);
}

function extractHtmlTitle(content: string, fileName: string): string {
  const head = content.match(/<head\b[^>]*>([\s\S]*?)<\/head\s*>/i)?.[1];
  if (head) {
    const elements = /<!--[\s\S]*?-->|<(script|style|template)\b[^>]*>[\s\S]*?<\/\1\s*>|<title\b[^>]*>([\s\S]*?)<\/title\s*>/gi;
    for (const match of head.matchAll(elements)) {
      if (match[2] !== undefined) {
        return match[2].replace(/\s+/g, ' ').trim() || path.basename(fileName, '.html');
      }
    }
  }
  return path.basename(fileName, '.html');
}

function copyHtmlPosts(): PostLink[] {
  const source = path.join(postsDir, htmlDirName);
  const destination = path.join(buildDir, htmlDirName);
  const links: PostLink[] = [];

  // This output subtree is reserved for standalone posts and their assets.
  fs.rmSync(destination, { recursive: true, force: true });
  if (!fs.lstatSync(source, { throwIfNoEntry: false })?.isDirectory()) {
    return links;
  }

  function copyDirectory(parts: string[]) {
    const dir = path.join(source, ...parts);
    const output = path.join(destination, ...parts);
    ensureDir(output);
    const entries = fs.readdirSync(dir, { withFileTypes: true })
      .sort((a, b) => a.name.localeCompare(b.name, 'en'));

    for (const entry of entries) {
      if (entry.isDirectory()) {
        copyDirectory([...parts, entry.name]);
      } else if (entry.isFile()) {
        const file = path.join(dir, entry.name);
        fs.copyFileSync(file, path.join(output, entry.name));
        if (entry.name.endsWith('.html')) {
          links.push({
            href: [htmlDirName, ...parts, entry.name].map(encodeURIComponent).join('/'),
            title: extractHtmlTitle(fs.readFileSync(file, 'utf-8'), entry.name)
          });
        }
      }
    }
  }

  copyDirectory([]);
  return links;
}

function escapeLinkTitle(title: string): string {
  // Preserve entity references so an authored title is decoded only once.
  return title
    .replace(/&(?!(?:[a-z][a-z0-9]*|#\d+|#x[\da-f]+);)/gi, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function generateIndex(posts: PostLink[]) {
  const links = posts.map(({ href, title }) =>
    `<li><a href="${href}">${escapeLinkTitle(title)}</a></li>`
  ).join('\n    ');

  const indexContent = `<h1>Blog Posts</h1>\n<ul class="post-list">\n    ${links}\n</ul>`;
  const template = readTemplate();
  const finalHtml = template
    .replace('{{TITLE}}', 'Blog')
    .replace('{{CONTENT}}', () => indexContent);

  fs.writeFileSync(path.join(buildDir, 'index.html'), finalHtml);
  console.log('Generated: index.html');
}

function copyImages() {
  const imagesSource = path.join(postsDir, 'images');
  const imagesDest = path.join(buildDir, 'images');

  if (!fs.existsSync(imagesSource)) {
    return;
  }

  ensureDir(imagesDest);

  const files = fs.readdirSync(imagesSource);
  for (const file of files) {
    fs.copyFileSync(path.join(imagesSource, file), path.join(imagesDest, file));
  }
  console.log(`Copied ${files.length} image(s) to build/images/`);
}

async function build() {
  ensureDir(buildDir);
  const mdFiles = getAllMarkdownFiles();

  await Promise.all(mdFiles.map(convertMarkdownToHtml));
  const htmlLinks = copyHtmlPosts();
  const markdownLinks = mdFiles.map(mdPath => ({
    href: `${encodeURIComponent(path.basename(mdPath, '.md'))}.html`,
    title: extractTitle(mdPath)
  }));
  generateIndex([...markdownLinks, ...htmlLinks]);
  copyImages();
  console.log('Build complete!');
}

function reportBuildError(error: unknown) {
  console.error(error);
  process.exitCode = 1;
}

function watch() {
  console.log('Watching for changes in posts/...');
  const watcher = chokidar.watch('.', {
    cwd: postsDir,
    followSymlinks: false,
    ignoreInitial: true
  });
  let pending = Promise.resolve();
  function rebuild() {
    pending = pending.then(build).catch(error => console.error(error));
  }

  watcher.on('ready', rebuild);
  watcher.on('all', (_event, file) => {
    const [top, nested] = file.split(path.sep);
    if (top === htmlDirName || (nested === undefined && top.endsWith('.md'))) {
      rebuild();
    }
  });
  watcher.on('error', reportBuildError);
}

const args = process.argv.slice(2);
if (args.includes('--watch')) {
  watch();
} else {
  build().catch(reportBuildError);
}
