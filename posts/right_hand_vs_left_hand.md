# Left- vs. Right-Handed Coordinate Systems

Understanding 3D coordinate systems is essential for computer graphics, robotics, and data visualization. This guide explains the differences between left-handed and right-handed coordinate systems, clarifies common conventions, and demonstrates how these concepts apply to practical code examples. Whether you're working with LiDAR data, camera projections, or 3D modeling tools, knowing how axes are oriented helps avoid confusion and ensures consistency across your projects.


![](images/chart.png)

- [Left- vs. Right-Handed Coordinate Systems](#left--vs-right-handed-coordinate-systems)
  - [Start With Three Axes](#start-with-three-axes)
  - [Right-Handed Coordinate System](#right-handed-coordinate-system)
  - [Left-Handed Coordinate System](#left-handed-coordinate-system)
  - [Y-Up and Z-Up Are Separate Choices](#y-up-and-z-up-are-separate-choices)
  - [Why One Axis Cannot Determine Handedness](#why-one-axis-cannot-determine-handedness)
    - [Practical Implications in Code](#practical-implications-in-code)
  - [Notes About Image Space](#notes-about-image-space)
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
- `-z` in front of camera

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


Above example shows y up but both left-handed and right-handed systems can be:

- `y`-up
- `z`-up

For example CloudCompare could have z up 

![](images/hand4.png)



 `z`-up is common in CAD, GIS, Blender by default, and CloudCompare, - `y`-up is common in some graphics pipelines and modeling tools

**But if someone says "CloudCompare is `z`-up", that still does not answer whether the frame is left-handed or right-handed.**

## Why One Axis Cannot Determine Handedness

A common point of confusion when working with 3D data and camera projections is assuming that a single axis direction determines the handedness of the coordinate system.

For example, when looking at a code snippet that filters points in front of a camera with positive Z axis:

```python
# Assuming points_cam contains 3D points in camera space (x, y, z)
# Keep only points with positive camera-space z
mask = points_cam[:, 2] > 0
visible_points = points_cam[mask]
```

Once someone sees `z > 0` being treated as "forward", it is tempting to jump straight to a handedness claim. That is where many explanations go off track.

Two entirely different camera frames can both treat positive `z` as "in front of the camera":

| `x` Axis | `y` Axis | `z` (Forward) Axis | Handedness |
| :--- | :--- | :--- | :--- |
| Right | _Up_ | Forward (+z) | **Left-handed** |
| Right | _Down_ | Forward (+z) | **Right-handed** |


Therefore, this inference is incomplete:

`z > 0 in front` -> `left-handed`

To definitively label a frame as left-handed or right-handed, you need the orientation of all three axes together:

- where `x` points
- where `y` points
- how those two directions relate to `z`

If you use an OpenCV-style camera description often discussed in computer vision:

- `x` right
- `y` down
- `z` forward

The key lesson is still the same: one axis sign is not enough. You need the full basis.

### Practical Implications in Code

When writing code that transforms and projects points, it is better to state the specific axis convention rather than making a broad handedness claim. This states the real implementation assumption without over-claiming handedness.

## Notes About Image Space

When projecting 3D points to a 2D image, further confusion can arise. For instance, mapping normalized device coordinates to image pixels:

```python
u = int((x_ndc + 1) * 0.5 * img_width)
v = int((y_ndc + 1) * 0.5 * img_height)
```

Because image row indices traditionally increase downward, positive motion in image-space `v` also goes downward. This is another reason to be careful when mixing discussions of camera-axis conventions with image-axis conventions.

## References

- [Placing a Camera: the LookAt Function](https://www.scratchapixel.com/lessons/mathematics-physics-for-computer-graphics/lookat-function/framing-lookat-function.html)
- [Scratchapixel: Points, Vectors, and Normals](https://www.scratchapixel.com/lessons/mathematics-physics-for-computer-graphics/geometry/points-vectors-and-normals.html)
