# Orthographic vs Perspective: Scaling, the Perspective Divide, and Getting to Pixels

The previous four posts built two things: an orthographic measurement pipeline (Parts 1–3) and the perspective / intrinsics machinery (Part 4). This post connects them directly. It answers three practical questions that come up the moment you try to use both in the same project:

1. What is intrinsic-matrix (perspective) projection compared to orthographic projection?
2. Does a pixel scale the same way in both?
3. Do you need extra steps to get from a 3D point to a pixel, like you did in the orthographic pipeline?

This is **Part 5** of the series:

1. [Understanding Camera Coordinate Transformations](1_camera_transformation.md)
2. [Orthographic Projection? 📸](2_orthographic_projection.md)
3. [Viewport Transform for Orthographic LiDAR Projection](3_viewport_transform.md)
4. [Perspective Projection, Intrinsics, and Depth](4_perspective_intrinsics_and_depth.md)
5. [Orthographic vs Perspective: Scaling, the Perspective Divide, and Getting to Pixels](5_ortho_vs_perspective_scaling.md)

---

# Table of Contents

- [Orthographic vs Perspective: Scaling, the Perspective Divide, and Getting to Pixels](#orthographic-vs-perspective-scaling-the-perspective-divide-and-getting-to-pixels)
- [Table of Contents](#table-of-contents)
- [Glossary](#glossary)
- [1. The One Thing That Does Not Change](#1-the-one-thing-that-does-not-change)
- [2. What "Projection" Means in Each Case](#2-what-projection-means-in-each-case)
- [3. The Core Difference: Divide by Depth](#3-the-core-difference-divide-by-depth)
- [4. Does a Pixel Scale the Same Way?](#4-does-a-pixel-scale-the-same-way)
- [5. What Is `K`, and What Is Its Job?](#5-what-is-k-and-what-is-its-job)
- [6. Is `K` the Same as NDC Plus Viewport? (The −1 to 1 Question)](#6-is-k-the-same-as-ndc-plus-viewport-the-1-to-1-question)
- [7. Do I Need Extra Steps to Reach Pixels?](#7-do-i-need-extra-steps-to-reach-pixels)
- [8. Where Does `Z` Come From?](#8-where-does-z-come-from)
- [9. Side-by-Side Formula Chains](#9-side-by-side-formula-chains)
- [10. The Short Version](#10-the-short-version)
- [References](#references)

---

# Glossary

- **Orthographic Projection**: A parallel projection where depth is discarded and the mapping to the image is affine (scale plus shift).
- **Perspective Projection**: A projective mapping where points are divided by their depth, so distant objects appear smaller.
- **Perspective Divide**: The step that divides the camera-space coordinates by depth `Z`. This is the operation that makes a projection "perspective".
- **Intrinsic Matrix (`K`)**: A 3×3 matrix holding focal lengths and the principal point; it turns a depth-normalized image-plane point into a pixel coordinate.
- **Extrinsic / View Matrix**: The world-to-camera transform. It positions the scene relative to the camera. Identical concept in both projection types.
- **Affine Map**: A transformation of the form "scale then shift", with no division by a variable. It preserves parallel lines and constant scale.
- **Projective Map**: A transformation that includes a division by a coordinate, so scale changes with position/depth.

---

# 1. The One Thing That Does Not Change

Both pipelines start the same way. A 3D point in the world is moved into the camera's coordinate frame using the view matrix from [Part 1](1_camera_transformation.md):

$$
P_{\text{camera}} = (X, Y, Z) = M_{\text{view}} \cdot P_{\text{world}}
$$

This world-to-camera step is **identical** for orthographic and perspective. The camera pose, translation, and rotation do not care which projection you apply afterwards.

So the difference between orthographic and perspective is not *where the camera is*. It is *what you do with `X`, `Y`, `Z` after you already have them in camera space*.

---

# 2. What "Projection" Means in Each Case

**Orthographic** ([Part 2](2_orthographic_projection.md)) throws away the depth and keeps `X` and `Y`, then rescales them to fit the view box:

```text
x_ndc = (2 / (r - l)) * X - (r + l) / (r - l)
y_ndc = (2 / (t - b)) * Y - (t + b) / (t - b)
```

Notice: `Z` never multiplies or divides `X` and `Y`. The mapping is a pure scale-and-shift. That is what "affine in `x, y`" means.

**Perspective** ([Part 4](4_perspective_intrinsics_and_depth.md)) instead uses `Z` as a divisor. A point far away has a large `Z`, so its `X` and `Y` shrink:

```text
x_image = X / Z
y_image = Y / Z
```

Then the intrinsic matrix `K` scales and shifts those into pixels. The presence of that `/ Z` is the entire distinction.

---

# 3. The Core Difference: Divide by Depth

Here are the two mappings placed next to each other, stripped to their essence:

$$
\text{orthographic:} \quad x \mapsto s \, X + t
$$

$$
\text{perspective:} \quad x \mapsto f_x \, \frac{X}{Z} + c_x
$$

The orthographic version is linear in `X`. The perspective version is **not** linear in `X` and `Z` together, because of the division. Dividing by a coordinate is exactly what makes a transform *projective* rather than *affine*.

This single division is responsible for every visual difference you associate with real cameras: parallel train tracks converging, distant logs looking smaller, and a pixel covering more physical space the farther away the surface is.

---

# 4. Does a Pixel Scale the Same Way?

No. This is the practical consequence of the divide.

In orthographic projection, the scale factor is a **single constant** for the whole image. From Part 2, that factor is `2 / (r - l)` combined with the viewport width. Because it does not depend on `Z`, one pixel corresponds to the same physical size *everywhere in the image and at every distance*. That is why orthographic measurement is so convenient:

```text
real_size = pixel_count * constant
```

In perspective projection, there is no single constant. The physical size that one pixel covers is:

```text
pixel_physical_size ≈ angular_pixel_size * depth
```

The angular size comes from the intrinsics ([Part 4, section 7](4_perspective_intrinsics_and_depth.md)), and it is then multiplied by depth. So:

```text
at 1 meter  -> one pixel covers a small patch
at 5 meters -> the same pixel covers a much larger patch
```

Same pixel, different real-world size, depending on distance. The scale is **per-pixel and depth-dependent**, not global.

| | Orthographic | Perspective |
|---|---|---|
| Ray shape | Parallel | Fan out from pinhole |
| Uses depth `Z`? | No (discarded) | Yes (divide by it) |
| Map type | Affine (scale + shift) | Projective (divide by `Z`) |
| Pixel → scene size | Constant everywhere | Grows with depth |
| Scale factor | Single global constant | Per-pixel, `∝ Z` |

---

# 5. What Is `K`, and What Is Its Job?

`K` is the camera intrinsic matrix from [Part 4](4_perspective_intrinsics_and_depth.md):

$$
K =
\begin{pmatrix}
f_x & 0 & c_x \\
0 & f_y & c_y \\
0 & 0 & 1
\end{pmatrix}
$$

It holds four numbers describing the camera's internal geometry:

- `fx`, `fy` — focal length in pixels (how much a pixel offset changes the viewing angle, i.e. the zoom / field of view).
- `cx`, `cy` — the principal point (the pixel that looks straight ahead).

Its job is narrow. It takes a point that has *already* been flattened by the perspective divide and turns it into a pixel:

$$
\begin{pmatrix} u \\ v \\ 1 \end{pmatrix}
= K
\begin{pmatrix} X/Z \\ Y/Z \\ 1 \end{pmatrix}
$$

Written out:

```text
u = fx * (X / Z) + cx
v = fy * (Y / Z) + cy
```

So `K` performs a **scale (`fx`, `fy`) and a shift (`cx`, `cy`)**. That is precisely the role the orthographic matrix plus the viewport transform played in Parts 2 and 3. What `K` does *not* do is the `/ Z` divide. That happens *before* `K`, and it is what makes the whole thing perspective.

The "intrinsic" name is a contrast with "extrinsic". Intrinsic parameters are internal to the camera (lens and sensor). Extrinsic parameters are the view matrix, i.e. where the camera sits in the world.

---

# 6. Is `K` the Same as NDC Plus Viewport? (The −1 to 1 Question)

It is tempting to say "multiplying by `K` is like the orthographic NDC step plus the viewport transform, so the result is in the `-1 .. 1` range". That is a natural guess, but it mixes up two different intermediate ranges, so it needs correcting.

In the orthographic pipeline there are **two stages with two different output ranges**:

```text
ortho matrix:        camera space -> NDC     (range -1 .. 1)
viewport transform:  NDC          -> pixels  (range 0 .. W, 0 .. H)
```

The `-1 .. 1` range is the output of the **ortho matrix only** (the NDC cube from Part 2). The viewport transform then *leaves* that range and produces actual pixels.

`K` is analogous to the **combination** of both stages, not to the NDC stage alone:

```text
perspective divide:  camera space -> normalized image coords  (X/Z, Y/Z)
K:                   normalized img -> pixels  (range 0 .. W, 0 .. H)
```

So `K`'s output is **pixel coordinates directly** (for example `u = 2011`, `v = 1514`), *not* values in `-1 .. 1`:

```text
u = fx * (X/Z) + cx   ->  e.g. 0 .. 4032
v = fy * (Y/Z) + cy   ->  e.g. 0 .. 3024
```

The `cx`, `cy` shift already places the origin at the image corner, which is exactly what the viewport transform did in the orthographic pipeline. So `K` **skips the intermediate `-1 .. 1` box entirely** and lands straight on pixels.

| Ortho pipeline stage | Output range | Perspective equivalent |
|---|---|---|
| Ortho matrix | `-1 .. 1` (NDC) | *(no direct equivalent here)* |
| Viewport transform | `0 .. W`, `0 .. H` | — |
| **Both combined** | `0 .. W`, `0 .. H` | **`K`** |
| Perspective divide `/ Z` | — | *(the genuinely new step)* |

**The nuance about NDC.** There *is* a perspective transform that produces a `-1 .. 1` clip/NDC cube: the OpenGL **perspective projection matrix** (the Song Ho / LearnOpenGL formulation). But that is a *different* matrix from `K`. The computer-vision intrinsic matrix `K` used in the TimberArea code goes straight to pixels and never uses a `-1 .. 1` normalized cube.

So the corrected statement is:

> `K` is like the ortho matrix **plus** viewport transform fused together, so its output is pixels (`0 .. W`), not the `-1 .. 1` NDC range. The `-1 .. 1` box belongs only to the intermediate NDC stage, which `K` does not produce — that would be the separate OpenGL perspective matrix.

---

# 7. Do I Need Extra Steps to Reach Pixels?

The overall shape of the pipeline is the same as orthographic, with **one extra nonlinear step**.

Orthographic ([Part 3](3_viewport_transform.md)):

```text
world -> view matrix -> camera space -> ortho matrix (drop Z) -> NDC -> viewport -> pixels
```

Every step there is linear. No division.

Perspective:

```text
world -> view matrix -> camera space -> divide by Z -> normalized image coords -> K (fx, fy, cx, cy) -> pixels
```

The only genuinely new operation compared to the orthographic pipeline is the **perspective divide** (`/ Z`). After that divide, `K` finishes the job with the same scale-and-shift work the ortho matrix and viewport transform did. So the answer is: yes, one extra step, and it is the divide by depth.

---

# 8. Where Does `Z` Come From?

The divide needs `Z`, so the natural question is where you actually get it. The answer depends on which direction you are going.

**Going 3D → pixel (projection).** Here `Z` is already known, because you *start* from a 3D point in camera space. The third component of `P_camera = (X, Y, Z)` is `Z`. After the world-to-camera transform you have it for free.

**Going pixel → 3D (back-projection / measurement).** This is the TimberArea case, and here is the catch: a plain RGB image does **not** contain `Z`. A single pixel only fixes a ray *direction*, not the distance along it ([Part 4, section 6](4_perspective_intrinsics_and_depth.md)). The object could be anywhere along that ray. So `Z` must come from an external source:

- **LiDAR / depth sensor** — for example the iPhone LiDAR depth map. Each pixel stores its distance.
- **Photogrammetry / stereo / structure-from-motion** — depth reconstructed from multiple views.
- **A geometry assumption** — assuming the surface lies on a known plane at a known distance (the `reference_depth` idea).

In the Part 4 measurement pipeline this is exactly the `depth = depth_at(x, y)` step. The depth map supplies the missing scalar that RGB alone cannot. This is the whole reason a measurement pipeline needs LiDAR: it fills in the `Z` that the perspective divide consumed.

---

# 9. Side-by-Side Formula Chains

For a point already in camera space `(X, Y, Z)`:

**Orthographic:**

$$
u = \left(\frac{2}{r-l}\right) X - \frac{r+l}{r-l} \;\;\rightarrow\;\; \text{viewport scale/shift} \;\;\rightarrow\;\; \text{pixel}
$$

No `Z`. Constant scale.

**Perspective:**

$$
u = f_x \frac{X}{Z} + c_x
\qquad
v = f_y \frac{Y}{Z} + c_y
$$

Depth `Z` appears in the denominator. Scale depends on `Z`.

And for measurement (pixel → meters), perspective replaces the single orthographic constant with a per-pixel, depth-scaled sum:

```text
orthographic:  real_size = pixel_count * constant
perspective:   real_size = Σ (angular_pixel_size * depth)
```

The depth *is* the per-pixel replacement for the missing global constant.

---

# 10. The Short Version

- The world-to-camera transform is the same in both. The difference starts only after you have `(X, Y, Z)` in camera space.
- Orthographic drops `Z` and applies a constant scale-and-shift. It is affine.
- Perspective divides by `Z` first. That divide makes it projective and is the only structurally new step.
- Because of the divide, a pixel does not scale the same way: orthographic pixels have a single global scale, perspective pixels scale with depth.
- `K` does the same scale-and-shift job as the ortho matrix plus viewport transform. It does **not** do the divide.
- `K` outputs pixels directly (`0 .. W`), not the `-1 .. 1` NDC range. The `-1 .. 1` box is only the intermediate ortho/NDC stage; the perspective version of that separate cube is the OpenGL perspective matrix, which is *not* `K`.
- The divide needs `Z`. When projecting out of a 3D scene you already have it. When going back from a pixel to metric size, you must supply `Z` from LiDAR, stereo, or an assumption.

In one sentence:

> Perspective projection is orthographic-style scale-and-shift with one extra ingredient — a divide by depth — and that single divide is why pixels no longer scale uniformly and why measurement needs a depth source.

---

# References

- [Understanding Camera Coordinate Transformations](1_camera_transformation.md)
- [Orthographic Projection? 📸](2_orthographic_projection.md)
- [Viewport Transform for Orthographic LiDAR Projection](3_viewport_transform.md)
- [Perspective Projection, Intrinsics, and Depth](4_perspective_intrinsics_and_depth.md)
- [Dissecting the Camera Matrix, Part 3: The Intrinsic Matrix](https://ksimek.github.io/2013/08/13/intrinsic/)
- [Scratchapixel - Building a Basic Perspective Projection Matrix](https://www.scratchapixel.com/lessons/3d-basic-rendering/perspective-and-orthographic-projection-matrix/building-basic-perspective-projection-matrix.html)
- [LearnOpenGL - Coordinate Systems](https://learnopengl.com/Getting-Started/Coordinate-Systems)
