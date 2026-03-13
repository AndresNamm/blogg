# Left- vs. Right-Handed Coordinate Systems

Understanding 3D coordinate systems is essential for computer graphics, robotics, and data visualization. This guide explains the differences between left-handed and right-handed coordinate systems, clarifies common conventions, and demonstrates how these concepts apply to practical code examples. Whether you're working with LiDAR data, camera projections, or 3D modeling tools, knowing how axes are oriented helps avoid confusion and ensures consistency across your projects.


![](images/chart.png)

- [Left- vs. Right-Handed Coordinate Systems](#left--vs-right-handed-coordinate-systems)
  - [Start With Three Axes](#start-with-three-axes)
  - [Right-Handed Coordinate System](#right-handed-coordinate-system)
  - [Left-Handed Coordinate System](#left-handed-coordinate-system)
  - [Y-Up and Z-Up Are Separate Choices](#y-up-and-z-up-are-separate-choices)
  - [Example: Left-Handed System With Z-Up](#example-left-handed-system-with-z-up)
  - [Following the LiDAR Viewer Code](#following-the-lidar-viewer-code)
  - [From World Space to Camera Space](#from-world-space-to-camera-space)
  - [From Camera Space to Image Space](#from-camera-space-to-image-space)
  - [Where the Confusion Starts](#where-the-confusion-starts)
  - [Why Positive Z Does Not Settle Handedness](#why-positive-z-does-not-settle-handedness)
  - [Notes About Image-Space v](#notes-about-image-space-v)
  - [Recommended Wording For Code Comments](#recommended-wording-for-code-comments)
  - [References](#references)

## Start With Three Axes

A 3D coordinate system is defined by three perpendicular axes.

To describe it completely, you need all three directions:

- which way `+x` points
- which way `+y` points
- which way `+z` points

Handedness is about the orientation of that full basis. It is not decided by one axis in isolation.

## Right-Handed Coordinate System

The name comes from the right-hand rule.

![](images/hand2.png)
![](images/right.png)

One common right-handed camera basis is:

- `x` right
- `y` up
- `-z` forward

This is the convention many people first meet in OpenGL-style view space.

**Example With Camera Perspective**

![](images/hand1.png)

## Left-Handed Coordinate System

![](images/hand3.png)
![](images/left.png)

One common left-handed camera basis is:

- `x` right
- `y` up
- `z` forward

Compared with the previous example, the axis labels look similar, but the orientation of the Z axis is different.

## Y-Up and Z-Up Are Separate Choices

**Confusion point**

~~~text
Both left-handed and right-handed systems can be:

- `y`-up
- `z`-up
------------------------------------------------------
- `y`-up is common in some graphics pipelines and modeling tools
- `z`-up is common in CAD, GIS, Blender by default, and CloudCompare
~~~



So if someone says "CloudCompare is `z`-up", that still does not answer whether the frame is left-handed or right-handed.

## Example: Left-Handed System With Z-Up

![](images/hand4.png)

## Following the LiDAR Viewer Code

Now we can look at the practical example in this repository.

The flow starts in `timber_detective/ui/lidar/lidar_king.py`. The user adjusts a view in Open3D, and that view is saved as pinhole camera parameters:

```python
param = vis.get_view_control().convert_to_pinhole_camera_parameters()
o3d.io.write_pinhole_camera_parameters(viewpoint_filename, param)
```

Later, the same camera pose is passed into the orthographic projection helper:

```python
projection = orthographic_project_points_to_image(
    pcd,
    param.extrinsic,
    output_image_path,
    selected_point_indices,
    projection_conf,
)
```

This is the bridge between the interactive Open3D view and the math in the projection pipeline:

- the user picks a camera view in Open3D
- Open3D stores that view as pinhole camera parameters
- `param.extrinsic` transforms world points into camera space
- the projection helper decides which transformed points count as "in front"

## From World Space to Camera Space

The next step lives in `timber_detective/timber_detective/data_pipeline/lidar_utils.py`.

The helper first transforms world-space points into camera space:

```python
points_hom = np.hstack((points, np.ones((points.shape[0], 1))))
points_cam = (extrinsic @ points_hom.T).T
points_cam_3d_full = points_cam[:, :3]
```

After that, it keeps only points with positive camera-space `z`:

```python
mask = points_cam_3d_full[:, 2] > 0
```

That gives us one concrete implementation rule:

- in this pipeline, points with `camera_z > 0` are treated as being in front of the camera

## From Camera Space to Image Space

The same assumption appears again when the orthographic projection matrix is built:

```python
near = min_z
far = max_z

P_ortho = create_orthographic_projection_matrix(
    left=min_x,
    right=max_x,
    bottom=min_y,
    top=max_y,
    near=near,
    far=far,
    z_forward="+z",
)
```

Then normalized device coordinates are mapped into pixel coordinates:

```python
u = ((points_proj_hom[:, 0] + 1) * 0.5 * img_width).astype(int)
v = ((points_proj_hom[:, 1] + 1) * 0.5 * img_height).astype(int)
```

So the practical interpretation of the code path is:

- visible points have positive camera-space `z`
- the orthographic projection is configured with `z_forward="+z"`
- projected `x` and `y` are finally mapped to image coordinates `u` and `v`

That is the important implementation fact. The code is internally consistent around a `+Z forward` camera-space convention.

## Where the Confusion Starts

Only now, after looking at the whole path, does the common confusion become useful to discuss.

Once someone sees this line:

```python
mask = points_cam_3d_full[:, 2] > 0
```

it is tempting to jump straight to a handedness claim. That is where many explanations go off track.

## Why Positive Z Does Not Settle Handedness

Two different camera frames can both treat positive `z` as "in front of the camera":

- `x` right, `y` up, `z` forward
- `x` right, `y` down, `z` forward

These are not the same basis.

- the first is left-handed
- the second is right-handed

So this inference is incomplete:

`z > 0 in front` -> `left-handed`

To label a frame as left-handed or right-handed, you still need the orientation of all three axes together:

- where `x` points
- where `y` points
- how those two directions relate to `z`

That gives the narrower and more accurate conclusion for this repository:

- `lidar_king.py` and its helper assume `+Z` is forward in camera space
- that fact alone does not prove handedness

If you use the Open3D/OpenCV-style camera description often discussed in practice:

- `x` right
- `y` down
- `z` forward

then the key lesson is still the same: one axis sign is not enough. You need the full basis.

## Notes About Image-Space v

Later the same helper maps normalized device coordinates to image indices with:

```python
u = ((points_proj_hom[:, 0] + 1) * 0.5 * img_width).astype(int)
v = ((points_proj_hom[:, 1] + 1) * 0.5 * img_height).astype(int)
```

Because image row indices increase downward, positive motion in image-space `v` also goes downward. That is another reason to be careful when mixing camera-axis language with image-axis language.

## Recommended Wording For Code Comments

Instead of a stronger handedness claim, a comment like this is more precise for this repository:

```python
# Keep only points in front of the camera for the convention used here.
# This projection path treats camera-space z > 0 as forward.
```

This states the real implementation assumption without over-claiming handedness.

## References

- Repository code discussed in this post:
  - `timber_detective/ui/lidar/lidar_king.py`
  - `timber_detective/timber_detective/data_pipeline/lidar_utils.py`
- Open3D issue discussion: "camera coordinate system of visualization #1347". Open3D contributor response states the visualization/depth convention is `x` right, `y` down, `z` forward.
- Open3D issue discussion: "What coordinate system does Open3D use? #6508". Community discussion distinguishes world/view usage from camera interpretation.
- [Placing a Camera: the LookAt Function](https://www.scratchapixel.com/lessons/mathematics-physics-for-computer-graphics/lookat-function/framing-lookat-function.html)
- [Scratchapixel: Points, Vectors, and Normals](https://www.scratchapixel.com/lessons/mathematics-physics-for-computer-graphics/geometry/points-vectors-and-normals.html)
