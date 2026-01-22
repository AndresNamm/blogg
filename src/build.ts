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

async function convertMarkdownToHtml(mdPath: string) {
  const mdContent = fs.readFileSync(mdPath, 'utf-8');
  const htmlContent = await marked(mdContent);
  const template = readTemplate();
  const fileName = path.basename(mdPath, '.md');
  const title = fileName.charAt(0).toUpperCase() + fileName.slice(1);

  const finalHtml = template
    .replace('{{TITLE}}', title)
    .replace('{{CONTENT}}', htmlContent);

  const outputPath = path.join(buildDir, `${fileName}.html`);
  fs.writeFileSync(outputPath, finalHtml);
  console.log(`Generated: ${fileName}.html`);
}

function generateIndex(mdFiles: string[]) {
  const links = mdFiles.map(mdPath => {
    const fileName = path.basename(mdPath, '.md');
    return `<li><a href="${fileName}.html">${fileName}</a></li>`;
  }).join('\n    ');

  const indexContent = `<h1>Blog Posts</h1>\n<ul>\n    ${links}\n</ul>`;
  const template = readTemplate();
  const finalHtml = template
    .replace('{{TITLE}}', 'Blog')
    .replace('{{CONTENT}}', indexContent);

  fs.writeFileSync(path.join(buildDir, 'index.html'), finalHtml);
  console.log('Generated: index.html');
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
