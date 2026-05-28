# Perspective Projection, Intrinsics, and Depth

In the orthographic projection posts, the useful simplification was this:

> A pixel can be treated as a constant-sized square in the real world.

That is why orthographic projection is easier for measurement. Once we know the scale, pixel distance can be converted back into real distance with simple multiplication.

Perspective projection breaks this assumption.

In perspective projection, a pixel is not a fixed-size square in the world. A pixel is more like a small direction coming out of the camera. Close to the camera, that direction covers a small physical area. Far away, the same direction covers a larger physical area. This is exactly how regular photography works. 

Parallel train tracks    

![alt text](/images/train.png)

This is also how our eyesight works. In real world its not possible to directly obtain ortographic projection.

This is why an RGB-D measurement pipeline becomes important in real world. It combines 

1. image taken with perspective projection using camera intrinsics
2. depth data (this can be from lidar, photogrammetry ...)


In essence
- The intrinsics tell us where a pixel is looking.
- The depth tells us how far away the object is at that pixel.

Together they let us estimate how large that pixel is in meters.

---

# 1. The Intrinsic Matrix

The camera intrinsic matrix usually looks like this:

$$
K =
\begin{pmatrix}
f_x & 0 & c_x \\
0 & f_y & c_y \\
0 & 0 & 1
\end{pmatrix}
$$

For example, a calibrated camera might have this intrinsic matrix:

```python
m = np.array([
    [3003.1174, 0, 2011.17],
    [0, 3003.1174, 1514.9209],
    [0, 0, 1]
])
```

So:

```text
fx = 3003.1174
fy = 3003.1174
cx = 2011.17
cy = 1514.9209
```

Definitions:

- `fx`: focal length **in pixels** in the horizontal direction.
- `fy`: focal length **in pixels** in the vertical direction.
- `cx`: x-coordinate of the principal point, in pixels.
- `cy`: y-coordinate of the principal point, in pixels.

These four values define how image pixels relate to camera rays.

---

# 2. Principal Point: `cx`, `cy`

The principal point is:

> The pixel where the camera is looking straight ahead.

It is located on the sensor.
It is not exactly the same thing as the image center, although it is usually close.

The image center is just the geometric middle of the rectangular image:

```text
image center = (image_width / 2, image_height / 2)
```

The principal point is physical:

```text
principal point = where the lens optical axis hits the sensor
```

In a perfect camera, those would be exactly the same. In a real camera, the lens and sensor are not mounted with mathematical perfection, so calibration gives us the actual principal point.

For example, if an image is roughly `4032 x 3024`, then the image center is:

```text
(2016, 1512)
```

This example principal point is:

```text
(2011.17, 1514.9209)
```

That is very close to the center, but not exactly. It is about 4.8 pixels left and 2.9 pixels down from the image center.

The useful mental model is:

```text
(cx, cy) = the zero point for camera direction
```

If a pixel is exactly at `(cx, cy)`, then it looks straight forward from the camera.

If a pixel is to the right of `cx`, then it looks a bit to the right.

If a pixel is to the left of `cx`, then it looks a bit to the left.

Same for `cy` vertically.

This is why the code uses:

```python
x - cx
y - cy
```

It is asking:

```text
How far is this pixel from the straight-ahead pixel?
```

---

# 3. Focal Length in Pixels: `fx`, `fy`

The values `fx` and `fy` are focal lengths, but measured in pixels.

That sounds strange at first because focal length is often described in millimeters. But for image geometry, pixel units are more practical.

In the ideal pinhole camera model, focal length means the forward distance from the pinhole to the image plane.

![alt text](images/pinhole.png)



## What focal length really does

- `fx` is the horizontal version. It tells us how much moving left or right in the image changes the left-right viewing angle.
- `fy` is the vertical version. It tells us how much moving up or down in the image changes the up-down viewing angle.

Large `fx` means:

```text
same pixel offset = smaller angle
```

That is like a zoomed-in / narrow field-of-view camera.

Small `fx` means:

```text
same pixel offset = larger angle
```

That is like a wide-angle camera.

The same applies to `fy`, but vertically.

In this example, `fx` and `fy` are equal:

```text
fx = fy = 3003.1174
```

That means this example assumes the camera has the same scaling horizontally and vertically. In practical terms, square pixels and symmetric focal scaling. This is commonly assumed.

---

# 4. Pixel to Ray

## First let's talk about the virtual image plane

In the pinhole camera model, the real image sensor sits behind the small camera hole / camera center.

That real image plane receives an upside-down version of the world, because light rays cross at the pinhole before they hit the sensor.

For geometry, that flipped picture is annoying. So instead of drawing the image plane behind the pinhole, we usually draw a **virtual image plane** in front of the pinhole, between the camera and the scene.

It represents almost the same thing as the actual image plane, but inverted to the front side:

```text
scene
    |
    |
virtual image plane
    |
camera center / pinhole
    |
real image plane / sensor
```

The virtual image plane is not a physical surface inside the camera. It is a mathematical helper. It lets us say that a pixel is in front of the camera and that the ray goes from the camera center through that pixel into the world.

So the virtual image plane is basically the real image plane mirrored through the pinhole. Same projection idea, but with the inconvenient upside-down sensor image turned into a forward-facing construction.

## Pixel to Ray

In practical terms, a ray is built like this

```python
ray_center = np.array([x - cx, y - cy, fx])
```


The components mean:

```text
x - cx = horizontal offset from straight ahead
y - cy = vertical offset from straight ahead
fx     = forward direction / focal length in pixel units
```

If the pixel is at the principal point:

```text
x = cx
y = cy
```

then:

```python
ray_center = [0, 0, fx]
```

That ray points straight forward.

If the pixel is 100 pixels to the right:

```text
x = cx + 100
y = cy
```

then:

```python
ray_center = [100, 0, fx]
```

That ray points forward and slightly right.

So the intrinsic matrix lets us turn a pixel coordinate into a camera ray.

This is the first half of the perspective-measurement trick.

The important mental picture is the pinhole camera model:

```text
scene
    ^
    |
ray direction
    ^
    |
virtual image plane
    ^
    |
camera center / pinhole
```

The real camera sensor is physically behind the pinhole, but the virtual image plane is usually drawn in front of the camera center, between the pinhole and the scene. This avoids flipping the image and makes the geometry easier to reason about.

On that virtual image plane, a pixel is described by something like:

```text
[x - cx, y - cy, f]
```

or, in the simplified form:

```text
[x, y, f]
```

Those coordinates do not say where the object is in 3D. They say which direction the camera is looking for that pixel.

After normalization:

```text
d = normalize([x - cx, y - cy, f])
```

we get a unit ray direction `d` from the camera center.

So one RGB pixel really means:

```text
the object is somewhere along this ray
```

not:

```text
the object is exactly here
```

A normal RGB image gives color at each pixel, but it does not give the depth of the visible surface. One pixel therefore corresponds to infinitely many possible 3D points along the same ray:

```text
camera center ---------------------------->
                                 many possible depths
```

---

# 5. Where Depth Enters

The depth data answers a different question:

```text
How far away is the visible surface at this pixel?
```

So for a pixel `(x, y)`, the depth map might say:

```text
depth = 2.0 meters
```

The intrinsic matrix gives the direction.

The depth map gives the distance.

Together:

```text
pixel + intrinsics -> ray direction
ray direction + depth -> real metric point / size
```

This is why LiDAR matters. In a normal RGB image, we see the pixel, but we do not directly know how far away the object is. With LiDAR/depth, we get that missing scalar.

If:

```text
C = camera center
d = ray direction
z = depth
p = actual 3D point
```

then the reconstruction idea is:

```text
p = C + z d
```

This equation is the heart of RGB-D reconstruction, point clouds, SLAM, NeRF ray sampling, photogrammetry, and the LiDAR-to-RGB-to-segmentation-to-backprojection workflow.

The workflow is elegant because each space does what it is good at:

```text
2D RGB image space -> segmentation works well
3D LiDAR space     -> geometry and measurement work well
rays + depth       -> bridge between them
```

So the pipeline can project LiDAR into the RGB image, segment the object in 2D, and then backproject the selected pixels into 3D using the depth values.

---

# 6. Why One Pixel Has a Physical Size

For area measurement, we do not only need the 3D position of one pixel. We need area.

So the question becomes:

> At this depth, how much real-world width and height does one image pixel cover?

The code compares the ray through one pixel with the ray through the neighboring pixel:

```python
ray_center = np.array([x - cx, y - cy, fx])
ray_right = np.array([x + 1 - cx, y - cy, fx])
ray_down = np.array([x - cx, y + 1 - cy, fy])
```

Then it computes the angle between:

```text
ray_center and ray_right
ray_center and ray_down
```

Those are the angular width and angular height of one pixel.

The geometry is:

```text
camera
   \  \
    \  \       same angular gap
     \  \
      \  \
       ----    physical pixel width at this depth
```

Close to the camera, the gap is small.

Far from the camera, the gap is larger.

That is perspective.

---

# 7. Angular Size Plus Depth Becomes Meters

After the code has:

```text
angular_width
angular_height
depth
```

it computes:

```python
width_m = 2 * distance_m * np.tan(angular_width_rad / 2)
height_m = 2 * distance_m * np.tan(angular_height_rad / 2)
```

This converts angular pixel size into physical pixel size.

The intuition is:

```text
physical size grows with distance
```

So if a pixel has the same angular width, then:

```text
at 1 meter  -> small real-world width
at 5 meters -> larger real-world width
```

This is the exact point where intrinsics and depth are combined.

The intrinsics produce the angular size.

The depth scales that angular size into meters.

---

# 8. How Depth-Corrected Area Is Computed

The segmentation image tells the code which pixels belong to the object:

```python
if pix_segment[y][x] == (0, 0, 0):
```

For every black pixel, the code does:

1. read depth at that pixel,
2. use intrinsics to compute pixel angular width and height,
3. convert angular width and height into meters using depth,
4. add the small physical pixel area.

In simplified form:

```python
for each segmented pixel:
    d = depth_at(x, y)
    angular_width, angular_height = pixel_angular_size(x, y, K)
    width_m, height_m = pixel_physical_size(d, angular_width, angular_height)
    area += width_m * height_m
```

So the final area is not:

```text
number of pixels * one fixed area
```

It is:

```text
sum of many depth-corrected pixel areas
```

That is the practical difference between orthographic measurement and perspective measurement.

---

# 9. The Short Version

The intrinsic matrix tells us:

```text
where is straight ahead?
how much does a pixel offset change the viewing angle?
```

Depth tells us:

```text
how far away is the object at this pixel?
```

Together:

```text
intrinsics + depth = metric interpretation of an image pixel
```

In one sentence:

> The intrinsic matrix turns pixels into rays, and the depth map tells where those rays hit the object.

That is the core idea behind perspective area calculation with depth.

# References

- [Dissecting the Camera Matrix, Part 3: The Intrinsic Matrix](https://ksimek.github.io/2013/08/13/intrinsic/)
- [Focal Length and Intrinsic Camera Parameters](https://www.baeldung.com/cs/focal-length-intrinsic-camera-parameters)
- [Intrinsic and Extrinsic Parameters of Pinhole Camera](https://robotlabx.com/blog/2024-01-10-Intrinsic-and-extrinsic-parameters-of-pinhole-camera/)
