# Viewport Transform for Orthographic LiDAR Projection

This is **Part 3** of a 3-part series. Part 1 covers camera-space transformation, Part 2 covers orthographic projection into normalized device coordinates, and this post focuses on the last step: how normalized coordinates become actual image pixels in a LiDAR orthographic projection workflow.

The series is:

1. [Understanding Camera Coordinate Transformations](camera_transformation.md)
2. [Orthographic Projection? 📸](orthographic_projection.md)
3. [Viewport Transform for Orthographic LiDAR Projection](viewport_transform.md)

If you have not read the previous steps yet, start with [Understanding Camera Coordinate Transformations](camera_transformation.md) and then [Orthographic Projection? 📸](orthographic_projection.md).

---

- [Viewport Transform for Orthographic LiDAR Projection](#viewport-transform-for-orthographic-lidar-projection)
- [1. Where the Pipeline Starts](#1-where-the-pipeline-starts)
- [2. From World Space to Camera Space](#2-from-world-space-to-camera-space)
- [3. Orthographic Projection Into NDC](#3-orthographic-projection-into-ndc)
- [4. The Viewport Transform](#4-the-viewport-transform)
- [5. Why the Image Size Is Chosen First](#5-why-the-image-size-is-chosen-first)
- [6. Rendering Order Still Matters](#6-rendering-order-still-matters)
- [7. Measuring Distances After Projection](#7-measuring-distances-after-projection)
- [8. Full Formula Chain](#8-full-formula-chain)
- [References](#references)


# 1. Where the Pipeline Starts

In a typical headless LiDAR projection workflow, the program:

1. reads a `.las` point cloud,
2. loads a saved Open3D camera viewpoint,
3. takes the camera **extrinsic** matrix,
4. projects the visible points orthographically into image space,
5. writes the resulting 2D projection to an image.

The important point is that the saved viewpoint provides the camera pose, and the projection stage turns that pose plus the 3D points into a 2D raster image.

---

# 2. From World Space to Camera Space

Inside the projection stage, each 3D point is first written in homogeneous form:

$$
P_{\text{world}}^h = \begin{pmatrix}x\\y\\z\\1\end{pmatrix}
$$

Then it is transformed with the camera extrinsic matrix:

$$
P_{\text{cam}}^h = E \cdot P_{\text{world}}^h
$$

This gives camera-space coordinates for every point.

The code then keeps only points with

$$
z_{\text{cam}} > 0
$$

So in this workflow, points in front of the camera are treated as having positive camera-space z. This is important because the orthographic matrix is built for a `+z` forward convention.

---

# 3. Orthographic Projection Into NDC

After filtering visible points, the code computes the camera-space bounds:

- `left = min_x`
- `right = max_x`
- `bottom = min_y`
- `top = max_y`
- `near = min_z`
- `far = max_z`

These values define the visible orthographic box around the point cloud.

The projection matrix used in this workflow is:

$$
M_{\text{ortho}} =
\begin{pmatrix}
\frac{2}{r-l} & 0 & 0 & -\frac{r+l}{r-l} \\
0 & \frac{2}{t-b} & 0 & -\frac{t+b}{t-b} \\
0 & 0 & \frac{2}{f-n} & -\frac{f+n}{f-n} \\
0 & 0 & 0 & 1
\end{pmatrix}
$$

because the projection uses the `+z` forward convention.

Applying this matrix maps points into **Normalized Device Coordinates**:

$$
P_{\text{ndc}} = M_{\text{ortho}} \cdot P_{\text{cam}}^h
$$

Now x, y, and z are in the range `[-1, 1]` for the visible box.

One nice thing about orthographic projection is that there is no perspective divide here. The projected x and y values can be used directly because orthographic projection keeps the geometry linear.

---

# 4. The Viewport Transform

This is the main topic of Part 3.

After orthographic projection, the points are not yet in pixel coordinates. They are only in normalized coordinates. The rasterization step converts them into image positions with:

$$
u = \left(x_{\text{ndc}} + 1\right)\cdot 0.5 \cdot W
$$

$$
v = \left(y_{\text{ndc}} + 1\right)\cdot 0.5 \cdot H
$$

and then casts both to integers.

This is the viewport transform.

It does two simple things:

1. shifts the NDC interval from `[-1,1]` to `[0,2]`,
2. scales that interval to the image size.

So:

- `x_ndc = -1` maps to the left side of the image,
- `x_ndc = 0` maps to the horizontal middle,
- `x_ndc = 1` maps to the right side,
- `y_ndc = -1` maps to the top or bottom depending on axis convention,
- `y_ndc = 1` maps to the opposite edge.

In this workflow, the same formula is used for both x and y. There is no extra y-flip. That matches the chosen camera/image convention: camera-space y is already treated consistently with image row indexing for this orthographic output.

In matrix form, the 2D viewport remapping is:

$$
\begin{aligned}
u &= \frac{W}{2}x_{\text{ndc}} + \frac{W}{2} \\
v &= \frac{H}{2}y_{\text{ndc}} + \frac{H}{2}
\end{aligned}
$$

That is just a scale followed by a translation.

---

# 5. Why the Image Size Is Chosen First

Before rasterizing, the image width and height are chosen from the visible scene size:

$$
\text{scene width} = \max(x_{\text{cam}}) - \min(x_{\text{cam}})
$$

$$
\text{scene height} = \max(y_{\text{cam}}) - \min(y_{\text{cam}})
$$

Then it preserves aspect ratio and sets the larger image dimension to `resulting_image_max_dimension` which defaults to `1920`.

This matters because the viewport transform should not stretch the point cloud. If the scene is wider than it is tall, the image becomes wide. If the scene is taller, the image becomes tall. So one meter in x and one meter in y stay visually consistent.

---

# 6. Rendering Order Still Matters

Even though the projection is orthographic, depth is still useful.

After the viewport transform, the projected points are sorted by camera-space z and the farther points are drawn first. Then nearer points overwrite them. This is a simple painter-style approach:

$$
\text{sort by } -z_{\text{cam}}
$$

That way the final raster image better matches what the camera should see from that direction.

---

# 7. Measuring Distances After Projection

This pipeline does something practical with the viewport transform: it uses it for measurement.

If two point indices are selected, the workflow can compute:

- 3D distance in world space,
- 3D distance in camera space,
- 2D distance in the camera xy plane,
- 2D distance in pixel coordinates.

For the pixel-space measurement, the same viewport equations are reused:

$$
u_i = \left(x_{\text{ndc},i} + 1\right)\cdot 0.5 \cdot W
,\quad
v_i = \left(y_{\text{ndc},i} + 1\right)\cdot 0.5 \cdot H
$$

Then the pixel distance is:

$$
d_{\text{pixel}} =
\sqrt{(u_2-u_1)^2 + (v_2-v_1)^2}
$$

Finally, that pixel distance can be converted back into scene units by using:

$$
\text{pixel width in scene units} = \frac{\text{scene width}}{W}
$$

$$
\text{pixel height in scene units} = \frac{\text{scene height}}{H}
$$

So the viewport transform is not only a rendering step. It becomes the bridge between the projected image and real measurements.

---

# 8. Full Formula Chain

For this LiDAR pipeline, the full path is:

$$
P_{\text{world}}
\xrightarrow{\text{extrinsic}}
P_{\text{cam}}
\xrightarrow{\text{orthographic matrix}}
P_{\text{ndc}}
\xrightarrow{\text{viewport transform}}
P_{\text{pixel}}
$$

Written compactly:

$$
P_{\text{pixel}} =
\text{Viewport}
\left(
M_{\text{ortho}}
\cdot
E
\cdot
P_{\text{world}}^h
\right)
$$

The important point is that the viewport transform is not some mysterious extra graphics step. It is just the final linear remapping from normalized coordinates into discrete image coordinates.

# References

1. [Understanding Camera Coordinate Transformations](camera_transformation.md)
2. [Right-Handed vs Left-Handed Coordinate Systems](right_hand_vs_left_hand.md)
3. Scratchapixel, [Computing Pixel Coordinates of 3D Points](https://www.scratchapixel.com/lessons/3d-basic-rendering/computing-pixel-coordinates-of-3d-point/mathematics-computing-2d-coordinates-of-3d-points.html)
