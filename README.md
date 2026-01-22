# Blog

Minimal TypeScript blog that converts markdown files to static HTML pages with LaTeX support.

## Structure

```
blogg/
├── posts/          # Markdown files go here
├── src/            # TypeScript build script
├── template/       # HTML template
└── build/          # Generated static site
```

## Usage

Add markdown files to the `posts/` folder. The blog supports LaTeX math:
- Inline: `$\sum{n}$`
- Display: `$$\sum{n}$$`

### Build

```bash
npm run build
```

### Watch mode

```bash
npm run watch
```

### Deploy to GitHub Pages

Push to main/master branch. GitHub Actions will automatically build and deploy.

## Dependencies

- `marked` - Markdown parser
- `chokidar` - File watcher
- `katex` - LaTeX rendering (via CDN)
