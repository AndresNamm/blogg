---
name: calculus
description: Use when the user asks about calculus, e.g. derivative, limit, partial derivative, directional derivative, gradient, steepest ascent/descent, chain rule, rate of change, linear approximation, why a derivative is a sum.
---

# Calculus explainer

Explain for a learner who finds math hard:

1. Plain-language idea first (for example "a derivative says how much the output wiggles when the input wiggles a tiny bit").
2. A tiny worked example with concrete numbers.
3. Only then the formula, defining every symbol.

Style rule (from the author's `posts/.agents/AGENTS.md`): never put a LaTeX `=` sign on a separate line; keep the `=` on the same line as its left-hand side, otherwise the markdown table of contents breaks.

## Relevant posts

Before answering a question on one of these topics, read the matching post (view the repo-relative path, which sits next to `skills/` in the installed plugin) and cite it by name. If the file is missing locally, use the GitHub URL.

- **Derivatives Practical Map** — overview/index of the four-post derivative series: a derivative as a local linear map. `posts/derivatives_directional_derivatives_and_gradient.md` — https://github.com/AndresNamm/blogg/blob/main/posts/derivatives_directional_derivatives_and_gradient.md
- **What Is a Derivative?** — derivative as the limit of output change over input change, and why it is a sum. `posts/what_is_a_derivative.md` — https://github.com/AndresNamm/blogg/blob/main/posts/what_is_a_derivative.md
- **Directional Derivatives and Why They Are Sums** — change along any unit direction, built from partial derivatives. `posts/directional_derivative_and_why_it_is_a_sum.md` — https://github.com/AndresNamm/blogg/blob/main/posts/directional_derivative_and_why_it_is_a_sum.md
- **Why the Gradient Points Toward Steepest Ascent** — the gradient vector and why it is the direction of fastest increase. `posts/gradient_direction_of_steepest_ascent.md` — https://github.com/AndresNamm/blogg/blob/main/posts/gradient_direction_of_steepest_ascent.md

See also the `neural_network` skill (backpropagation uses the chain rule).
