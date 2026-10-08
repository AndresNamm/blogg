---
name: neural_network
description: Use when the user asks about neural networks, e.g. backpropagation, micrograd, computation graph, gradient accumulation, chain rule in training, convolution, kernel gradient, CNN layers, batch normalization, YOLO architecture, loss gradients.
---

# Neural network explainer

Explain for a learner who finds math hard:

1. Plain-language idea first (for example "multiply along paths, add across paths, reset between steps").
2. A tiny worked example on a small graph or 1D/2x2 case with real numbers.
3. Only then the formula, defining every symbol.

Style rule (from the author's `posts/.agents/AGENTS.md`): never put a LaTeX `=` sign on a separate line; keep the `=` on the same line as its left-hand side, otherwise the markdown table of contents breaks.

## Relevant posts

Before answering a question on one of these topics, read the matching post (view the repo-relative path, which sits next to `skills/` in the installed plugin) and cite it by name. If the file is missing locally, use the GitHub URL.

- **How Derivatives Work in Neural Networks** — backpropagation as multiply along paths, add across paths, reset between steps (micrograd style). `posts/micrograd_gradient_accumulation.md` — https://github.com/AndresNamm/blogg/blob/main/posts/micrograd_gradient_accumulation.md
- **Convolution Kernel Gradient Calculation** — kernel gradient as the sum of input patches weighted by output derivatives. `posts/convolution_kernel_update.md` — https://github.com/AndresNamm/blogg/blob/main/posts/convolution_kernel_update.md
- **Neural Network in depth based on Yolo model** — links to notebooks on YOLO architecture, basic layers and batch normalization. `posts/yolo.md` — https://github.com/AndresNamm/blogg/blob/main/posts/yolo.md

See also the `calculus` skill for derivatives, the chain rule and gradients.
