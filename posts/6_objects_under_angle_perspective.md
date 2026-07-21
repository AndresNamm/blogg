# Measuring Objects Viewed at an Angle in Perspective Images

The previous posts explained how a camera turns 3D points into pixels, and how camera intrinsics and depth let us reverse that process.

This post tackles the next practical problem:

> How do we measure the real area of a surface when the camera sees it at an angle?

Imagine a circular log face. When the camera looks straight at it, the face looks circular. When the camera moves to the side, the same face looks like a narrow ellipse.

The log did not shrink. Only its **projection into the image** changed.

The central idea of this post is:

> Do not try to measure the tilted shape directly in image pixels. Reconstruct where the shape is in 3D, place a 2D coordinate system on its surface, and measure it there.

We will build that idea slowly. The goal is not only to present the formulas, but to explain what each formula is doing and why it is needed.

This is **Part 6** of the series:

1. [Understanding Camera Coordinate Transformations](1_camera_transformation.md)
2. [Orthographic Projection? 📸](2_orthographic_projection.md)
3. [Viewport Transform for Orthographic LiDAR Projection](3_viewport_transform.md)
4. [Perspective Projection, Intrinsics, and Depth](4_perspective_intrinsics_and_depth.md)
5. [Orthographic vs Perspective: Scaling, the Perspective Divide, and Getting to Pixels](5_ortho_vs_perspective_scaling.md)
6. [Measuring Objects Viewed at an Angle in Perspective Images](6_objects_under_angle_perspective.md)
7. [Z-Depth vs Euclidean Depth in Perspective Projection](7_z_depth_vs_euclidean_depth.md)

---

# Table of Contents

- [Glossary](#glossary)
- [1. The Problem: A Tilted Surface Looks Smaller](#1-the-problem-a-tilted-surface-looks-smaller)
- [2. Depth and Surface Angle Are Different Problems](#2-depth-and-surface-angle-are-different-problems)
- [3. Why a Simple Sum of Pixel Areas Is Not Enough](#3-why-a-simple-sum-of-pixel-areas-is-not-enough)
- [4. Reconstructing a Segmented Pixel in 3D](#4-reconstructing-a-segmented-pixel-in-3d)
  - [Case 1: the depth map stores camera-axis depth](#case-1-the-depth-map-stores-camera-axis-depth)
  - [Case 2: the depth sensor stores distance along the ray](#case-2-the-depth-sensor-stores-distance-along-the-ray)
- [5. Two Ways to Measure the Reconstructed Face](#5-two-ways-to-measure-the-reconstructed-face)
- [6. Method A: Build Small 3D Triangles](#6-method-a-build-small-3d-triangles)
- [7. Method B: Measure the Boundary in the Log-Face Plane](#7-method-b-measure-the-boundary-in-the-log-face-plane)
- [8. Fitting the Plane](#8-fitting-the-plane)
- [9. Intersecting Boundary Rays with the Plane](#9-intersecting-boundary-rays-with-the-plane)
- [10. Turning the 3D Boundary into a 2D Metric Polygon](#10-turning-the-3d-boundary-into-a-2d-metric-polygon)
- [11. Calculating Area with the Shoelace Formula](#11-calculating-area-with-the-shoelace-formula)
- [12. Measuring Diameter](#12-measuring-diameter)
- [13. RGB and Depth Must Describe the Same Rays](#13-rgb-and-depth-must-describe-the-same-rays)
- [14. Complete Log-Face Measurement Pipeline](#14-complete-log-face-measurement-pipeline)
- [15. Common Mistakes](#15-common-mistakes)
- [16. The Short Version](#16-the-short-version)

---

# Glossary

- **Pixel coordinate $(u,v)$**: A position in the image. Usually $u$ increases to the right and $v$ increases downward.
- **Camera coordinates $(X,Y,Z)$**: A 3D position measured relative to the camera. In the convention used here, $Z$ points forward from the camera.
- **Camera intrinsics**: The numbers that describe how 3D camera rays map to image pixels. The most important ones here are $f_x$, $f_y$, $c_x$, and $c_y$.
- **Viewing ray**: The 3D line starting at the camera center and passing through one image pixel.
- **Depth map**: An image-sized array in which each pixel stores the depth or range of the visible surface.
- **Segmentation mask**: An image that labels which pixels belong to the object we want to measure.
- **Surface normal**: A vector perpendicular to a surface. It tells us which direction the surface is facing.
- **Foreshortening**: The apparent shrinking of a surface when it is viewed at an angle.
- **Dot product**: An operation that tells us how much two directions point the same way.
- **Cross product**: An operation on two 3D vectors. Its magnitude gives the area of the parallelogram made by those vectors.
- **Plane fitting**: Estimating the flat plane that best passes through a set of noisy 3D points.
- **Extrinsic calibration**: The rotation and translation that connect the coordinate systems of two cameras or sensors.

---

# 1. The Problem: A Tilted Surface Looks Smaller

Take a sheet of paper and hold it directly in front of your eyes. You see most of its area.

Now rotate it until you almost see it from the side. The paper still has the same physical width, height, and area, but its visible projection becomes very thin.

The same thing happens to a circular log face:

```text
front view                 angled view from side

   ______                      __
 /        \                   /  \
|          |      ->         |    |
 \ ______ /                   \__/

looks circular             looks elliptical and narrow
```

The image contains a **projection** of the surface, not the surface itself.

## The cosine relationship

For a small flat patch, let:

- $A_{\text{surface}}$ be its real area;
- $A_{\text{facing}}$ be the area of its projection onto a plane facing the camera;
- $\mathbf n$ be a unit surface normal;
- $\mathbf d$ be a unit viewing direction;
- $\alpha$ be the angle between $\mathbf n$ and $\mathbf d$.

Then:

$$
A_{\text{facing}}
=
A_{\text{surface}}|\cos(\alpha)|
$$

A **unit vector** has length $1$. Using unit vectors is useful because their dot product is exactly the cosine of the angle between them:

$$
\mathbf n\cdot\mathbf d=\cos(\alpha)
$$

For two 3D vectors:

$$
\mathbf a=(a_x,a_y,a_z)
$$

and:

$$
\mathbf b=(b_x,b_y,b_z)
$$

the dot product is calculated by multiplying matching components and adding them:

$$
\mathbf a\cdot\mathbf b
=
a_xb_x+a_yb_y+a_zb_z
$$

For example, suppose:

$$
\mathbf n=(0,0,1)
$$

and:

$$
\mathbf d=(0.866,0,0.5)
$$

Both are unit vectors. Their dot product is:

$$
\mathbf n\cdot\mathbf d
=
0\cdot0.866+0\cdot0+1\cdot0.5
=
0.5
$$

Therefore:

$$
\cos(\alpha)=0.5
$$

which means:

$$
\alpha=60^\circ
$$

The surface normal can point in either direction through the surface. The absolute value in the area formula makes both choices produce the same area.

Therefore:

$$
A_{\text{facing}}
=
A_{\text{surface}}|\mathbf n\cdot\mathbf d|
$$

and:

$$
A_{\text{surface}}
=
\frac{A_{\text{facing}}}{|\mathbf n\cdot\mathbf d|}
$$

## Easy numerical example

Suppose a flat object has real area:

$$
A_{\text{surface}}=100\text{ cm}^2
$$

and is viewed at:

$$
\alpha=60^\circ
$$

Because:

$$
\cos(60^\circ)=0.5
$$

its projected area is:

$$
A_{\text{facing}}
=
100\cdot 0.5
=
50\text{ cm}^2
$$

The object appears to have half its real area.

To recover the real area:

$$
A_{\text{surface}}
=
\frac{50}{0.5}
=
100\text{ cm}^2
$$

## Why this formula is useful but not the final method

The cosine formula gives the correct intuition:

```text
more tilt
    -> smaller dot product
    -> smaller projected area
    -> larger correction
```

However, applying one cosine correction to a real image can be fragile:

- we need to know the surface normal accurately;
- perspective means viewing rays are not exactly parallel;
- a surface may be curved rather than perfectly flat;
- segmentation and depth contain noise.

When depth is available, it is usually clearer and safer to reconstruct the surface in 3D and measure its geometry directly. The cosine effect is then already contained in the reconstructed points.

---

# 2. Depth and Surface Angle Are Different Problems

There are two independent reasons why a pixel does not represent one fixed number of square millimeters.

## Problem A: distance from the camera

A distant object looks smaller than a nearby object.

```text
same object nearby -> covers many pixels
same object far away -> covers few pixels
```

For a front-facing plane at constant camera-axis depth $Z$, reconstructing pixel $(u,v)$ gives:

$$
X(u)=Z\frac{u-c_x}{f_x},
\qquad
Y(v)=Z\frac{v-c_y}{f_y}
$$

The horizontal distance between two neighbouring pixel centers is therefore:

$$
\Delta X
=
X(u+1)-X(u)
=
Z\frac{(u+1-c_x)-(u-c_x)}{f_x}
=
\frac{Z}{f_x}
$$

The terms containing $u$ and $c_x$ cancel. The same happens vertically:

$$
\Delta Y=\frac{Z}{f_y}
$$

This does not mean that image location is generally irrelevant. It cancels here only because the surface is the plane $Z=\text{constant}$. The rays still depend on $(u,v)$, but equal pixel steps intersect this particular plane at equal metric intervals. For a tilted or curved surface, neighbouring rays reach different depths, so their reconstructed 3D points must be compared directly.

Under the constant-$Z$ assumption, the front-facing area represented by one pixel cell is:

$$
\Delta A_{\text{facing}}
=
\frac{Z^2}{f_xf_y}
$$

If the depth doubles, this area becomes approximately four times larger:

$$
(2Z)^2=4Z^2
$$

That is the **distance problem**.

## Problem B: direction of the surface

Even if two surfaces are at the same depth, a tilted surface stretches across the camera rays differently from a front-facing surface.

```text
surface facing camera -> short, compact pixel footprint
tilted surface        -> longer footprint along the surface
```

That is the **orientation problem**.

## A small comparison

Suppose one pixel corresponds to a front-facing patch of:

$$
1\text{ mm}\times1\text{ mm}
$$

Its front-facing area is:

$$
1\text{ mm}^2
$$

If the surface is tilted by $60^\circ$, the real surface patch corresponding to the same projected area is:

$$
\frac{1}{\cos(60^\circ)}
=
\frac{1}{0.5}
=
2\text{ mm}^2
$$

Depth told us the projected metric size. The surface angle told us how much real surface fits inside that projection.

We therefore need both:

1. **depth**, to locate the surface in 3D;
2. **orientation**, to understand how the surface passes through neighbouring camera rays.

---

# 3. Why a Simple Sum of Pixel Areas Is Not Enough

A tempting approach is:

1. count all pixels inside the segmentation mask;
2. calculate a metric area for one pixel;
3. multiply.

For example:

$$
A_{\text{estimate}}
=
N_{\text{pixels}}
\cdot
A_{\text{one pixel}}
$$

This can work approximately for a small, flat surface that faces the camera and stays at nearly constant depth.

It is not generally correct for a tilted surface.

## A pixel is a ray bundle, not a square sticker

It is convenient to draw a pixel as a little square in the image. In 3D, however, that pixel represents a small bundle of rays leaving the camera:

```text
camera
   \  |  /
    \ | /
     \|/
   one image pixel
```

The physical patch seen through that pixel depends on where those rays hit the surface.

```text
front-facing surface        tilted surface

 \ | /                       \ | /
  \|/                         \|/
  ---                         /
short patch                  / longer patch
```

The depth at one pixel gives one 3D point. It does not completely describe the local surface direction.

To recover direction, we must compare nearby points:

```text
pixel rays + depth
        -> neighbouring 3D points
        -> 3D edges between those points
        -> real surface patches
        -> metric area
```

This is why the two main methods later in this post either:

- connect neighbouring points into triangles; or
- fit one plane through many points.

Both methods use the relationship between multiple 3D points. That relationship is what reveals the surface angle.

---

# 4. Reconstructing a Segmented Pixel in 3D

Before measuring an area, we must turn each useful image pixel into a 3D point.

The camera intrinsic matrix is:

$$
K=
\begin{pmatrix}
f_x & 0 & c_x\\
0 & f_y & c_y\\
0 & 0 & 1
\end{pmatrix}
$$

where:

- $f_x$ is the focal length measured in horizontal pixels;
- $f_y$ is the focal length measured in vertical pixels;
- $(c_x,c_y)$ is the principal point, usually near the image center.

For pixel $(u,v)$, the unnormalised camera ray is:

$$
\mathbf q(u,v)=
\begin{pmatrix}
\dfrac{u-c_x}{f_x}\\[4pt]
\dfrac{v-c_y}{f_y}\\[4pt]
1
\end{pmatrix}
$$

This is the same as:

$$
\mathbf q
=
K^{-1}
\begin{pmatrix}
u\\v\\1
\end{pmatrix}
$$

## What the ray numbers mean

Write:

$$
\mathbf q=
\begin{pmatrix}
q_x\\q_y\\1
\end{pmatrix}
$$

The final value is fixed to $1$. The first two values say how far sideways and vertically the ray travels for each unit it travels forward.

For example:

$$
\mathbf q=
\begin{pmatrix}
0.1\\0.05\\1
\end{pmatrix}
$$

means:

```text
for every 1 meter forward:
    move 0.1 meters right
    move 0.05 meters down
```

The ray gives a direction but not yet a unique point. Every scaled version lies on the same ray:

$$
\mathbf q,\quad2\mathbf q,\quad3\mathbf q,\ldots
$$

Depth tells us which scale reaches the visible surface.

## Worked reconstruction example

Suppose:

$$
f_x=f_y=1000
$$

$$
(c_x,c_y)=(640,360)
$$

and we want the ray for:

$$
(u,v)=(740,410)
$$

Then:

$$
\frac{u-c_x}{f_x}
=
\frac{740-640}{1000}
=
0.1
$$

and:

$$
\frac{v-c_y}{f_y}
=
\frac{410-360}{1000}
=
0.05
$$

Therefore:

$$
\mathbf q=
\begin{pmatrix}
0.1\\0.05\\1
\end{pmatrix}
$$

What happens next depends on what the depth sensor means by "depth."

## Case 1: the depth map stores camera-axis depth

Many depth maps store $Z$: the point's distance along the camera's forward axis.

In that case:

$$
\mathbf P(u,v)=Z(u,v)\mathbf q(u,v)
$$

Written component by component:

$$
\mathbf P(u,v)=
\begin{pmatrix}
Z(u,v)\dfrac{u-c_x}{f_x}\\[5pt]
Z(u,v)\dfrac{v-c_y}{f_y}\\[5pt]
Z(u,v)
\end{pmatrix}
$$

Continuing the example, suppose:

$$
Z=2\text{ m}
$$

Then:

$$
\mathbf P
=
2
\begin{pmatrix}
0.1\\0.05\\1
\end{pmatrix}
=
\begin{pmatrix}
0.2\\0.1\\2
\end{pmatrix}
\text{ m}
$$

The visible point is:

- $0.2$ m to the right of the camera axis;
- $0.1$ m vertically from the camera axis;
- $2$ m forward.

## Case 2: the depth sensor stores distance along the ray

Some sensors store Euclidean range $r$: the straight-line distance from the camera center to the surface point.

Our vector $\mathbf q$ usually does not have length $1$, so multiplying it directly by $r$ would produce the wrong distance.

First normalise the ray:

$$
\mathbf d(u,v)
=
\frac{\mathbf q(u,v)}{\|\mathbf q(u,v)\|}
$$

The vector $\mathbf d$ points in the same direction as $\mathbf q$, but has length $1$.

Then:

$$
\mathbf P(u,v)=r(u,v)\mathbf d(u,v)
$$

For our example:

$$
\|\mathbf q\|
=
\sqrt{0.1^2+0.05^2+1^2}
\approx
1.0062
$$

so:

$$
\mathbf d
\approx
\begin{pmatrix}
0.0994\\0.0497\\0.9938
\end{pmatrix}
$$

If the ray range is:

$$
r=2\text{ m}
$$

then:

$$
\mathbf P
\approx
\begin{pmatrix}
0.1988\\0.0994\\1.9876
\end{pmatrix}
\text{ m}
$$

Notice that the $Z$ coordinate is slightly less than $2$ m. The full slanted distance is $2$ m, not the forward distance.

## The important warning

These two definitions are not interchangeable:

| Sensor value | Correct reconstruction |
|---|---|
| Camera-axis depth $Z$ | $\mathbf P=Z\mathbf q$ |
| Ray range $r$ | $\mathbf P=r\dfrac{\mathbf q}{\|\mathbf q\|}$ |

Always check the sensor or dataset documentation.

After reconstruction, every selected pixel has a point:

$$
\mathbf P(u,v)=(X,Y,Z)
$$

in metric camera coordinates.

---

# 5. Two Ways to Measure the Reconstructed Face

Once the segmented face exists as 3D points, there are two useful area calculations.

| Method | What it measures | Best use |
|---|---|---|
| A. Triangulate the surface | The detailed visible surface, including bumps | Curved or uneven surfaces |
| B. Fit a plane and measure the boundary | The area enclosed by the ideal flat face | Cut log cross-sections |

## Method A: triangulate the visible surface

Connect neighbouring depth pixels into small 3D triangles and add their areas.

Use this when:

- the surface is genuinely curved;
- bumps and texture should count toward the result;
- the depth map is dense and clean enough;
- you want actual visible surface area.

## Method B: fit a plane and measure the boundary

Fit one plane to reliable interior points, move the segmentation boundary onto that plane, and calculate the enclosed polygon area.

Use this when:

- the object is a cut log face;
- the desired quantity is cross-sectional area;
- the real surface should be approximately flat;
- individual depth measurements contain noise;
- depth near the object boundary is unreliable.

For a cut log face, **Method B is usually the better model**.

Imagine a cut face with tiny saw marks. Triangulation may count every little ridge and report a slightly larger surface area. A plane-based method ignores those ridges and measures the cross-section that we normally mean by "log area."

---

# 6. Method A: Build Small 3D Triangles

Take four neighbouring pixels and reconstruct their 3D points:

```text
P00 ---- P10
 |        |
 |        |
P01 ---- P11
```

These four points form one small surface cell. Split the cell into two triangles.

## Area of one 3D triangle

For a triangle with vertices $\mathbf A$, $\mathbf B$, and $\mathbf C$, make two edge vectors:

$$
\mathbf e_1=\mathbf B-\mathbf A
$$

$$
\mathbf e_2=\mathbf C-\mathbf A
$$

Both edges begin at $\mathbf A$.

The cross product:

$$
\mathbf e_1\times\mathbf e_2
$$

produces a vector perpendicular to both edges. Its magnitude equals the area of the parallelogram formed by the edges.

A triangle is half of that parallelogram, so:

$$
A_{\triangle}
=
\frac{1}{2}
\left\|
(\mathbf B-\mathbf A)
\times
(\mathbf C-\mathbf A)
\right\|
$$

## Easy triangle example

Take:

$$
\mathbf A=(0,0,0)
$$

$$
\mathbf B=(2,0,0)
$$

$$
\mathbf C=(0,1,0)
$$

Then:

$$
\mathbf B-\mathbf A=(2,0,0)
$$

and:

$$
\mathbf C-\mathbf A=(0,1,0)
$$

Their cross product is:

$$
(2,0,0)\times(0,1,0)=(0,0,2)
$$

Its magnitude is:

$$
\|(0,0,2)\|=2
$$

Therefore:

$$
A_{\triangle}
=
\frac{1}{2}\cdot2
=
1
$$

This matches the familiar formula:

$$
\frac{1}{2}\cdot\text{base}\cdot\text{height}
=
\frac{1}{2}\cdot2\cdot1
=
1
$$

The benefit of the cross-product formula is that it works in any 3D orientation. The triangle may be facing the camera, tilted, or nearly vertical.

## Area of one four-pixel cell

One possible split is:

$$
A_{\text{cell}}
=
\frac{1}{2}
\left\|
(\mathbf P_{10}-\mathbf P_{00})
\times
(\mathbf P_{01}-\mathbf P_{00})
\right\|
$$

$$
\quad+
\frac{1}{2}
\left\|
(\mathbf P_{11}-\mathbf P_{10})
\times
(\mathbf P_{01}-\mathbf P_{10})
\right\|
$$

The full visible surface area is approximately:

$$
A_{\text{surface}}
=
\sum_{\text{valid cells}}A_{\text{cell}}
$$

No separate angle correction is needed. A tilted patch creates longer or differently directed 3D edge vectors, and the cross product measures the area formed by those real edges.

## Which triangles should be rejected?

A practical implementation should reject a triangle if:

- one of its pixels lies outside the segmentation mask;
- one of its depth values is missing or invalid;
- an edge jumps across a large depth discontinuity;
- its area is much larger than neighbouring triangles because of an outlier;
- the triangle connects foreground and background surfaces.

Without these checks, a single bad depth value can create a long, thin triangle with a huge false area.

---

# 7. Method B: Measure the Boundary in the Log-Face Plane

For log measurement, we usually want the area inside the cut boundary, not the microscopic surface area of every fibre and saw mark.

The plane-based method separates the problem into two jobs:

- **depth** estimates where the face is and how it is tilted;
- **RGB segmentation** estimates the shape of its boundary.

The complete idea is:

```text
interior mask pixels + depth
        -> reliable interior 3D points
        -> fitted face plane

segmentation contour + camera intrinsics
        -> boundary rays
        -> intersections with the fitted plane

3D boundary in the plane
        -> local 2D metric polygon
        -> area
```

This separation is useful because depth cameras often behave badly at object edges. A boundary pixel may contain a mixture of foreground and background depth.

Instead of trusting boundary depth, we:

1. estimate the plane from safer interior depth points;
2. obtain the boundary from the RGB mask;
3. place that boundary onto the fitted plane using ray-plane intersections.

The result combines the strongest part of each input.

---

# 8. Fitting the Plane

Suppose we reconstruct $N$ reliable interior points:

$$
\mathbf P_1,\mathbf P_2,\ldots,\mathbf P_N
$$

A plane can be described by:

$$
\mathbf n\cdot(\mathbf P-\mathbf P_0)=0
$$

where:

- $\mathbf P_0$ is any point on the plane;
- $\mathbf n$ is a unit vector perpendicular to the plane;
- $\mathbf P$ is a point being tested.

## Understanding the plane equation

The vector:

$$
\mathbf P-\mathbf P_0
$$

travels from a known point on the plane to the test point.

If the test point is also in the plane, this movement is entirely sideways along the plane. A sideways vector has no component in the normal direction, so:

$$
\mathbf n\cdot(\mathbf P-\mathbf P_0)=0
$$

That is all the plane equation says.

## Step 1: find the center of the points

Use the centroid:

$$
\mathbf P_0
=
\frac{1}{N}
\sum_{i=1}^{N}\mathbf P_i
$$

This is the 3D average of all selected points.

For example, if the points are:

$$
(1,0,2),\quad(2,0,2),\quad(3,0,2)
$$

their centroid is:

$$
\mathbf P_0
=
\left(
\frac{1+2+3}{3},
\frac{0+0+0}{3},
\frac{2+2+2}{3}
\right)
=(2,0,2)
$$

## Step 2: center the point cloud

Subtract the centroid from every point and place the results into a matrix:

$$
M=
\begin{pmatrix}
(\mathbf P_1-\mathbf P_0)^T\\
(\mathbf P_2-\mathbf P_0)^T\\
\vdots\\
(\mathbf P_N-\mathbf P_0)^T
\end{pmatrix}
$$

Centering removes the plane's position so that the next calculation can focus on its directions.

## Step 3: find the direction with the least variation

Perform singular value decomposition:

$$
M=U\Sigma V^T
$$

The row of $V^T$ associated with the smallest singular value gives the plane normal $\mathbf n$.

That sentence can sound mysterious, but the intuition is simple.

Imagine a thin sheet of cardboard represented by a cloud of points:

- the points vary a lot from left to right;
- the points vary a lot from top to bottom;
- the points vary very little through the thickness of the cardboard.

The direction with the least variation is the direction through the cardboard. That direction is perpendicular to the sheet, so it is the plane normal.

SVD is the numerical tool that finds those directions.

## Handling outliers

Ordinary least squares tries to make every point happy. A few background points can therefore pull the fitted plane away from the real face.

Useful protections include:

- eroding the mask before selecting depth points, so points are farther from the boundary;
- rejecting missing and physically impossible depths;
- removing isolated depth values;
- using RANSAC to find the dominant plane;
- performing a final least-squares or SVD fit using only the inliers.

For a log face, a robust plane fit is usually more important than using every available point.

---

# 9. Intersecting Boundary Rays with the Plane

We now have:

- a fitted plane from reliable interior depth;
- an ordered contour from RGB segmentation.

For every contour pixel, camera intrinsics give a ray:

$$
\mathbf q=
\begin{pmatrix}
\dfrac{u-c_x}{f_x}\\[4pt]
\dfrac{v-c_y}{f_y}\\[4pt]
1
\end{pmatrix}
$$

We want to find where that ray meets the fitted plane.

## Step 1: write every point on the ray

Assume the camera center is the origin:

$$
\mathbf C=(0,0,0)
$$

Every point on the ray can be written as:

$$
\mathbf P(t)=t\mathbf q
$$

The scalar $t$ answers:

> How far must we scale this ray before it reaches the plane?

For the unnormalised ray used here, $t$ is camera-axis depth $Z$, because the third component of $\mathbf q$ is $1$.

## Step 2: require the ray point to satisfy the plane equation

The plane equation is:

$$
\mathbf n\cdot(\mathbf P-\mathbf P_0)=0
$$

Substitute:

$$
\mathbf P=t\mathbf q
$$

to get:

$$
\mathbf n\cdot(t\mathbf q-\mathbf P_0)=0
$$

Expand the dot product:

$$
t(\mathbf n\cdot\mathbf q)
-
\mathbf n\cdot\mathbf P_0
=0
$$

Move the second term:

$$
t(\mathbf n\cdot\mathbf q)
=
\mathbf n\cdot\mathbf P_0
$$

Therefore:

$$
t
=
\frac{\mathbf n\cdot\mathbf P_0}
{\mathbf n\cdot\mathbf q}
$$

Finally, the 3D boundary point is:

$$
\mathbf B=t\mathbf q
$$

Repeat this for every ordered contour pixel.

## Easy intersection example

Suppose the plane is front-facing at:

$$
Z=2
$$

One point on the plane is:

$$
\mathbf P_0=(0,0,2)
$$

and a unit normal is:

$$
\mathbf n=(0,0,1)
$$

Take the ray:

$$
\mathbf q=(0.1,0.05,1)
$$

The numerator is:

$$
\mathbf n\cdot\mathbf P_0
=(0,0,1)\cdot(0,0,2)
=2
$$

The denominator is:

$$
\mathbf n\cdot\mathbf q
=(0,0,1)\cdot(0.1,0.05,1)
=1
$$

Therefore:

$$
t=\frac{2}{1}=2
$$

and:

$$
\mathbf B
=
2(0.1,0.05,1)
=(0.2,0.1,2)
$$

For a tilted plane, the same formula works. Different boundary rays receive different values of $t$, which is exactly what we need to describe the tilt.

## Why shallow viewing angles are unstable

The denominator is:

$$
\mathbf n\cdot\mathbf q
$$

If it is close to zero, the ray is almost parallel to the plane.

Then:

$$
t
=
\frac{\text{some value}}
{\text{very small value}}
$$

becomes very large and very sensitive to tiny errors.

This is not only a numerical inconvenience. It describes a real loss of information. When a face is seen almost edge-on, one pixel of contour error can correspond to a large distance across the real surface.

A very shallow image should therefore be rejected or given low confidence.

---

# 10. Turning the 3D Boundary into a 2D Metric Polygon

The boundary points now lie in a 3D plane:

$$
\mathbf B_1,\mathbf B_2,\ldots,\mathbf B_N
$$

We could continue using 3D formulas, but area calculation is simpler if we place a local 2D coordinate system on the plane.

Imagine taping a sheet of graph paper directly onto the log face. The graph paper may be tilted in the camera coordinate system, but positions on the paper need only two coordinates:

```text
x = distance along the paper
y = distance up the paper
```

## Build two axes inside the plane

Choose two perpendicular unit vectors $\mathbf e_1$ and $\mathbf e_2$ that lie in the plane:

$$
\mathbf e_1\cdot\mathbf n=0
$$

$$
\mathbf e_2\cdot\mathbf n=0
$$

$$
\mathbf e_1\cdot\mathbf e_2=0
$$

One practical construction is:

1. choose any helper vector $\mathbf a$ that is not parallel to $\mathbf n$;
2. remove the part of $\mathbf a$ that points along $\mathbf n$;
3. normalise the result to create $\mathbf e_1$;
4. use a cross product to create $\mathbf e_2$.

Mathematically:

$$
\widetilde{\mathbf e}_1
=
\mathbf a-(\mathbf a\cdot\mathbf n)\mathbf n
$$

$$
\mathbf e_1
=
\frac{\widetilde{\mathbf e}_1}
{\|\widetilde{\mathbf e}_1\|}
$$

$$
\mathbf e_2
=
\mathbf n\times\mathbf e_1
$$

If $\mathbf n$ is almost parallel to $(1,0,0)$, choose another helper such as $(0,1,0)$. Otherwise the first vector can become almost zero.

## Convert each 3D point to plane coordinates

For each boundary point $\mathbf B_i$, first measure its displacement from the plane center:

$$
\mathbf B_i-\mathbf P_0
$$

Then measure how much of that displacement points along each plane axis:

$$
x_i
=
(\mathbf B_i-\mathbf P_0)\cdot\mathbf e_1
$$

$$
y_i
=
(\mathbf B_i-\mathbf P_0)\cdot\mathbf e_2
$$

The 3D boundary has now become an ordinary 2D polygon:

$$
(x_1,y_1),(x_2,y_2),\ldots,(x_N,y_N)
$$

These are not image pixels. They are metric coordinates on the real face.

If the depth values were in meters, then $x_i$ and $y_i$ are in meters.

This is the key conceptual step:

> We are not flattening the apparent ellipse from the image. We are describing the reconstructed boundary in the coordinate system of the actual log face.

Changing the choice of $\mathbf e_1$ and $\mathbf e_2$ only rotates or mirrors the local coordinate system. It does not change lengths or area.

---

# 11. Calculating Area with the Shoelace Formula

We now have an ordered metric polygon:

$$
(x_1,y_1),(x_2,y_2),\ldots,(x_N,y_N)
$$

"Ordered" means that the points follow the boundary in sequence rather than jumping randomly around it.

Set the point after the last point back to the first:

$$
(x_{N+1},y_{N+1})=(x_1,y_1)
$$

The polygon area is:

$$
A
=
\frac{1}{2}
\left|
\sum_{i=1}^{N}
(x_i y_{i+1}-x_{i+1}y_i)
\right|
$$

This is the **shoelace formula**.

The name comes from the crossing multiplication pattern:

```text
x1  y1
  \ /
   X
  / \
x2  y2
```

We multiply diagonally in one direction, subtract the diagonal product in the other direction, and repeat around the polygon.

## Rectangle example

Take a rectangle with corners in order:

$$
(0,0),\quad(2,0),\quad(2,1),\quad(0,1)
$$

Its area should be:

$$
2\cdot1=2
$$

The shoelace sum is:

$$
(0\cdot0-2\cdot0)
+
(2\cdot1-2\cdot0)
+
(2\cdot1-0\cdot1)
+
(0\cdot0-0\cdot1)
$$

which becomes:

$$
0+2+2+0=4
$$

Therefore:

$$
A=\frac{1}{2}|4|=2
$$

as expected.

## Units

If $x$ and $y$ are in meters:

$$
[x]=m,\qquad[y]=m
$$

then their products are in square meters:

$$
[xy]=m^2
$$

so:

$$
[A]=m^2
$$

To convert square meters to square centimeters:

$$
A_{\text{cm}^2}
=
10{,}000A_{\text{m}^2}
$$

because:

$$
1\text{ m}=100\text{ cm}
$$

and therefore:

$$
1\text{ m}^2
=(100\text{ cm})^2
=10{,}000\text{ cm}^2
$$

## Do not apply another cosine correction

The plane coordinates already describe the real tilted face. Applying:

$$
\frac{1}{|\cos(\alpha)|}
$$

again would correct the angle twice and overestimate the area.

---

# 12. Measuring Diameter

Once the boundary exists in local metric plane coordinates, diameter measurement becomes an ordinary 2D geometry problem.

## Approximately circular face

Fit a circle:

$$
(x-a)^2+(y-b)^2=r^2
$$

where:

- $(a,b)$ is the circle center;
- $r$ is the radius.

The diameter is:

$$
d=2r
$$

Because the fit happens in metric plane coordinates, $r$ and $d$ have the same physical unit as the depth data.

## Non-circular face

A real log face may not be a perfect circle. Useful alternatives include:

- fitting an ellipse and reporting major and minor diameters;
- calculating the maximum distance between boundary points;
- calculating widths along predefined directions;
- reporting an equivalent-area diameter.

The equivalent-area diameter is the diameter of a circle with the same area $A$ as the measured face.

Start with the circle area:

$$
A=\pi r^2
$$

Since:

$$
r=\frac{d_{\text{eq}}}{2}
$$

we have:

$$
A
=
\pi\left(\frac{d_{\text{eq}}}{2}\right)^2
$$

Solving for diameter:

$$
d_{\text{eq}}
=
2\sqrt{\frac{A}{\pi}}
$$

For example, if:

$$
A=0.1257\text{ m}^2
$$

then:

$$
d_{\text{eq}}
\approx
2\sqrt{\frac{0.1257}{\pi}}
\approx
0.4\text{ m}
$$

which corresponds to a circle about $40$ cm in diameter.

---

# 13. RGB and Depth Must Describe the Same Rays

So far, we have assumed that RGB pixel $(u,v)$ and depth value $(u,v)$ describe the same camera ray.

That is true only if the depth image has already been aligned to the RGB camera.

## Why two sensors do not naturally line up

An RGB camera and a depth camera may have:

- different physical positions;
- different orientations;
- different focal lengths;
- different principal points;
- different image resolutions;
- different lens distortion.

Think of looking at your finger with your left eye and then your right eye. Your finger appears to move relative to the background because the eyes have different camera centers.

Two nearby sensors have the same problem.

## Transforming depth points into the RGB camera

First reconstruct a point in depth-camera coordinates:

$$
\mathbf P_{\text{depth}}
$$

Then transform it into RGB-camera coordinates using extrinsic rotation $R$ and translation $\mathbf t$:

$$
\mathbf P_{\text{rgb}}
=
R\mathbf P_{\text{depth}}+\mathbf t
$$

If:

$$
\mathbf P_{\text{rgb}}
=
\begin{pmatrix}
X_{\text{rgb}}\\
Y_{\text{rgb}}\\
Z_{\text{rgb}}
\end{pmatrix}
$$

project it into the RGB image:

$$
u
=
f_x\frac{X_{\text{rgb}}}{Z_{\text{rgb}}}+c_x
$$

$$
v
=
f_y\frac{Y_{\text{rgb}}}{Z_{\text{rgb}}}+c_y
$$

Only after this alignment can we safely ask:

> Does this RGB segmentation pixel belong to this depth point?

Lens distortion must also be removed, or included in the ray calculation. Otherwise, especially near the image edges, the calculated ray direction will not match the real camera ray.

---

# 14. Complete Log-Face Measurement Pipeline

For a flat cut log face, the recommended pipeline is:

```text
1. Calibrate the RGB camera.
   Obtain fx, fy, cx, cy and lens-distortion parameters.

2. Correct lens distortion.
   Work with undistorted image coordinates or a ray model that includes distortion.

3. Align depth to RGB.
   Make sure RGB pixels and depth samples describe the same rays.

4. Segment the log face.
   Produce a binary mask and an ordered boundary contour.

5. Select reliable interior pixels.
   Erode the mask and reject invalid or suspicious depth values.

6. Reconstruct interior 3D points.
   Use the correct formula for Z-depth or ray range.

7. Fit a robust plane.
   Use RANSAC or another outlier-resistant method, then refine the fit.

8. Convert contour pixels to rays.
   Use the RGB camera intrinsics.

9. Intersect contour rays with the plane.
   This creates a clean 3D boundary on the estimated face.

10. Build a local 2D basis in the plane.
    This is the metric graph paper attached to the log face.

11. Convert the 3D boundary to 2D plane coordinates.
    Preserve the contour ordering.

12. Calculate area and diameter.
    Use the shoelace formula and the chosen diameter definition.

13. Report quality information.
    Include fit error, valid-depth count, and viewing-angle warnings.
```

In compact form:

$$
\text{RGB mask}
+
\text{intrinsics}
+
\text{aligned depth}
\longrightarrow
\text{3D face plane and boundary}
\longrightarrow
\text{metric area}
$$

Each input has a separate job:

| Input | Job |
|---|---|
| Segmentation mask | Says which image rays belong to the log face |
| Intrinsics | Give the direction of each camera ray |
| Depth | Locates visible face points in 3D |
| Plane fit | Estimates the face position and orientation |
| Segmentation contour | Defines the shape to measure |
| Plane basis | Converts the tilted 3D face into metric 2D coordinates |

## Useful sanity checks

A result should not be trusted only because the program produced a number.

Useful checks include:

- enough valid interior depth points were available;
- most selected points agree with the fitted plane;
- the plane-fit residual is small compared with the required accuracy;
- contour rays intersect the plane in front of the camera;
- $\mathbf n\cdot\mathbf q$ is not too close to zero;
- neighbouring reconstructed contour points do not make huge jumps;
- the measured size is physically plausible;
- repeated measurements of the same face are consistent.

If the measurement system will be used in practice, report a confidence or rejection reason alongside the area.

---

# 15. Common Mistakes

## Mistake 1: counting segmented pixels and multiplying by one constant

One constant image scale assumes that all relevant pixels have the same depth and surface orientation.

Perspective changes scale with depth, and foreshortening changes projected area with orientation.

## Mistake 2: correcting depth but ignoring surface orientation

Depth tells us where points are. A single point does not tell us how the surface is tilted.

Use neighbouring 3D points or fit a plane through many points.

## Mistake 3: dividing by one cosine without reconstructing the geometry

A cosine correction can be a useful approximation for a small planar object when the projected metric area and surface normal are already known accurately.

It becomes fragile when:

- the face is large in the image;
- perspective variation matters;
- the normal estimate is noisy;
- the surface is not perfectly planar.

Reconstruction handles these effects more directly.

## Mistake 4: fitting an ellipse directly in the RGB image

A real circle often appears as an ellipse only because it is viewed at an angle.

An ellipse fitted in image pixels describes the projection. It does not automatically describe the real log-face dimensions.

First reconstruct the face plane, then fit the shape in metric plane coordinates.

## Mistake 5: mixing $Z$-depth and ray range

For camera-axis depth:

$$
\mathbf P=Z\mathbf q
$$

For ray range:

$$
\mathbf P
=
r\frac{\mathbf q}{\|\mathbf q\|}
$$

Using the wrong equation creates increasing error away from the principal point.

## Mistake 6: assuming RGB and depth pixels are automatically aligned

If RGB and depth come from different sensors, the same pixel coordinate usually does not represent the same ray.

Use intrinsic calibration, extrinsic calibration, and reprojection.

## Mistake 7: trusting depth exactly at the segmentation boundary

Depth sensors often mix foreground and background near an edge.

Fit the plane from interior points and intersect the RGB contour rays with that plane.

## Mistake 8: using unordered boundary points

The shoelace formula expects points in boundary order.

Randomly shuffled points produce a self-crossing path and a meaningless area.

## Mistake 9: correcting the angle twice

If the boundary has already been placed into metric plane coordinates, the result is already angle-corrected.

Do not divide by $\cos(\alpha)$ again.

## Mistake 10: measuring from an extremely shallow angle

At a shallow angle, a tiny image or calibration error becomes a large error on the reconstructed surface.

Good mathematics cannot recover information that the image barely contains. A more frontal image is preferable whenever possible.

---

# 16. The Short Version

A segmentation pixel tells us:

> This camera ray belongs to the log face.

Camera intrinsics tell us:

> This is the 3D direction of the ray.

Depth tells us:

> This is where the ray reaches the visible surface.

Several reconstructed points tell us:

> This is how the surface is positioned and tilted in 3D.

For an uneven surface:

```text
reconstruct neighbouring points
    -> build 3D triangles
    -> sum triangle areas
```

For an approximately flat cut log face:

```text
reconstruct reliable interior points
    -> fit a plane
    -> intersect segmentation-boundary rays with the plane
    -> create local metric 2D coordinates
    -> apply the shoelace formula
```

The most important sentence is:

> Measure the reconstructed object in its own coordinate system, not the tilted projection in the camera image.

Once the boundary is expressed in the plane of the real face, the camera angle has already been handled by the geometry.
