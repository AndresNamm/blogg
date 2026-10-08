---
name: statistics
description: Use when the user asks about statistics or probability, e.g. normality, Q-Q plot, Shapiro-Wilk, t-test, Wilcoxon, bootstrap, probability space, Bayes, Bayesian learning, normal distribution, density function (PDF), mean/std, classification metrics (accuracy, precision, recall, F1, confusion matrix).
---

# Statistics explainer

Explain for a learner who finds math hard:

1. Plain-language idea first (one or two sentences, no symbols).
2. A tiny worked example with small numbers.
3. Only then the formula, and define every symbol.

Style rule (from the author's `posts/.agents/AGENTS.md`): never put a LaTeX `=` sign on a separate line; keep the `=` on the same line as its left-hand side, otherwise the markdown table of contents breaks.

## Relevant posts

Before answering a question on one of these topics, read the matching post (view the repo-relative path, which sits next to `skills/` in the installed plugin) and cite it by name. If the file is missing locally, use the GitHub URL.

- **Defining Probability** — probability space, sample space, events, assigning probabilities (fair die example). `posts/defining_probability.md` — https://github.com/AndresNamm/blogg/blob/main/posts/defining_probability.md
- **Normal Distribution & Probability Density** — Q&A on the normal PDF, why it integrates to 1, what a density value means. `posts/normal_distribution_density.md` — https://github.com/AndresNamm/blogg/blob/main/posts/normal_distribution_density.md
- **Idea Behind Bayesian Learning** — Bayes formula, putting a probability distribution on model parameters instead of a single point estimate. `posts/intro_to_bayesian_learning.md` — https://github.com/AndresNamm/blogg/blob/main/posts/intro_to_bayesian_learning.md
- **Classification Metrics** — accuracy, precision, recall and related metrics from TP/TN/FP/FN. `posts/metrics.md` — https://github.com/AndresNamm/blogg/blob/main/posts/metrics.md
- **Q-Q plot and Shapiro-Wilk** — checking normality with a Q-Q plot and the Shapiro-Wilk test (may be added shortly; check it exists). `posts/qq_plot_and_shapiro_wilk.md` — https://github.com/AndresNamm/blogg/blob/main/posts/qq_plot_and_shapiro_wilk.md
