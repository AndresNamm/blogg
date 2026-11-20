# Blog

Minimal TypeScript blog for Markdown and standalone HTML posts. Markdown pages support LaTeX.

## Structure

```
blogg/
├── posts/          # Markdown files and shared images
│   └── html/       # Standalone HTML posts and their assets
├── src/            # TypeScript build script
├── template/       # HTML template
└── build/          # Generated static site
```

## Usage

Add markdown files to the `posts/` folder. The blog supports LaTeX math:
- Inline: `$\sum{n}$`
- Display: `$$\sum{n}$$`

For a standalone post, put a complete `.html` document in `posts/html/`. Its
`<title>` in `<head>` supplies the text for the blog index (or the filename if
the title is missing). The build copies the entire directory to `build/html/`
without applying the Markdown template. Subdirectories and relative asset
links work as written, and links to shared images or Markdown posts can use
`../images/...` or `../post-name.html` from a top-level HTML post. Keep source
files and assets together in `posts/html/`; `build/html/` is regenerated, and
source symlinks are not copied.

### Build

```bash
npm run build
```

### Preview, watch, and test

```bash
npm run dev    # Build and serve at http://localhost:3000/
npm run watch  # Rebuild when Markdown or standalone HTML sources change
npm test
```

### Deploy to GitHub Pages

Push to main/master branch. GitHub Actions will automatically build and deploy.

## Copilot plugin

This repo is also a GitHub Copilot CLI plugin (`blogg-math-skills`, Agent Plugins 1.0, see `plugin.json`). It contains four skills in `skills/` (`statistics`, `calculus`, `algebra`, `neural_network`) that explain math in plain language and point Copilot to the relevant posts in `posts/`.

```bash
copilot plugin marketplace add AndresNamm/blogg      # register marketplace (.github/plugin/marketplace.json)
copilot plugin install blogg-math-skills@blogg       # install
copilot plugin list                                  # verify
# inside Copilot CLI: /skills list
copilot plugin update blogg-math-skills
copilot plugin uninstall blogg-math-skills
```

## Dependencies

- `marked` - Markdown parser
- `chokidar` - File watcher
- `katex` - LaTeX rendering (via CDN)
