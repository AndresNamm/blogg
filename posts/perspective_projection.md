# Perspective Projection

This is **Part 4** of a 4-part series:

1. [Understanding Camera Coordinate Transformations](camera_transformation.md)
2. [Orthographic Projection? 📸](orthographic_projection.md)
3. [Viewport Transform for Orthographic LiDAR Projection](viewport_transform.md)
4. [Perspective Projection](perspective_projection.md)

The previous posts explained the orthographic path used in `lidar_utils.py`: transform points into camera space, map them into normalized device coordinates, and then remap those normalized coordinates into pixels.

This post answers the natural next question: what changes if we want a **perspective camera** instead?

Perspective projection is the model used by ordinary cameras and by the classic pinhole camera in computer vision. Unlike orthographic projection, it makes distant objects appear smaller because image position depends on the ratio between a point's lateral offset and its depth.

---

- [Perspective Projection](#perspective-projection)
- [1. Why Perspective Projection Is Different](#1-why-perspective-projection-is-different)
- [2. We Still Start in Camera Space](#2-we-still-start-in-camera-space)
- [3. Similar Triangles Give the Core Formula](#3-similar-triangles-give-the-core-formula)
- [4. From a Frustum to NDC](#4-from-a-frustum-to-ndc)
- [5. Perspective Projection Matrix for the `+z`-Forward Convention](#5-perspective-projection-matrix-for-the-z-forward-convention)
- [6. The Perspective Divide](#6-the-perspective-divide)
- [7. From NDC to Pixels](#7-from-ndc-to-pixels)
- [8. Connection to the Pinhole Camera Intrinsics](#8-connection-to-the-pinhole-camera-intrinsics)
- [9. What Would Change in `lidar_utils.py`](#9-what-would-change-in-lidar_utilspy)
- [10. Orthographic vs Perspective in This Workflow](#10-orthographic-vs-perspective-in-this-workflow)
- [References](#references)


# 1. Why Perspective Projection Is Different

In orthographic projection, the projected x and y coordinates do **not** depend on depth. If two identical circles are at different distances from the camera, they keep the same size in the final image.

In perspective projection, depth matters directly:

- points farther away move closer to the image center,
- nearby objects occupy more pixels,
- parallel lines can appear to converge.

So perspective projection is not just "another matrix". It changes the geometry of the image in a fundamental way.

The visible region is also different:

- orthographic projection uses a **box-shaped view volume**,
- perspective projection uses a **frustum**, which is a truncated pyramid.

---

# 2. We Still Start in Camera Space

Nothing changes about the first step from Part 1.

We still begin with a world-space point

$$
P_{\text{world}}^h =
\begin{pmatrix}
x\\y\\z\\1
\end{pmatrix}
$$

and transform it with the camera extrinsic matrix:

$$
P_{\text{cam}}^h = E \cdot P_{\text{world}}^h
$$

giving

$$
P_{\text{cam}}^h =
\begin{pmatrix}
x_{\text{cam}}\\y_{\text{cam}}\\z_{\text{cam}}\\1
\end{pmatrix}
$$

In the current LiDAR workflow from `lidar_utils.py`, points in front of the camera are treated as

$$
z_{\text{cam}} > 0
$$

so in this article we keep the same **`+z`-forward convention** for consistency.

---

# 3. Similar Triangles Give the Core Formula

Before writing a matrix, it is better to understand the geometry.

Assume the image plane sits at distance `n` from the camera center, where `n` is the near-plane distance. For a camera-space point

$$
\left(x_{\text{cam}}, y_{\text{cam}}, z_{\text{cam}}\right)
$$

with $z_{\text{cam}} > 0$, similar triangles give:

$$
x_{\text{proj}} = n \frac{x_{\text{cam}}}{z_{\text{cam}}}
$$

$$
y_{\text{proj}} = n \frac{y_{\text{cam}}}{z_{\text{cam}}}
$$

This is the key fact behind perspective projection:

- divide by depth,
- then scale by the focal distance or near-plane distance.

That single division by $z_{\text{cam}}$ is why faraway points shrink toward the center.

---

# 4. From a Frustum to NDC

For perspective projection, the camera-space visible region is described by six planes:

- left: $l$
- right: $r$
- bottom: $b$
- top: $t$
- near: $n$
- far: $f$

Unlike orthographic projection, these `left/right/top/bottom` values are usually understood on the **near plane**.

At depth `n`, the visible rectangle is

$$
x \in [l, r], \quad y \in [b, t]
$$

At larger depths, the visible region expands proportionally, forming a frustum.

The goal is still the same as before: map the visible region into the **Normalized Device Coordinates** cube

$$
[-1,1]\times[-1,1]\times[-1,1]
$$

but now the mapping cannot stay fully linear in ordinary 3D coordinates because x and y must be divided by z.

That is why perspective projection uses:

1. a 4D homogeneous matrix,
2. followed by a **perspective divide**.

---

# 5. Perspective Projection Matrix for the `+z`-Forward Convention

To stay consistent with the current LiDAR code path, we derive the matrix for a camera convention where:

- the camera is at the origin,
- points in front satisfy $z_{\text{cam}} > 0$,
- near and far are positive distances with $0 < n < f$.

The perspective projection matrix is then

$$
M_{\text{persp}} =
\begin{pmatrix}
\frac{2n}{r-l} & 0 & -\frac{r+l}{r-l} & 0 \\
0 & \frac{2n}{t-b} & -\frac{t+b}{t-b} & 0 \\
0 & 0 & \frac{f+n}{f-n} & -\frac{2fn}{f-n} \\
0 & 0 & 1 & 0
\end{pmatrix}
$$

Apply it to the camera-space homogeneous point:

$$
P_{\text{clip}} =
M_{\text{persp}}
\cdot
P_{\text{cam}}^h
$$

The result is a clip-space vector

$$
P_{\text{clip}} =
\begin{pmatrix}
x_c\\y_c\\z_c\\w_c
\end{pmatrix}
$$

with

$$
w_c = z_{\text{cam}}
$$

That last row is the essential difference from orthographic projection. It prepares the perspective divide.

For a symmetric frustum, where

$$
l=-r,\quad b=-t
$$

and with vertical field of view $\theta$ and aspect ratio $a=\frac{W}{H}$,

$$
t = n\tan\left(\frac{\theta}{2}\right),
\quad
r = a\,t
$$

the matrix simplifies to

$$
M_{\text{persp}} =
\begin{pmatrix}
\frac{1}{a\tan(\theta/2)} & 0 & 0 & 0 \\
0 & \frac{1}{\tan(\theta/2)} & 0 & 0 \\
0 & 0 & \frac{f+n}{f-n} & -\frac{2fn}{f-n} \\
0 & 0 & 1 & 0
\end{pmatrix}
$$

which makes the field-of-view dependence very explicit.

---

# 6. The Perspective Divide

After the matrix multiplication, the coordinates are **not yet** in NDC. We still have to divide by the homogeneous coordinate:

$$
x_{\text{ndc}} = \frac{x_c}{w_c}, \quad
y_{\text{ndc}} = \frac{y_c}{w_c}, \quad
z_{\text{ndc}} = \frac{z_c}{w_c}
$$

Since $w_c = z_{\text{cam}}$, this gives exactly the depth division we expected from similar triangles.

For example, the x-coordinate becomes

$$
x_{\text{ndc}} =
\frac{2n}{r-l}\frac{x_{\text{cam}}}{z_{\text{cam}}}
-\frac{r+l}{r-l}
$$

If the frustum is centered, so $l=-r$, then this reduces to

$$
x_{\text{ndc}} =
\frac{n}{r}\frac{x_{\text{cam}}}{z_{\text{cam}}}
$$

and similarly

$$
y_{\text{ndc}} =
\frac{n}{t}\frac{y_{\text{cam}}}{z_{\text{cam}}}
$$

This is the perspective effect in its simplest form: x and y are scaled by $\frac{1}{z}$.

---

# 7. From NDC to Pixels

Once the perspective divide is finished, the last step looks exactly like Part 3.

We map normalized coordinates into pixel coordinates:

$$
u = \left(x_{\text{ndc}} + 1\right)\cdot 0.5 \cdot W
$$

$$
v = \left(y_{\text{ndc}} + 1\right)\cdot 0.5 \cdot H
$$

So the full pipeline is now

$$
P_{\text{world}}
\xrightarrow{\text{extrinsic}}
P_{\text{cam}}
\xrightarrow{\text{perspective matrix}}
P_{\text{clip}}
\xrightarrow{\text{divide by }w}
P_{\text{ndc}}
\xrightarrow{\text{viewport transform}}
P_{\text{pixel}}
$$

The important difference from orthographic projection is the extra stage:

$$
P_{\text{clip}} \to P_{\text{ndc}}
$$

That step is the perspective divide, and without it the projection is not correct.

---

# 8. Connection to the Pinhole Camera Intrinsics

In computer vision, perspective projection is often written with camera intrinsics:

$$
u = f_x \frac{x_{\text{cam}}}{z_{\text{cam}}} + c_x
$$

$$
v = f_y \frac{y_{\text{cam}}}{z_{\text{cam}}} + c_y
$$

where:

- $f_x, f_y$ are focal lengths measured in pixels,
- $(c_x, c_y)$ is the principal point.

This is the same perspective model as the graphics pipeline, just written more directly in pixel coordinates.

If the principal point is centered and the viewport mapping is symmetric, then

$$
c_x = \frac{W}{2},
\quad
c_y = \frac{H}{2}
$$

and the focal lengths are related to field of view by

$$
f_x = \frac{W}{2a\tan(\theta/2)}
$$

$$
f_y = \frac{H}{2\tan(\theta/2)}
$$

So the graphics-style frustum matrix and the computer-vision pinhole equations are two views of the same geometry.

---

# 9. What Would Change in `lidar_utils.py`

The current function `orthographic_project_points_to_image(...)` does this:

1. transform points into camera space,
2. keep points with $z_{\text{cam}} > 0$,
3. compute camera-space min and max bounds,
4. build an orthographic matrix,
5. map directly into NDC,
6. remap NDC into pixels.

A perspective version would change the middle of that pipeline:

1. transform points into camera space,
2. keep points with $z_{\text{cam}} > 0$ and also clip to near/far,
3. choose a field of view or camera intrinsics,
4. build a **perspective** projection matrix,
5. multiply into clip space,
6. divide each point by its own homogeneous $w$,
7. then apply the same viewport transform.

So compared with the orthographic path, the two important additions are:

- the view volume becomes a frustum instead of a box,
- the projected coordinates must be divided by $w$.

That second step is not optional. It is the step that creates depth-dependent magnification.

---

# 10. Orthographic vs Perspective in This Workflow

For this timber and LiDAR workflow, orthographic projection is often a sensible choice because:

- it preserves scale across the whole image,
- widths and areas are easier to interpret,
- measurements in the projected plane stay simple.

Perspective projection is more appropriate when:

- you want the result to match a real camera view,
- depth cues matter visually,
- you need compatibility with pinhole-camera calibration and image formation models.

So the choice is not about which projection is "better". It depends on the task:

- use **orthographic projection** when geometric comparability across the image is the priority,
- use **perspective projection** when realistic image formation is the priority.

---

# References

1. [Understanding Camera Coordinate Transformations](camera_transformation.md)
2. [Orthographic Projection? 📸](orthographic_projection.md)
3. [Viewport Transform for Orthographic LiDAR Projection](viewport_transform.md)
4. Scratchapixel, [Computing Pixel Coordinates of 3D Points](https://www.scratchapixel.com/lessons/3d-basic-rendering/computing-pixel-coordinates-of-3d-point/mathematics-computing-2d-coordinates-of-3d-points.html)
