# Ray–Plane Intersection: Where Does a Camera Ray Hit a Wall?

A pixel tells you which way to look, not how far away something is. But if
you know where a flat wall is, you can follow the pixel's viewing ray until it
hits the wall.

The trick is to measure two things in the same direction: **how far away the
wall is in that direction, and how much of that gap each step along the ray
closes.**

---

# Table of Contents

- [1. Describe the Wall](#1-describe-the-wall)
- [2. Follow the Ray](#2-follow-the-ray)
- [3. Work Out Where the Ray Hits](#3-work-out-where-the-ray-hits)
- [4. Try a Tilted Wall](#4-try-a-tilted-wall)
- [5. What If We Normalize the Ray?](#5-what-if-we-normalize-the-ray)
- [6. When the Ray Does Not Give a Usable Hit](#6-when-the-ray-does-not-give-a-usable-hit)

---

# 1. Describe the Wall

Put the camera at $(0,0,0)$ and let it look forward along the positive
$Z$ axis (the optical axis). Coordinates are in the order $(X,Y,Z)$:
sideways, vertical, forward. Now imagine a flat wall one metre straight
ahead, at $Z=1$. A **plane** is like that wall extended without edges.

Look down from above, with $Y$ left out:

```text
                  X
                  ^
                  |              * P0 = (3, 0, 1)
                  |              |
camera (0, 0, 0)  *--------------*--------------> Z
                                 |
                              wall at Z = 1
```

Both marked points are one metre forward. But only $(0,0,1)$ is one metre
from the camera. To reach the other point, you also have to go three metres
sideways. The straight-line distance to it is $\sqrt{10}$ metres.

To describe a plane, we need two things:

- **A normal $n$:** an arrow pointing at right angles to the plane. It tells
  us which way the plane faces. For this wall, take $n=(0,0,1)$. We'll use
  a **unit normal**, meaning the arrow has length 1.
- **A point $P_0$ on the plane:** a pin that fixes where the plane is. Without
  the pin, we could slide the wall forward or back without changing its
  normal. Any point on the plane will do; it doesn't have to be the closest
  point to the camera. Here we can use $P_0=(3,0,1)$.

The **dot product**, written with a dot, multiplies matching coordinates and
adds the results. With a unit normal $n$, $n\cdot P$ tells you how far the
point $P$ is along the normal direction, measured from the camera. For this
wall, $n=(0,0,1)$ picks out just the forward coordinate.

Even if the wall tilts, moving from one point on it to another still moves
*along* the wall, not across it. That move contributes nothing in the normal
direction. So all points $P$ on the plane have the same normal component
relative to the camera:

$$
n\cdot P = n\cdot P_0.
$$

With a unit normal, $n\cdot P_0$ is the **signed perpendicular offset** from the
camera to the plane. A positive value means the plane is in the direction
the normal points; a negative value means it is in the opposite direction.
Its absolute value, $|n\cdot P_0|$, is the **shortest distance to the plane**.
It's not necessarily the distance to $P_0$: for our wall those distances are
1 metre and $\sqrt{10}$ metres, respectively. If the normal isn't unit length,
divide $|n\cdot P_0|$ by the length of $n$ to get the shortest distance.

# 2. Follow the Ray

Take a pixel that looks diagonally sideways and forward. For every metre
forward, it goes one metre sideways and zero metres vertically. Write its
direction as $q=(1,0,1)$. If you go 2 metres forward along this ray, you
reach $(2,0,2)$. You have moved more than 2 metres in a straight line.

In general, let $q$ be the pixel's direction scaled so its forward
component is $1$. Its other two components tell you how much you move
sideways and vertically for each metre forward. The direction vector is
not generally unit length: for example, $q=(1,0,1)$ has length $\sqrt{2}$.
See [Perspective Projection, Intrinsics, and Depth](4_perspective_intrinsics_and_depth.md#pixel-to-ray)
for how to get $q$ from a pixel.

If $t$ is how many metres forward you go, then the point $P$ on the ray is
$P=tq$. Its $Z$ coordinate is $t$ because the last component of $q$ is $1$.
So $t$ is **Z-depth**, not necessarily the distance you travel along the ray.

# 3. Work Out Where the Ray Hits

For the wall at $Z=1$, the gap measured along the normal is 1 metre.
Every metre forward along our ray closes 1 metre of that gap. So we need
one metre of Z-depth. The ray hits at $(1,0,1)$, not at our chosen pin
$P_0=(3,0,1)$.

The same idea works when the wall tilts:

- $n\cdot P_0$ is the signed offset you need to reach.
- $n\cdot q$ is your signed progress in the normal direction for each metre
  of **Z-depth**, when $n$ is unit length. A negative value means you make
  progress against the normal arrow.

After going $t$ metres forward along the ray, your normal component is
$t(n\cdot q)$. At the wall it has to match the required offset:

$$
t(n\cdot q) = n\cdot P_0.
$$

So, when $n\cdot q$ is not zero, divide the required offset by the progress
per metre forward:

$$
t = \frac{n\cdot P_0}{n\cdot q},
\qquad P = tq.
$$

Keep the signs in both dot products. If you flip the normal arrow, both
dot products change sign, so their ratio doesn't change. Using a non-unit
normal also gives the same ratio: it scales both dot products together,
even though neither dot product on its own has the unit-normal meaning above.

# 4. Try a Tilted Wall

Keep $q=(1,0,1)$ but use a different plane. It goes through $P_0=(0,0,3.5)$
and has unit normal $n=(0.6,0,0.8)$: the squares of its components add up
to 1. For one metre of Z-depth, our diagonal move goes one metre sideways
and one metre forward. Because this normal points partly sideways and
partly forward, **both** moves contribute:

$$
n\cdot q = 0.6(1) + 0(0) + 0.8(1) = 1.4.
$$

That's 1.4 metres of normal progress for each metre *forward*. There is
nothing wrong with getting more than 1: the diagonal move itself is
$\sqrt{2}$ metres long. With a unit normal, the dot product would be the
cosine of the angle between the two directions **if the ray direction
were unit length too**. Here it isn't, so $n\cdot q$ isn't generally a
cosine or limited to the interval $[-1,1]$. See
[Angles Between Vectors](angle.md#why-the-normalized-dot-product-is-a-cosine).

The wall's offset along the normal is $n\cdot P_0 = 0.8(3.5) = 2.8$ metres.
At 1.4 metres of normal progress for each metre forward, we need 2 metres
of Z-depth:

$$
t = \frac{2.8}{1.4} = 2,
\qquad P = 2(1,0,1) = (2,0,2).
$$

Check: $n\cdot P = 0.6(2)+0.8(2) = 2.8$ metres, so the point is on the wall.

Tilting doesn't always move a hit farther away. To compare tilt alone, go
back to the wall at $Z=1$ and tilt it around the point $(0,0,1)$ so it has
the same normal $(0.6,0,0.8)$ as above. Its normal offset is now $0.8$ metres.
The ray $(1,0,1)$ hits *sooner*, at $t=0.8/1.4=4/7$ metres. The ray on the
other side, $(-1,0,1)$, hits *later*, at $t=0.8/0.2=4$ metres. Before the
tilt, both hit at a Z-depth of 1 metre.

# 5. What If We Normalize the Ray?

Go back to the original wall at $Z=1$, with $n=(0,0,1)$. The ray
$q=(1,0,1)$ finds the hit at $t=1$ metre of Z-depth:
$P=1(1,0,1)=(1,0,1)$.

Now divide $q$ by its length $\lVert q\rVert=\sqrt{2}$ to get the unit
direction $d=(1,0,1)/\sqrt{2}$. The ray still points the same way, but a
one-metre step **along the ray** now goes only $1/\sqrt{2}$ metres forward.
Let $s$ count metres along this unit direction. The normal progress per
metre along the ray is $n\cdot d=1/\sqrt{2}$, so to cross the 1-metre gap:

$$
s = \frac{1}{1/\sqrt{2}} = \sqrt{2},
\qquad P = sd = \sqrt{2}\,\frac{(1,0,1)}{\sqrt{2}} = (1,0,1).
$$

Same hit, different numbers: $t=1$ metre **forward** and $s=\sqrt{2}$
metres **along the ray**. In general $s=t\lVert q\rVert$: dividing the
direction by its length means multiplying the parameter by that length.
For a forward hit, $s$ is the straight-line distance from the camera.
See [Z-Depth vs Euclidean Depth in Perspective Projection](z_depth_vs_euclidean_depth.md)
for more examples.

# 6. When the Ray Does Not Give a Usable Hit

Imagine a side wall at $X=1$, with normal $n=(1,0,0)$. A ray looking
almost straight ahead hardly moves sideways at all. For $q=(0.01,0,1)$,
you need 100 metres of Z-depth just to move one metre sideways. Change
the sideways component to $0.02$ and you hit at 50 metres instead.
This is why a tiny change in the ray or normal can make a big difference
when the ray is nearly parallel to the plane.

- **Zero progress, nonzero offset:** $n\cdot q=0$ but $n\cdot P_0\ne 0$.
  The ray runs parallel to the wall and never reaches it. A ray looking
  straight ahead, $q=(0,0,1)$, never gets to the side wall at $X=1$.
- **Zero progress, zero offset:** both dot products are zero. The camera
  is already on the plane and the whole ray stays in it. The same
  straight-ahead ray lies in the plane $X=0$, so there's no unique hit.
- **Negative $t$:** the line through the camera hits the plane, but only
  behind the camera. For the wall at $X=1$, the ray $q=(-1,0,1)$ heads
  away from it. The formula gives $t=-1$: not a hit on the forward ray.
- **Zero $t$ with nonzero progress:** the only intersection is the camera
  center itself, not a surface out in front.

> Measure the gap perpendicular to the wall, not along the ray. Then
> divide by how much of that gap you cross for each metre forward.
