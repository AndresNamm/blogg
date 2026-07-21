# Angles Between Vectors

The central idea of this post is:

> An inner product turns algebraic vectors into geometric objects. Once an
> inner product gives us lengths and alignment, we can define the angle between
> two nonzero vectors by
>
> $$
> \theta
> =
> \arccos\left(
> \frac{\mathbf a\cdot\mathbf b}
> {\|\mathbf a\|\|\mathbf b\|}
> \right).
> $$

This formula is not an arbitrary rule. It follows from the ordinary law of
cosines, and every part of it has a specific purpose:

- $\mathbf a\cdot\mathbf b$ measures directional alignment and also depends on
  the vectors' lengths.
- Dividing by $\|\mathbf a\|\|\mathbf b\|$ removes the lengths.
- The resulting number is $\cos\theta$.
- $\arccos$ recovers the unique angle $\theta\in[0,\pi]$.

This post develops that argument carefully and then connects it to projection
and change of basis.

## Contents

1. [From vector spaces to geometry](#from-vector-spaces-to-geometry)
2. [The dot product and norm](#the-dot-product-and-norm)
3. [Why the normalized dot product is a cosine](#why-the-normalized-dot-product-is-a-cosine)
4. [Defining the angle](#defining-the-angle)
5. [Derivation from the law of cosines](#derivation-from-the-law-of-cosines)
6. [What the sign of the dot product means](#what-the-sign-of-the-dot-product-means)
7. [Worked angle examples](#worked-angle-examples)
8. [Projection](#projection)
9. [Projection is not change of basis](#projection-is-not-change-of-basis)
10. [The inequalities behind the construction](#the-inequalities-behind-the-construction)
11. [A closer look at arccos](#a-closer-look-at-arccos)
12. [Summary](#summary)

## From vector spaces to geometry

A vector space by itself only provides algebraic operations:

- vectors can be added;
- vectors can be multiplied by scalars.

Those operations alone do **not** define length, perpendicularity, distance, or
angle. To obtain Euclidean geometry, we equip the vector space with an **inner
product**.

For real coordinate vectors in $\mathbb R^n$, the standard inner product is the
dot product:

$$
\mathbf a\cdot\mathbf b
=
\sum_{i=1}^n a_i b_i.
$$

From the inner product we define:

$$
\|\mathbf a\|
=
\sqrt{\mathbf a\cdot\mathbf a}
$$

and

$$
d(\mathbf a,\mathbf b)
=
\|\mathbf a-\mathbf b\|.
$$

So the logical order is

$$
\text{inner product}
\Longrightarrow
\text{norm}
\Longrightarrow
\text{distance and angle}.
$$

This distinction matters. An arbitrary vector-space isomorphism preserves
addition and scalar multiplication, but it need not preserve angles or
lengths. A map that also preserves the inner product is an **isometry**. It is
the inner-product-preserving structure, rather than coordinates alone, that
transports Euclidean geometry into an algebraic model.

## The dot product and norm

Consider

$$
\mathbf v=(v_1,\ldots,v_n).
$$

Its squared length is

$$
\|\mathbf v\|^2
=
\mathbf v\cdot\mathbf v
=
v_1^2+\cdots+v_n^2.
$$

Therefore

$$
\|\mathbf v\|
=
\sqrt{v_1^2+\cdots+v_n^2}.
$$

In $\mathbb R^2$, this is exactly the Pythagorean theorem:

$$
\|\mathbf v\|
=
\sqrt{v_1^2+v_2^2}.
$$

The familiar coordinate formula assumes that the coordinate axes form an
**orthonormal basis**:

- the basis vectors are perpendicular;
- every basis vector has length $1$.

If the basis is not orthonormal, the geometry is still valid, but the simple
sum-of-squares coordinate formula must be replaced by a formula involving the
basis's Gram matrix. We return to this in
[Projection is not change of basis](#projection-is-not-change-of-basis).

## Why the normalized dot product is a cosine

For nonzero vectors $\mathbf a$ and $\mathbf b$, define their normalized
versions:

$$
\widehat{\mathbf a}
=
\frac{\mathbf a}{\|\mathbf a\|},
\qquad
\widehat{\mathbf b}
=
\frac{\mathbf b}{\|\mathbf b\|}.
$$

Both have length $1$. Their dot product is

$$
\widehat{\mathbf a}\cdot\widehat{\mathbf b}
=
\frac{\mathbf a\cdot\mathbf b}
{\|\mathbf a\|\|\mathbf b\|}.
$$

The Cauchy-Schwarz inequality says

$$
|\mathbf a\cdot\mathbf b|
\leq
\|\mathbf a\|\|\mathbf b\|.
$$

Dividing by the positive number $\|\mathbf a\|\|\mathbf b\|$ gives

$$
-1
\leq
\frac{\mathbf a\cdot\mathbf b}
{\|\mathbf a\|\|\mathbf b\|}
\leq
1.
$$

This is important because $[-1,1]$ is exactly the range of cosine on the angle
interval $[0,\pi]$.

The normalized dot product is therefore a pure, dimensionless measure of
directional alignment:

$$
\frac{\mathbf a\cdot\mathbf b}
{\|\mathbf a\|\|\mathbf b\|}
=
\cos\theta.
$$

Scaling either vector by a positive number does not change this ratio, because
the scale factor appears in both the numerator and denominator. That is what
we want: changing a vector's length should not change its direction.

Normalization also gives a useful picture. Every nonzero vector is moved onto
the unit sphere while keeping its direction. If

$$
\mathbf u=\frac{\mathbf a}{\|\mathbf a\|},
\qquad
\mathbf v=\frac{\mathbf b}{\|\mathbf b\|},
$$

then the distance between the resulting points is

$$
\begin{aligned}
\|\mathbf u-\mathbf v\|^2
&=
\|\mathbf u\|^2+\|\mathbf v\|^2-2\mathbf u\cdot\mathbf v\\
&=
2-2\cos\theta\\
&=
4\sin^2\left(\frac{\theta}{2}\right).
\end{aligned}
$$

Hence

$$
\|\mathbf u-\mathbf v\|
=
2\sin\left(\frac{\theta}{2}\right).
$$

So the angular separation and the straight-line distance between normalized
vectors determine one another. Normalizing does not merely simplify the
formula; it isolates the geometry of direction on the unit sphere.

## Defining the angle

For nonzero vectors $\mathbf a,\mathbf b$ in a real inner-product space, their
angle is defined as

$$
\boxed{
\theta
=
\arccos\left(
\frac{\mathbf a\cdot\mathbf b}
{\|\mathbf a\|\|\mathbf b\|}
\right)
}
$$

with

$$
0\leq\theta\leq\pi.
$$

Equivalently,

$$
0^\circ\leq\theta\leq180^\circ.
$$

The angle is not defined if either vector is the zero vector. The zero vector
has no direction, and the formula would require division by zero.

### Why cosine appears

In a right triangle,

$$
\cos\theta
=
\frac{\text{adjacent side}}{\text{hypotenuse}},
\qquad
\sin\theta
=
\frac{\text{opposite side}}{\text{hypotenuse}}.
$$

These ratios depend only on the angle, not on the size of the triangle. Any two
right triangles with the same acute angle are similar, so all corresponding
side lengths differ by one common scale factor. That factor cancels in the
ratio.

The right-triangle definition directly covers acute angles. The unit-circle
definition extends cosine to all angles: the point reached after rotating by
$\theta$ on the unit circle has coordinates

$$
(\cos\theta,\sin\theta).
$$

For an obtuse angle, the horizontal coordinate is negative, which is why its
cosine and the corresponding dot product are negative.

Cosine therefore creates a size-independent mapping

$$
\theta\in[0,\pi]
\longmapsto
\cos\theta\in[-1,1].
$$

On this interval cosine is one-to-one, so the mapping can be reversed:

$$
\cos\theta=x
\quad\Longleftrightarrow\quad
\theta=\arccos x.
$$

## Derivation from the law of cosines

Place $\mathbf a$ and $\mathbf b$ so that both start at the origin. Their tips
and the origin form a triangle whose side lengths are

$$
\|\mathbf a\|,
\qquad
\|\mathbf b\|,
\qquad
\|\mathbf a-\mathbf b\|.
$$

The side connecting the two tips is represented by either
$\mathbf a-\mathbf b$ or $\mathbf b-\mathbf a$; both have the same length.

If $\theta$ is the angle between $\mathbf a$ and $\mathbf b$, the law of
cosines gives

$$
\|\mathbf a-\mathbf b\|^2
=
\|\mathbf a\|^2+\|\mathbf b\|^2
-2\|\mathbf a\|\|\mathbf b\|\cos\theta.
\tag{1}
$$

Now calculate the same left-hand side using the inner product:

$$
\begin{aligned}
\|\mathbf a-\mathbf b\|^2
&=(\mathbf a-\mathbf b)\cdot(\mathbf a-\mathbf b)\\
&=\mathbf a\cdot\mathbf a
-2\mathbf a\cdot\mathbf b
+\mathbf b\cdot\mathbf b\\
&=\|\mathbf a\|^2
-2\mathbf a\cdot\mathbf b
+\|\mathbf b\|^2.
\end{aligned}
\tag{2}
$$

Equating (1) and (2), then cancelling the common squared-length terms, gives

$$
-2\mathbf a\cdot\mathbf b
=
-2\|\mathbf a\|\|\mathbf b\|\cos\theta.
$$

Therefore

$$
\boxed{
\mathbf a\cdot\mathbf b
=
\|\mathbf a\|\|\mathbf b\|\cos\theta
}.
$$

For nonzero vectors, division by the two lengths gives

$$
\boxed{
\cos\theta
=
\frac{\mathbf a\cdot\mathbf b}
{\|\mathbf a\|\|\mathbf b\|}
}.
$$

This derivation explains why the algebraic definition reproduces the geometric
angle from Euclidean triangles.

## What the sign of the dot product means

Because both vector lengths are nonnegative,

$$
\operatorname{sign}(\mathbf a\cdot\mathbf b)
=
\operatorname{sign}(\cos\theta).
$$

Consequently:

| Angle | Cosine | Dot product | Interpretation |
|---|---:|---:|---|
| $0\leq\theta<\frac{\pi}{2}$ | positive | positive | Similar general direction |
| $\theta=\frac{\pi}{2}$ | $0$ | $0$ | Perpendicular |
| $\frac{\pi}{2}<\theta\leq\pi$ | negative | negative | Opposing general directions |

Important special cases are:

$$
\theta=0
\Longrightarrow
\mathbf a\cdot\mathbf b
=
\|\mathbf a\|\|\mathbf b\|,
$$

$$
\theta=\frac{\pi}{2}
\Longrightarrow
\mathbf a\cdot\mathbf b=0,
$$

and

$$
\theta=\pi
\Longrightarrow
\mathbf a\cdot\mathbf b
=
-\|\mathbf a\|\|\mathbf b\|.
$$

Equality in Cauchy-Schwarz occurs exactly when the vectors are linearly
dependent:

$$
\mathbf a=c\mathbf b.
$$

If $c>0$, they point in the same direction and $\theta=0$. If $c<0$, they
point in opposite directions and $\theta=\pi$.

## Worked angle examples

### Example 1: a $45^\circ$ angle

Let

$$
\mathbf a=(1,2),
\qquad
\mathbf b=(3,1).
$$

First calculate the dot product:

$$
\mathbf a\cdot\mathbf b
=
1\cdot3+2\cdot1
=
5.
$$

The lengths are

$$
\|\mathbf a\|
=
\sqrt{1^2+2^2}
=
\sqrt5
$$

and

$$
\|\mathbf b\|
=
\sqrt{3^2+1^2}
=
\sqrt{10}.
$$

Therefore

$$
\cos\theta
=
\frac{5}{\sqrt5\sqrt{10}}
=
\frac{5}{\sqrt{50}}
=
\frac{1}{\sqrt2}.
$$

Hence

$$
\theta
=
\arccos\left(\frac1{\sqrt2}\right)
=
\frac{\pi}{4}
=
45^\circ.
$$

### Example 2: an obtuse angle

Let

$$
\mathbf a=(1,0),
\qquad
\mathbf b=(-1,\sqrt3).
$$

Then

$$
\mathbf a\cdot\mathbf b=-1,
\qquad
\|\mathbf a\|=1,
\qquad
\|\mathbf b\|=2.
$$

Thus

$$
\cos\theta=-\frac12
$$

and

$$
\theta
=
\arccos\left(-\frac12\right)
=
\frac{2\pi}{3}
=
120^\circ.
$$

The negative dot product immediately told us that the angle had to be obtuse.

## Projection

Angles and projections are closely connected, but scalar projection and vector
projection must be distinguished carefully.

Suppose we want to project a vector $\mathbf s$ onto a nonzero vector
$\mathbf r$.

### Step 1: normalize the target direction

The unit vector pointing in the direction of $\mathbf r$ is

$$
\widehat{\mathbf r}
=
\frac{\mathbf r}{\|\mathbf r\|}.
$$

It has length $1$ because

$$
\left\|
\frac{\mathbf r}{\|\mathbf r\|}
\right\|
=
\frac{\|\mathbf r\|}{\|\mathbf r\|}
=
1.
$$

### Step 2: calculate the signed scalar projection

The scalar component of $\mathbf s$ in the direction of $\mathbf r$ is

$$
\operatorname{comp}_{\mathbf r}(\mathbf s)
=
\mathbf s\cdot\widehat{\mathbf r}.
$$

Substituting the unit-vector formula gives

$$
\boxed{
\operatorname{comp}_{\mathbf r}(\mathbf s)
=
\frac{\mathbf s\cdot\mathbf r}{\|\mathbf r\|}
}.
$$

Using the angle identity,

$$
\frac{\mathbf s\cdot\mathbf r}{\|\mathbf r\|}
=
\|\mathbf s\|\cos\theta.
$$

This number is **signed**:

- positive means the component points along $\mathbf r$;
- zero means $\mathbf s$ is perpendicular to $\mathbf r$;
- negative means the component points opposite to $\mathbf r$.

The geometric length of the projected vector is the absolute value

$$
\left|
\operatorname{comp}_{\mathbf r}(\mathbf s)
\right|.
$$

### Step 3: calculate the vector projection

Multiply the scalar component by the unit direction:

$$
\operatorname{proj}_{\mathbf r}(\mathbf s)
=
\operatorname{comp}_{\mathbf r}(\mathbf s)
\widehat{\mathbf r}.
$$

Therefore

$$
\begin{aligned}
\operatorname{proj}_{\mathbf r}(\mathbf s)
&=
\frac{\mathbf s\cdot\mathbf r}{\|\mathbf r\|}
\frac{\mathbf r}{\|\mathbf r\|}\\
&=
\boxed{
\frac{\mathbf s\cdot\mathbf r}{\|\mathbf r\|^2}\mathbf r
}.
\end{aligned}
$$

Since $\|\mathbf r\|^2=\mathbf r\cdot\mathbf r$, the same formula is often
written as

$$
\boxed{
\operatorname{proj}_{\mathbf r}(\mathbf s)
=
\frac{\mathbf s\cdot\mathbf r}
{\mathbf r\cdot\mathbf r}\mathbf r
}.
$$

### Orthogonal decomposition

Define the remaining perpendicular component by

$$
\mathbf s_\perp
=
\mathbf s-\operatorname{proj}_{\mathbf r}(\mathbf s).
$$

It is perpendicular to $\mathbf r$:

$$
\begin{aligned}
\mathbf s_\perp\cdot\mathbf r
&=
\left(
\mathbf s
-
\frac{\mathbf s\cdot\mathbf r}
{\mathbf r\cdot\mathbf r}\mathbf r
\right)\cdot\mathbf r\\
&=
\mathbf s\cdot\mathbf r
-
\frac{\mathbf s\cdot\mathbf r}
{\mathbf r\cdot\mathbf r}
(\mathbf r\cdot\mathbf r)\\
&=0.
\end{aligned}
$$

Thus every vector can be split into a parallel part and a perpendicular part:

$$
\boxed{
\mathbf s
=
\operatorname{proj}_{\mathbf r}(\mathbf s)
+\mathbf s_\perp
}.
$$

Because these two parts are perpendicular, Pythagoras gives

$$
\|\mathbf s\|^2
=
\left\|
\operatorname{proj}_{\mathbf r}(\mathbf s)
\right\|^2
+\|\mathbf s_\perp\|^2.
$$

### Projection example

Let

$$
\mathbf s=(3,4),
\qquad
\mathbf r=(2,0).
$$

The scalar projection is

$$
\operatorname{comp}_{\mathbf r}(\mathbf s)
=
\frac{(3,4)\cdot(2,0)}{\sqrt{2^2}}
=
\frac6{2}
=
3.
$$

The vector projection is

$$
\operatorname{proj}_{\mathbf r}(\mathbf s)
=
\frac6{4}(2,0)
=
(3,0).
$$

The perpendicular component is

$$
\mathbf s_\perp
=
(3,4)-(3,0)
=
(0,4).
$$

Indeed,

$$
(0,4)\cdot(2,0)=0
$$

and

$$
5^2=3^2+4^2.
$$

## Projection is not change of basis

A projection asks:

> What part of a vector points in a chosen direction?

A change of basis asks:

> Which coefficients reproduce the same vector using a different coordinate
> system?

These questions are related, but they are not identical.

Let

$$
B=
\begin{bmatrix}
\vert & & \vert\\
\mathbf b_1&\cdots&\mathbf b_n\\
\vert & & \vert
\end{bmatrix}
$$

be the matrix whose columns are the new basis vectors, expressed in standard
coordinates. To find the coordinate vector $\mathbf c=[\mathbf r]_B$, solve

$$
B\mathbf c=\mathbf r.
$$

If $B$ is invertible, then

$$
\boxed{
\mathbf c=B^{-1}\mathbf r
}.
$$

### Orthogonal basis

If the basis vectors are mutually perpendicular but do not necessarily have
length $1$, then the coefficient of $\mathbf b_i$ is

$$
\boxed{
c_i
=
\frac{\mathbf r\cdot\mathbf b_i}
{\|\mathbf b_i\|^2}
}.
$$

The numerator divided by $\|\mathbf b_i\|$ is the scalar projection measured
in ordinary length units. Dividing once more by $\|\mathbf b_i\|$ converts that
length into a number of $\mathbf b_i$ basis vectors:

$$
\frac{\mathbf r\cdot\mathbf b_i}{\|\mathbf b_i\|}
\cdot
\frac1{\|\mathbf b_i\|}
=
\frac{\mathbf r\cdot\mathbf b_i}{\|\mathbf b_i\|^2}.
$$

If the basis is **orthonormal**, then $\|\mathbf b_i\|=1$, and this simplifies
to

$$
c_i=\mathbf r\cdot\mathbf b_i.
$$

### Orthogonal-basis example

Take

$$
\mathbf b_1=
\begin{bmatrix}
2\\
1
\end{bmatrix},
\qquad
\mathbf b_2=
\begin{bmatrix}
-2\\
4
\end{bmatrix}.
$$

They are orthogonal because

$$
\mathbf b_1\cdot\mathbf b_2
=
2(-2)+1(4)
=
0.
$$

Let

$$
\mathbf r=
\begin{bmatrix}
4\\
3
\end{bmatrix}.
$$

The first coordinate is

$$
c_1
=
\frac{\mathbf r\cdot\mathbf b_1}{\|\mathbf b_1\|^2}
=
\frac{4(2)+3(1)}{2^2+1^2}
=
\frac{11}{5}.
$$

The second coordinate is

$$
c_2
=
\frac{\mathbf r\cdot\mathbf b_2}{\|\mathbf b_2\|^2}
=
\frac{4(-2)+3(4)}{(-2)^2+4^2}
=
\frac4{20}
=
\frac15.
$$

Therefore

$$
[\mathbf r]_B
=
\begin{bmatrix}
11/5\\
1/5
\end{bmatrix}.
$$

Checking the result:

$$
\frac{11}{5}
\begin{bmatrix}
2\\
1
\end{bmatrix}
+
\frac15
\begin{bmatrix}
-2\\
4
\end{bmatrix}
=
\begin{bmatrix}
4\\
3
\end{bmatrix}.
$$

### Nonorthogonal basis

For a nonorthogonal basis, the individual dot-product formula does not work:
each basis vector's direction overlaps with the others.

We can always use

$$
\mathbf c=B^{-1}\mathbf r.
$$

An inner-product formulation uses the Gram matrix

$$
G_{ij}=\mathbf b_i\cdot\mathbf b_j.
$$

If

$$
d_i=\mathbf b_i\cdot\mathbf r,
$$

then the coordinate vector satisfies

$$
\boxed{
G\mathbf c=\mathbf d
}.
$$

For an orthogonal basis, $G$ is diagonal, and solving this system produces
$c_i=(\mathbf r\cdot\mathbf b_i)/\|\mathbf b_i\|^2$. For an orthonormal basis,
$G=I$.

The Gram matrix also explains how to calculate inner products from coordinates
in a nonorthonormal basis:

$$
\mathbf x\cdot\mathbf y
=
[\mathbf x]_B^\mathsf T
G
[\mathbf y]_B.
$$

Angles do not change merely because coordinates change. What changes is the
coordinate formula required to calculate the same inner product.

## The inequalities behind the construction

### Cauchy-Schwarz inequality

For all real inner-product vectors $\mathbf a$ and $\mathbf b$,

$$
\boxed{
|\mathbf a\cdot\mathbf b|
\leq
\|\mathbf a\|\|\mathbf b\|
}.
$$

Here is a direct proof. If $\mathbf b=\mathbf0$, the result is immediate.
Otherwise, every squared norm is nonnegative, so for any real $\lambda$,

$$
\|\mathbf a-\lambda\mathbf b\|^2\geq0.
$$

Choose

$$
\lambda
=
\frac{\mathbf a\cdot\mathbf b}{\|\mathbf b\|^2}.
$$

Expanding gives

$$
\begin{aligned}
0
&\leq
\left\|
\mathbf a
-
\frac{\mathbf a\cdot\mathbf b}{\|\mathbf b\|^2}
\mathbf b
\right\|^2\\
&=
\|\mathbf a\|^2
-
\frac{(\mathbf a\cdot\mathbf b)^2}{\|\mathbf b\|^2}.
\end{aligned}
$$

Therefore

$$
(\mathbf a\cdot\mathbf b)^2
\leq
\|\mathbf a\|^2\|\mathbf b\|^2.
$$

Taking square roots gives Cauchy-Schwarz.

This proof has a geometric meaning. The chosen multiple of $\mathbf b$ is the
projection of $\mathbf a$ onto $\mathbf b$, and a projection cannot be longer
than the original vector.

### Triangle inequality

For all vectors $\mathbf x$ and $\mathbf y$,

$$
\boxed{
\|\mathbf x+\mathbf y\|
\leq
\|\mathbf x\|+\|\mathbf y\|
}.
$$

Using Cauchy-Schwarz,

$$
\begin{aligned}
\|\mathbf x+\mathbf y\|^2
&=
(\mathbf x+\mathbf y)\cdot(\mathbf x+\mathbf y)\\
&=
\|\mathbf x\|^2
+2\mathbf x\cdot\mathbf y
+\|\mathbf y\|^2\\
&\leq
\|\mathbf x\|^2
+2\|\mathbf x\|\|\mathbf y\|
+\|\mathbf y\|^2\\
&=
(\|\mathbf x\|+\|\mathbf y\|)^2.
\end{aligned}
$$

Both sides are nonnegative, so taking square roots proves the result.

The triangle inequality guarantees that the three lengths

$$
\|\mathbf a\|,
\qquad
\|\mathbf b\|,
\qquad
\|\mathbf a-\mathbf b\|
$$

can form a triangle, possibly a degenerate one when the vectors are parallel.
For example,

$$
\|\mathbf a\|
=
\|\mathbf b+(\mathbf a-\mathbf b)\|
\leq
\|\mathbf b\|+\|\mathbf a-\mathbf b\|.
$$

The other two triangle inequalities follow in the same way.

### The law of cosines

For a triangle with side lengths $p,q,c$, where the angle $\theta$ lies between
the sides of lengths $p$ and $q$,

$$
\boxed{
c^2
=
p^2+q^2-2pq\cos\theta
}.
$$

One way to see this is to place the sides as coordinate vectors

$$
\mathbf p=(p,0),
\qquad
\mathbf q=(q\cos\theta,q\sin\theta).
$$

Then the third side has length $\|\mathbf p-\mathbf q\|$, and

$$
\begin{aligned}
c^2
&=
(p-q\cos\theta)^2+(q\sin\theta)^2\\
&=
p^2-2pq\cos\theta
+q^2(\cos^2\theta+\sin^2\theta)\\
&=
p^2+q^2-2pq\cos\theta.
\end{aligned}
$$

When $\theta=\pi/2$, the cosine term vanishes and the formula becomes the
Pythagorean theorem.

## A closer look at arccos

### Why cosine needs a restricted inverse

Cosine is periodic, so it is not one-to-one on all real numbers:

$$
\cos\theta
=
\cos(\theta+2\pi k)
$$

for every integer $k$. An inverse function cannot choose among infinitely many
angles unless we restrict the input interval.

On $[0,\pi]$, cosine decreases continuously from $1$ to $-1$. It is therefore
a bijection

$$
\cos:[0,\pi]\to[-1,1].
$$

Its inverse is

$$
\arccos:[-1,1]\to[0,\pi].
$$

The endpoints are included:

$$
\arccos(1)=0,
\qquad
\arccos(-1)=\pi.
$$

### Calculus description

For $-1\leq x\leq1$,

$$
\boxed{
\arccos x
=
\int_x^1
\frac{1}{\sqrt{1-t^2}}\,dt
}.
$$

This agrees with the inverse-function definition. In the interior
$-1<x<1$, its derivative is

$$
\frac{d}{dx}\arccos x
=
-\frac1{\sqrt{1-x^2}}.
$$

The negative derivative matches the fact that $\arccos$ decreases: a larger
cosine corresponds to a smaller angle on $[0,\pi]$.

### Infinite series

Around $x=0$,

$$
\arccos x
=
\frac{\pi}{2}-\arcsin x,
$$

where

$$
\arcsin x
=
\sum_{n=0}^{\infty}
\frac{(2n)!}{4^n(n!)^2(2n+1)}
x^{2n+1}.
$$

Thus

$$
\arccos x
=
\frac{\pi}{2}
-
\left(
x+\frac{x^3}{6}
+\frac{3x^5}{40}
+\frac{5x^7}{112}
+\cdots
\right).
$$

This series explains how a transcendental function can be approximated using
arithmetic. Real numerical libraries usually use carefully chosen polynomial
or rational approximations, identities, and range reduction rather than
blindly summing this series, especially near $x=\pm1$, where it converges
slowly and numerical sensitivity is greater.

### Numerical computation

In exact mathematics,

$$
q
=
\frac{\mathbf a\cdot\mathbf b}
{\|\mathbf a\|\|\mathbf b\|}
$$

always lies in $[-1,1]$. With floating-point arithmetic, rounding can produce a
value such as $1+10^{-16}$. Implementations commonly clamp the value before
calling arccos:

$$
\theta
=
\arccos\bigl(\min(1,\max(-1,q))\bigr).
$$

A numerically useful alternative is

$$
\theta
=
\operatorname{atan2}\left(
\sqrt{\max\left(0,
\|\mathbf a\|^2\|\mathbf b\|^2
-(\mathbf a\cdot\mathbf b)^2
\right)},
\mathbf a\cdot\mathbf b
\right).
$$

This formula uses both the cosine-like and sine-like parts of the angle and can
behave better for angles very close to $0$ or $\pi$.

## Summary

The complete chain is:

$$
\begin{aligned}
\text{inner product}
&\Longrightarrow
\|\mathbf a\|=\sqrt{\mathbf a\cdot\mathbf a},\\
\text{Cauchy-Schwarz}
&\Longrightarrow
-1\leq
\frac{\mathbf a\cdot\mathbf b}
{\|\mathbf a\|\|\mathbf b\|}
\leq1,\\
\text{law of cosines}
&\Longrightarrow
\frac{\mathbf a\cdot\mathbf b}
{\|\mathbf a\|\|\mathbf b\|}
=
\cos\theta,\\
\text{inverse cosine}
&\Longrightarrow
\theta
=
\arccos\left(
\frac{\mathbf a\cdot\mathbf b}
{\|\mathbf a\|\|\mathbf b\|}
\right).
\end{aligned}
$$

Projection then follows from the same identity:

$$
\operatorname{comp}_{\mathbf r}(\mathbf s)
=
\frac{\mathbf s\cdot\mathbf r}{\|\mathbf r\|},
$$

$$
\operatorname{proj}_{\mathbf r}(\mathbf s)
=
\frac{\mathbf s\cdot\mathbf r}{\|\mathbf r\|^2}\mathbf r.
$$

For change of basis:

$$
B[\mathbf r]_B=\mathbf r.
$$

Only for an orthogonal basis may each coordinate be calculated independently
as

$$
[\mathbf r]_{B,i}
=
\frac{\mathbf r\cdot\mathbf b_i}{\|\mathbf b_i\|^2}.
$$

These are three connected but distinct ideas:

1. An **angle** compares two directions.
2. A **projection** extracts the component in one direction.
3. A **change of basis** expresses the same vector using different coordinate
   coefficients.

## References

- [Miro board](https://miro.com/app/board/uXjVIlruzkc=/?share_link_id=571311439815)
- [Miro live view](https://miro.com/app/live-embed/uXjVIlruzkc=/?embedMode=view_only_without_ui&moveToViewport=595%2C55%2C964%2C929&embedId=161538425906)
