# Delauney
## TLDR

 In the one-point-at-a-time method:

 1. Add the new point and find the triangles whose circles contain it.
 2. Remove those triangles and the edges shared between them.
 3. Keep the edges around the outside of the removed area—the gap boundary.
 4. Connect the new point to each point on that boundary, making new triangles

## Steps 

From dots to log-end area

1. Why connect the dots?

Imagine measured points on a log end. Each point tells us a position, but a dot has no area. To estimate an area, we fill some of the space between dots with triangles.

 •────────•
 │      / │
 │    /   │    Two triangles fill this square.
 │  /     │
 •────────•

We can calculate each triangle’s area and add the areas together. But first we need a rule for choosing the connections.

2. How can we start?

There are different ways to construct a Delaunay triangulation. Here is one way to picture the process:

 1. Draw a large imaginary triangle around all the real dots. This is a temporary scaffold; its corners are not measured points.
 2. Add one real dot at a time.
 3. Each new dot can cause some existing triangles to be replaced. The connections change to satisfy the circle rule below.
 4. After adding all the real dots, remove the scaffold and the triangles connected to its corners.

The first triangle is therefore not necessarily made from the three furthest real dots. The full post explains the extra care needed when choosing the imaginary scaffold.

3. What is the Delaunay circle rule?

Every triangle has a circle that passes through its three corners. For a Delaunay triangle:

 No other dot is strictly inside that circle.

A dot on the circle is allowed. If a new dot falls inside a triangle’s circle, that triangle cannot stay as it is: the connections must change.

This rule chooses how to connect the dots. At this stage, the triangles cover the area inside the outermost dots, including spaces where the real log end may not be present.

4. What is the 25 cm rule?

After making the Delaunay triangles, we apply a second rule:

 Keep a triangle if the radius of its circle is 25 cm or less.

A triangle with a circle radius of exactly 25 cm is kept. A triangle with a radius greater than 25 cm is removed.

The two rules do different jobs:

 - Delaunay rule: Is another dot inside the circle? This decides the connections.
 - 25 cm rule: How large is the circle? This decides which triangles count towards the area.

5. A small example

Suppose we have a square, 30 cm wide and 30 cm high, with another dot near its top edge. The Delaunay rule produces four triangles:

┌──────────┬───────────────┬─────────┬────────────────┐
│ Triangle │ Circle radius │ Area    │ Keep at 25 cm? │
├──────────┼───────────────┼─────────┼────────────────┤
│ Bottom   │ 17.33 cm      │ 390 cm² │ Yes            │
├──────────┼───────────────┼─────────┼────────────────┤
│ Right    │ 15.53 cm      │ 225 cm² │ Yes            │
├──────────┼───────────────┼─────────┼────────────────┤
│ Top      │ 30.13 cm      │ 60 cm²  │ No             │
├──────────┼───────────────┼─────────┼────────────────┤
│ Left     │ 15.53 cm      │ 225 cm² │ Yes            │
└──────────┴───────────────┴─────────┴────────────────┘

We add the kept areas: 390 + 225 + 225 = 840 cm², or 0.084 m². The removed top triangle leaves a small indentation.

6. What does the result mean?

The kept triangles form the alpha shape. It can have indentations, holes or separate pieces. It describes the area supported by the dots; it does not know the true edge of the log.

All four measurement methods use the same 25 cm rule, but they supply different dots, so they can produce different areas. A smaller cutoff generally keeps fewer triangles; a larger cutoff keeps more

## FAQ

### Why do we make triangles?

Dots have positions, but no area. Triangles give us pieces of area that we can measure and add together. They are a practical way to fill the space between dots, but they are not the only possible way to estimate an area.

### How is the first triangle chosen?

The first triangle does not have to use the three furthest real dots. One way to build a triangulation is to start with an imaginary triangle that surrounds all the dots. This triangle is a temporary scaffold, not measured data.

The scaffold must be chosen carefully: simply surrounding the dots is not enough for every possible set of points. Other construction methods use different starting steps.

### Are points added one at a time?

In one conceptual method, yes. We choose a real dot, add it, and update the triangles. Then we do the same for the next dot. This is one way to understand the process, not the only way to build a Delaunay triangulation.

### Why can we add a point inside a triangle's circle?

The circle rule does not forbid us from adding the point. It says that, **after** the point is added, the old triangle cannot stay if its circle contains that point.

We find every existing triangle whose circle contains the new point and replace those triangles. A point exactly on a circle is allowed.

### What is the gap?

The gap is the area covered by the triangles we remove. It is also called the *cavity*. It is a temporary empty area in the triangle drawing, not necessarily a hole in the log.

For example, suppose we remove triangles **ABC** and **ACD**:

```text
Before removal             After removal

D───────C                  D───────C
│     / │                  │       │
│   /   │       →          │   E   │  <- gap
│ /     │                  │       │
A───────B                  A───────B
```

Together, the removed triangles covered the square ABCD, so the square is the gap.

### Do we remove the edges around the gap?

We keep the edges **AB, BC, CD and DA** as the boundary of the gap. We remove the diagonal **AC** because it was shared by both removed triangles and is inside the gap.

More generally, an edge belonging to only one removed triangle is on the gap boundary. An edge shared by two removed triangles is inside the gap.

### Do we delete triangles or edges?

Both descriptions help. In the list of triangles, the old triangles **ABC** and **ACD** are removed and replaced. In the drawing, we can think of erasing their shared diagonal **AC**, keeping the outside edges, and drawing new edges.

### Which points do we connect to the new point?

Connect the new point to the points **on the gap boundary**, not to every point in the drawing. In this example, the boundary points are A, B, C and D, so we add edges EA, EB, EC and ED.

```text
D───────C
│ \   / │
│   E   │
│ /   \ │
A───────B
```

The new triangles are **ABE, BCE, CDE and ADE**. In a larger example, a point belonging to a removed triangle need not be on the gap boundary.

### Is this the same as the 25 cm rule?

No. The empty-circle rule decides how to connect the points. The 25 cm rule comes **after** the Delaunay triangles are complete: it keeps triangles whose circle radius is at most 25 cm and removes the others from the area calculation.


# Reference9

https://www.youtube.com/watch?v=GKVBOxzQ69E