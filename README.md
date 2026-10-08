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

## Copilot plugin

This repo is also a GitHub Copilot CLI plugin (`blogg-math-skills`, Agent Plugins 1.0, see `plugin.json`). It contains four skills in `skills/` (`statistics`, `calculus`, `algebra`, `neural_network`) that explain math in plain language and point Copilot to the relevant posts in `posts/`.

```bash
copilot plugin install AndresNamm/blogg   # install
copilot plugin list                       # verify
# inside Copilot CLI: /skills list
copilot plugin update blogg-math-skills
copilot plugin uninstall blogg-math-skills
```

## Dependencies

- `marked` - Markdown parser
- `chokidar` - File watcher
- `katex` - LaTeX rendering (via CDN)
