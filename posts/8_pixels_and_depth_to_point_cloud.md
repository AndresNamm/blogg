# Creating a Point Cloud from Pixels and Depth

This is **Part 8** of the series:

1. [Understanding Camera Coordinate Transformations](1_camera_transformation.md)
2. [Orthographic Projection? 📸](2_orthographic_projection.md)
3. [Viewport Transform for Orthographic LiDAR Projection](3_viewport_transform.md)
4. [Perspective Projection, Intrinsics, and Depth](4_perspective_intrinsics_and_depth.md)
5. [Orthographic vs Perspective: Scaling, the Perspective Divide, and Getting to Pixels](5_ortho_vs_perspective_scaling.md)
6. [Measuring Objects Viewed at an Angle in Perspective Images](6_objects_under_angle_perspective.md)
7. [Z-Depth vs Euclidean Depth in Perspective Projection](7_z_depth_vs_euclidean_depth.md)
8. [Creating a Point Cloud from Pixels and Depth](8_pixels_and_depth_to_point_cloud.md)

---

# The Main Idea

An RGB image tells us:

```text
pixel (u, v) -> color
```

A depth image tells us:

```text
pixel (u, v) -> distance
```

The camera intrinsics tell us which direction that pixel looks. Combining the
direction and distance gives one 3D point. Repeating this for every valid depth
pixel creates a point cloud.

---

# Pixel to 3D Point

For pixel $(u,v)$ and camera intrinsics $(f_x,f_y,c_x,c_y)$, form the ray:

$$
q=
\begin{pmatrix}
\dfrac{u-c_x}{f_x}\\[4pt]
\dfrac{v-c_y}{f_y}\\[4pt]
1
\end{pmatrix}.
$$

If the depth image stores **Z-depth**:

$$
P=Zq.
$$

Therefore:

$$
X=(u-c_x)\frac{Z}{f_x},
\qquad
Y=(v-c_y)\frac{Z}{f_y},
\qquad
Z=Z.
$$

If the depth image stores **Euclidean depth** $r$, first form $q$ as above,
then normalize it by dividing by its length:

$$
\hat q=\frac{q}{\lVert q\rVert}.
$$

This produces a unit ray: it points in the same direction as $q$ but has
length $1$. Finally, scale that unit ray by the measured distance $r$:

$$
P=r\hat q=r\frac{q}{\lVert q\rVert}.
$$

See [Z-Depth vs Euclidean Depth](7_z_depth_vs_euclidean_depth.md) for a
detailed comparison.

---

# Minimal Example

The following example assumes that `depth` contains Z-depth in meters:

```python
import numpy as np

points = []
colors = []

height, width = depth.shape

for v in range(height):
    for u in range(width):
        z = depth[v, u]

        if not np.isfinite(z) or z <= 0:
            continue

        x = (u - cx) * z / fx
        y = (v - cy) * z / fy

        points.append([x, y, z])
        colors.append(rgb[v, u] / 255.0)

points = np.asarray(points)
colors = np.asarray(colors)
```

`points` now contains the 3D coordinates, while `colors` contains the RGB color
of each corresponding point.

---

# What Must Be Correct?

The reconstruction is simple, but its inputs must agree:

- The camera intrinsics must belong to the image resolution being used.
- You must know whether the depth values are Z-depth or Euclidean depth.
- You must know the depth unit, such as millimeters or meters.
- The RGB and depth images must describe the same viewing rays.
- Invalid or missing depth values must be removed.

The resulting points are initially in the **camera coordinate system**. A
camera-to-world transformation is needed if the point cloud should be placed
in world coordinates or combined with point clouds from other camera poses.

---

# The Short Version

For each pixel:

1. Use the intrinsics to calculate its viewing ray.
2. Use the depth value to place a point on that ray.
3. Attach the pixel's RGB value to the point.

In one sentence:

> Pixels provide directions and colors, while depth provides distance; together they produce a colored 3D point cloud.
