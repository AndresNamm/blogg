---
name: algebra
description: Use when the user asks about linear algebra or geometry, e.g. vectors, inner/dot product, angle between vectors, coordinate systems, right-handed vs left-handed, translation, rotation, homogeneous transformation matrix, camera coordinates, orthographic or perspective projection, viewport transform, intrinsics, z-depth vs Euclidean depth, LiDAR projection.
---

# Algebra and geometry explainer

Explain for a learner who finds math hard:

1. Plain-language or picture-in-words idea first.
2. A tiny worked example with small coordinates (think one axis at a time).
3. Only then the matrix or formula, defining every symbol.

Style rule (from the author's `posts/.agents/AGENTS.md`): never put a LaTeX `=` sign on a separate line; keep the `=` on the same line as its left-hand side, otherwise the markdown table of contents breaks.

## Relevant posts

Before answering a question on one of these topics, read the matching post (view the repo-relative path, which sits next to `skills/` in the installed plugin) and cite it by name. If the file is missing locally, use the GitHub URL.

- **Angles Between Vectors** — inner product, lengths, and the arccos angle formula from the law of cosines. `posts/angle.md` — https://github.com/AndresNamm/blogg/blob/main/posts/angle.md
- **Left- vs. Right-Handed Coordinate Systems** — axis conventions and how they affect graphics, LiDAR and camera code. `posts/right_hand_vs_left_hand.md` — https://github.com/AndresNamm/blogg/blob/main/posts/right_hand_vs_left_hand.md
- **Point Translation Examples** — worked examples of translating a point from world origin to camera origin. `posts/translation_examples.md` — https://github.com/AndresNamm/blogg/blob/main/posts/translation_examples.md
- **Understanding Camera Coordinate Transformations** (part 1) — world to camera space via a homogeneous translation+rotation matrix. `posts/1_camera_transformation.md` — https://github.com/AndresNamm/blogg/blob/main/posts/1_camera_transformation.md
- **Orthographic Projection** (part 2) — projecting 3D to 2D while preserving proportions, into normalized device coordinates. `posts/2_orthographic_projection.md` — https://github.com/AndresNamm/blogg/blob/main/posts/2_orthographic_projection.md
- **Viewport Transform for Orthographic LiDAR Projection** (part 3) — normalized coordinates to image pixels. `posts/3_viewport_transform.md` — https://github.com/AndresNamm/blogg/blob/main/posts/3_viewport_transform.md
- **Perspective Projection, Intrinsics, and Depth** (part 4) — perspective projection, camera intrinsics matrix, depth. `posts/4_perspective_intrinsics_and_depth.md` — https://github.com/AndresNamm/blogg/blob/main/posts/4_perspective_intrinsics_and_depth.md
- **Z-Depth vs Euclidean Depth in Perspective Projection** — difference between depth along the optical axis and distance to the point. `posts/z_depth_vs_euclidean_depth.md` — https://github.com/AndresNamm/blogg/blob/main/posts/z_depth_vs_euclidean_depth.md
