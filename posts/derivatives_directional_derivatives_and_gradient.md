# Derivatives, Directional Derivatives, and the Gradient

## TL;DR

- A derivative measures how a tiny input movement changes a function's output.
- For several inputs, the gradient stores one partial derivative per input direction.
- The first-order output change is a weighted sum:

$$
\Delta f\approx\nabla f(\mathbf{a})\cdot\mathbf{h}
=
\sum_i\frac{\partial f}{\partial x_i}h_i
$$

- The terms add because differentiability gives a **linear** local change map: simultaneous first-order effects combine by addition.
- A directional derivative measures the change along one chosen unit direction.
- The gradient points toward steepest ascent; its negative points toward steepest descent.
- [How Backpropagation Multiplies and Sums Gradients](micrograd_gradient_accumulation.md) applies this local linearity to explain why gradient contributions accumulate in neural-network computation graphs.

The shortest useful definition of a derivative is:

> A derivative tells how much a function's output changes relative to a tiny input movement. It is the ratio of output change to input change.

$$
\text{derivative} = \frac{\text{output change}}{\text{input change}}
$$



For a single-variable function, that idea is written as:

$$
f'(x)=\lim_{h\to0}\frac{f(x+h)-f(x)}{h}
$$

This says: move the input by a very small amount $h$, measure the output change, and divide by the size of the input movement.

Rearranging the same idea gives:

$$
f(x+h)\approx f(x)+f'(x)h
$$

This is just the derivative formula with the pieces moved around: we drop the limit sign and replace equality with approximation, since $h$ is now a small but finite step.

Although the algebra is trivial, this second form changes what the derivative *is for*. The first form is a measurement: it looks at a function we already know and reports its local rate of change. The second form is a prediction machine: from just two numbers at a single point — the value $f(x)$ and the rate $f'(x)$ — it estimates the function's value at a nearby point we have not evaluated.

Read the right-hand side piece by piece:

- $f(x)$ is the starting value: where we are now.
- $f'(x)h$ is the estimated change: local rate times step size.
- Their sum is the forecast of where the function lands after the step.

In other words, the rearrangement replaces the function near $x$ with the simplest possible model — a straight line through $(x, f(x))$ with slope $f'(x)$ — and everything in the rest of this post is built on that replacement. The gradient, the directional derivative, and steepest ascent are all answers to the question: what does this local linear model look like when the input is a vector?

This is the key intuition for the whole topic. Near one point, a differentiable function behaves almost like a line. The function can still be curved globally, but if we zoom in enough around one point, the best local description is linear. Here, linear means that each tiny input step produces a proportional output change, with the same local rate $f'(x)$.

## From One Input to Many Inputs

Now suppose the function has several inputs:

$$
z=f(x,y)
$$

The input is no longer just one number. It is a point in input space:

$$
\mathbf{a}=(x,y)
$$

and a small movement is a vector:

$$
\mathbf{h}=(h_x,h_y)
$$

For a differentiable multivariable function, the same local idea still holds:

$$
f(\mathbf{a}+\mathbf{h})\approx f(\mathbf{a})+\nabla f(\mathbf{a})\cdot \mathbf{h}
$$

The gradient is the vector of partial derivatives In different axis separately:

$$
\nabla f(\mathbf{a})=
\begin{bmatrix}
\frac{\partial f}{\partial x}(\mathbf{a}) \\
\frac{\partial f}{\partial y}(\mathbf{a})
\end{bmatrix}
$$

So the local output change is approximately:

$$
\Delta f\approx
\frac{\partial f}{\partial x}h_x+
\frac{\partial f}{\partial y}h_y
$$

 This is why multivariable derivative calculations often become weighted sums. The small movement $\mathbf{h}$ contains some movement in the $x$ direction and some in the $y$ direction. The partial derivatives give the local change rate along each coordinate axis, and the movement vector says how much of the step goes in each direction. Multiply and add.

At first, it can feel strange that an arbitrarily complicated function can be reduced to a weighted sum of partial derivatives. The reason is that the derivative is about infinitesimally small movement: around the point $\mathbf{a}$, a differentiable function behaves like its tangent plane. For a finite step, curvature may matter. For an infinitesimal step, only the linear part survives, and that linear part is the derivative.

One important caveat: continuity is not enough. The function must be differentiable at the point, which means precisely that a good local linear approximation exists there.

## Why Multivariable Change Is a Sum

It is useful to state the precise claim first: **the gradient itself is a vector, not a scalar sum**. The sum appears when the gradient acts on a small input movement to predict the resulting scalar output change.

For:

$$
f(x,y)
$$

a small movement can be decomposed into separate coordinate movements:

$$
\mathbf{h}
=
\begin{bmatrix}
h_x\\
h_y
\end{bmatrix}
=
h_x
\begin{bmatrix}
1\\
0
\end{bmatrix}
+
h_y
\begin{bmatrix}
0\\
1
\end{bmatrix}
$$

Differentiability means that near the current point $\mathbf{a}$, the output change is described by a linear map $Df(\mathbf{a})$. Because this map is linear, it preserves addition:

$$
Df(\mathbf{a})[\mathbf{h}]
=
Df(\mathbf{a})
\left[
h_x
\begin{bmatrix}
1\\
0
\end{bmatrix}
+
h_y
\begin{bmatrix}
0\\
1
\end{bmatrix}
\right]
$$

$$
=
h_xDf(\mathbf{a})
\left[
\begin{bmatrix}
1\\
0
\end{bmatrix}
\right]
+
h_yDf(\mathbf{a})
\left[
\begin{bmatrix}
0\\
1
\end{bmatrix}
\right]
$$

The derivative along the first coordinate axis is $\frac{\partial f}{\partial x}$, and along the second it is $\frac{\partial f}{\partial y}$. Therefore:

$$
\Delta f
\approx
Df(\mathbf{a})[\mathbf{h}]
=
\frac{\partial f}{\partial x}h_x
+
\frac{\partial f}{\partial y}h_y
$$

This is why the multivariable first-order change is a sum: the tiny movement contains an $x$ component and a $y$ component, and the locally linear model adds their individual effects.

### Why interaction terms disappear at first order

Consider:

$$
f(x,y)=xy
$$

Move both inputs:

$$
f(x+h_x,y+h_y)
=
(x+h_x)(y+h_y)
$$

Expanding gives:

$$
xy+yh_x+xh_y+h_xh_y
$$

After subtracting the original value $xy$:

$$
\Delta f
=
yh_x+xh_y+h_xh_y
$$

The first two terms are the sum predicted by the gradient:

$$
\frac{\partial f}{\partial x}h_x
+
\frac{\partial f}{\partial y}h_y
=
yh_x+xh_y
$$

The remaining term $h_xh_y$ multiplies two small movements together. It is a second-order term, so it shrinks faster than either first-order term as the movement approaches zero. The derivative keeps the first-order effects and places everything smaller into the approximation error:

$$
\Delta f
\approx
yh_x+xh_y
$$

So the sum is not claiming that the complete nonlinear function contains no interactions. It says that, at an infinitesimally small scale, the surviving first-order effects add.

### From coordinate movements to computation-graph paths

The same principle explains gradient accumulation in backpropagation. Suppose one value $x$ affects the loss through two intermediate functions:

$$
y_1=f_1(x)
\qquad\text{and}\qquad
y_2=f_2(x)
$$

with:

$$
L=H(y_1,y_2)
$$

A tiny movement $dx$ changes both branches:

$$
dy_1\approx\frac{\partial y_1}{\partial x}dx
\qquad\text{and}\qquad
dy_2\approx\frac{\partial y_2}{\partial x}dx
$$

Because the local change of $H$ is linear in its input movements:

$$
dL
\approx
\frac{\partial L}{\partial y_1}dy_1
+
\frac{\partial L}{\partial y_2}dy_2
$$

Substituting the two branch changes gives:

$$
dL
\approx
\left(
\frac{\partial L}{\partial y_1}
\frac{\partial y_1}{\partial x}
+
\frac{\partial L}{\partial y_2}
\frac{\partial y_2}{\partial x}
\right)dx
$$

Therefore:

$$
\frac{\partial L}{\partial x}
=
\frac{\partial L}{\partial y_1}
\frac{\partial y_1}{\partial x}
+
\frac{\partial L}{\partial y_2}
\frac{\partial y_2}{\partial x}
$$

Each product describes one complete path from $x$ to $L$. The products add because changing $x$ activates both paths simultaneously. [How Backpropagation Multiplies and Sums Gradients](micrograd_gradient_accumulation.md) develops this computation-graph interpretation using Micrograd and concrete neural-network examples.

## Directional Derivative

Each partial derivative measures change along the coordinate axes. But we can move in any direction, not just along the axes. The directional derivative asks:

> If I take a tiny step from point $\mathbf{a}$ in a **chosen direction**, how fast does the function value change?

Let $\hat{\mathbf{u}}$ be a unit vector pointing in the chosen direction. Unit vector means:

$$
\|\hat{\mathbf{u}}\|=1
$$

The directional derivative is:

$$
D_{\hat{\mathbf{u}}}f(\mathbf{a})
=
\lim_{h\to0}
\frac{f(\mathbf{a}+h\hat{\mathbf{u}})-f(\mathbf{a})}{h}
$$

Because $\hat{\mathbf{u}}$ has length 1, the number $h$ is the actual step length. This is why we insist on a unit vector: it keeps "change per unit of distance" comparable across directions.

Now derive the formula. Using the local linear approximation with $\mathbf{h}=h\hat{\mathbf{u}}$:

$$
f(\mathbf{a}+h\hat{\mathbf{u}})
\approx
f(\mathbf{a})+\nabla f(\mathbf{a})\cdot(h\hat{\mathbf{u}})
$$

Subtract $f(\mathbf{a})$:

$$
f(\mathbf{a}+h\hat{\mathbf{u}})-f(\mathbf{a})
\approx
h\nabla f(\mathbf{a})\cdot\hat{\mathbf{u}}
$$

Divide by $h$:

$$
\frac{f(\mathbf{a}+h\hat{\mathbf{u}})-f(\mathbf{a})}{h}
\approx
\nabla f(\mathbf{a})\cdot\hat{\mathbf{u}}
$$

Then take the limit as $h\to0$:

$$
D_{\hat{\mathbf{u}}}f(\mathbf{a})
=
\nabla f(\mathbf{a})\cdot\hat{\mathbf{u}}
$$

So the directional derivative is the dot product between:

- the gradient, which stores the local change rates along the coordinate axes
- the unit direction vector, which stores the direction of the movement

In component form, with $\hat{\mathbf{u}}=(u_x,u_y)$, this is again a weighted sum:

$$
D_{\hat{\mathbf{u}}}f(\mathbf{a})
=
\frac{\partial f}{\partial x}u_x
+
\frac{\partial f}{\partial y}u_y
$$



## Why the Gradient Points in the Direction of Steepest Ascent

The directional derivative in direction $\hat{\mathbf{u}}$ is:

$$
D_{\hat{\mathbf{u}}}f(\mathbf{a})
=
\nabla f(\mathbf{a})\cdot\hat{\mathbf{u}}
$$

The question "which direction gives the steepest ascent?" becomes:

> Which unit vector $\hat{\mathbf{u}}$ maximizes the dot product with $\nabla f(\mathbf{a})$?

The dot product can be written as:

$$
\nabla f(\mathbf{a})\cdot\hat{\mathbf{u}}
=
\|\nabla f(\mathbf{a})\|\|\hat{\mathbf{u}}\|\cos(\theta)
$$

This is just the geometric definition of the dot product: for any two vectors, the dot product equals the product of their lengths times the cosine of the angle $\theta$ between them. It follows directly from the law of cosines applied to the triangle formed by the two vectors and the vector connecting their tips.

Because $\hat{\mathbf{u}}$ is a unit vector:

$$
\|\hat{\mathbf{u}}\|=1
$$

so:

$$
\nabla f(\mathbf{a})\cdot\hat{\mathbf{u}}
=
\|\nabla f(\mathbf{a})\|\cos(\theta)
$$

This is largest when:

$$
\cos(\theta)=1
$$

which happens when $\theta=0$, meaning the direction vector points the same way as the gradient.

Therefore, the gradient points in the direction of steepest ascent.

The maximum rate of increase, achieved in that direction, is the gradient's own length:

$$
\|\nabla f(\mathbf{a})\|
$$

The steepest descent direction is the opposite one, $-\nabla f(\mathbf{a})$, which is exactly the direction gradient descent uses.

## Why Not Just Move Along the Biggest Partial Derivative?

Suppose the gradient is:

$$
\nabla f=
\begin{bmatrix}
3 \\
4
\end{bmatrix}
$$

The biggest single partial derivative is $4$, so one possible idea is to move only in the $y$ direction:

$$
\hat{\mathbf{u}}=
\begin{bmatrix}
0 \\
1
\end{bmatrix}
$$

The directional derivative would be:

$$
\nabla f\cdot\hat{\mathbf{u}}
=
\begin{bmatrix}
3 \\
4
\end{bmatrix}
\cdot
\begin{bmatrix}
0 \\
1
\end{bmatrix}
=4
$$

But the unit vector in the gradient direction is:

$$
\hat{\mathbf{g}}
=
\frac{\nabla f}{\|\nabla f\|}
=
\frac{1}{5}
\begin{bmatrix}
3 \\
4
\end{bmatrix}
=
\begin{bmatrix}
0.6 \\
0.8
\end{bmatrix}
$$

Now the directional derivative is:

$$
\nabla f\cdot\hat{\mathbf{g}}
=
\begin{bmatrix}
3 \\
4
\end{bmatrix}
\cdot
\begin{bmatrix}
0.6 \\
0.8
\end{bmatrix}
=
1.8+3.2
=5
$$

Moving only in the $y$ direction gives a change rate of $4$. Moving in the gradient direction gives a change rate of $5$.

This works because both directions have total length 1, but the gradient direction spreads that unit-length movement across both coordinates. It is not moving "more than one unit" in total. It is spending its unit of movement where it pays off: partly in $x$, partly in $y$, in proportion to how much each partial derivative contributes. That balanced allocation beats putting everything into the single largest component.

### An Intuitive Analogy: Splitting a Fixed Budget

The same "balanced beats extreme" pattern shows up in plain arithmetic. Suppose you must split the number $10$ into two positive parts, $a$ and $b$, with $a+b=10$, and your goal is to make the product $a\times b$ as large as possible. A few options:

$$
1\times9=9
\qquad
2\times8=16
\qquad
5\times5=25
$$

The most lopsided split, $1\times9$, wastes most of the budget: one side is huge, but the other is barely contributing, and the product suffers. The balanced split, $5\times5$, uses the same total budget of $10$ far more effectively and produces the largest product.

The unit vector $\hat{\mathbf{u}}$ works under an analogous constraint. Its "budget" is not a sum but a fixed length: $\|\hat{\mathbf{u}}\|=\sqrt{u_x^2+u_y^2}=1$ (equivalently, $u_x^2+u_y^2=1$). Choosing $\hat{\mathbf{u}}=(0,1)$ is the geometric equivalent of the $1\times9$ split — all of the movement budget goes into $y$, and none is left to capture the $x$-component of the gradient, even though that component ($3$, in the earlier example) still had value to offer. Choosing $\hat{\mathbf{u}}=(0.6,0.8)$, the gradient's own direction, is the equivalent of the balanced $5\times5$ split: the fixed unit length is divided between $x$ and $y$ in proportion to how much each one actually contributes to the change in $f$, so nothing is wasted.

That is the core intuition behind why the gradient direction wins: it is not "spending more," it is spending the same fixed budget more wisely, in proportion to where the payoff actually is.

In effect, splitting the budget across directions lets the movement in each direction multiply with the movement in the others, so their contributions reinforce one another rather than a single axis carrying the whole step alone.


## Summary

- A derivative measures output change relative to a tiny input movement.
- A differentiable function is locally approximated by an affine expression; the linear part of that approximation is the derivative.
- In many dimensions, the gradient collects the partial derivatives into one vector.
- The gradient produces a weighted sum because the derivative is a linear map: simultaneous first-order input effects add.
- In a computation graph, this same rule makes gradient contributions add when several paths connect one value to the loss.
- A directional derivative measures the change rate along one chosen unit direction.
- The directional derivative formula is:

$$
D_{\hat{\mathbf{u}}}f(\mathbf{a})
=
\nabla f(\mathbf{a})\cdot\hat{\mathbf{u}}
$$

- This dot product is the projection of the gradient onto the chosen direction.
- The projection is largest when the direction matches the gradient itself.
- Therefore, the gradient points in the direction of steepest ascent, and its length is that maximum rate.

## NB: Linear vs Affine

Strictly speaking, $f(x)+f'(x)h$ is an affine expression because it has an offset $f(x)$. The truly linear part is:

$$
h\mapsto f'(x)h
$$

That distinction matters in linear algebra, where a linear map must satisfy:

$$
L(a+b)=L(a)+L(b)
$$

and

$$
L(ca)=cL(a)
$$

In calculus, when people say "local linear approximation", they usually mean the full affine approximation:

$$
f(x+h)\approx f(x)+\text{linear change}
$$
