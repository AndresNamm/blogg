import * as fs from 'fs';
import * as path from 'path';
import { marked } from 'marked';
import * as chokidar from 'chokidar';

const rootDir = path.join(__dirname, '..');
const postsDir = path.join(rootDir, 'posts');
const buildDir = path.join(rootDir, 'build');
const templatePath = path.join(rootDir, 'template', 'index.html');

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

async function convertMarkdownToHtml(mdPath: string) {
  const mdContent = fs.readFileSync(mdPath, 'utf-8');
  const { masked, segments } = preserveMathSegments(mdContent);
  const parsed = await marked(masked);
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

function generateIndex(mdFiles: string[]) {
  const links = mdFiles.map(mdPath => {
    const fileName = path.basename(mdPath, '.md');
    const title = extractTitle(mdPath);
    return `<li><a href="${fileName}.html">${title}</a></li>`;
  }).join('\n    ');

  const indexContent = `<h1>Blog Posts</h1>\n<ul class="post-list">\n    ${links}\n</ul>`;
  const template = readTemplate();
  const finalHtml = template
    .replace('{{TITLE}}', 'Blog')
    .replace('{{CONTENT}}', indexContent);

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

  if (mdFiles.length === 0) {
    console.log('No markdown files found in posts/');
    return;
  }

  await Promise.all(mdFiles.map(convertMarkdownToHtml));
  generateIndex(mdFiles);
  copyImages();
  console.log('Build complete!');
}

function watch() {
  console.log('Watching for changes in posts/...');
  const watcher = chokidar.watch('*.md', {
    cwd: postsDir,
    ignoreInitial: false
  });

  watcher.on('add', () => build());
  watcher.on('change', () => build());
  watcher.on('unlink', () => build());
}

const args = process.argv.slice(2);
if (args.includes('--watch')) {
  watch();
} else {
  build();
}
