# Directional Derivatives and Why They Are Sums

A partial derivative measures change along one coordinate axis. A directional derivative measures change along any chosen direction.

Let $f:\mathbb R^n\to\mathbb R$, let $\mathbf a$ be the current point, and let $\hat{\mathbf u}$ be a unit vector. The directional derivative is:

$$
D_{\hat{\mathbf u}}f(\mathbf a)=
\lim_{t\to0}
\frac{f(\mathbf a+t\hat{\mathbf u})-f(\mathbf a)}{t}.
$$

It answers:

> If I move from $\mathbf a$ in direction $\hat{\mathbf u}$, how quickly does the function change per unit distance?

The vector is normally normalized so that $\|\hat{\mathbf u}\|=1$. Then $t$ describes the actual signed distance traveled.

## The Directional-Derivative Formula

If $f$ is differentiable at $\mathbf a$, its local change is:

$$
f(\mathbf a+\mathbf h)-f(\mathbf a)
\approx
Df(\mathbf a)[\mathbf h].
$$

Choose a movement $\mathbf h=t\hat{\mathbf u}$:

$$
f(\mathbf a+t\hat{\mathbf u})-f(\mathbf a)
\approx
tDf(\mathbf a)[\hat{\mathbf u}].
$$

Divide by $t$ and let $t$ approach zero:

$$
D_{\hat{\mathbf u}}f(\mathbf a)=
Df(\mathbf a)[\hat{\mathbf u}]=
\nabla f(\mathbf a)\cdot\hat{\mathbf u}.
$$

In components:

$$
D_{\hat{\mathbf u}}f(\mathbf a)=
\sum_{i=1}^{n}
\frac{\partial f}{\partial x_i}(\mathbf a)u_i.
$$

This is the sum that initially looks surprising: why should a potentially complicated function reduce to a weighted sum?

## Why It Is a Sum

Write the direction using the standard basis vectors:

$$
\hat{\mathbf u}=
\sum_{i=1}^{n}u_i\mathbf e_i.
$$

For example, in two dimensions:

$$
\hat{\mathbf u}=
u_x
\begin{bmatrix}1\\0\end{bmatrix}
+
u_y
\begin{bmatrix}0\\1\end{bmatrix}.
$$

The derivative is a linear map, so it preserves addition and scaling:

$$
\begin{aligned}
Df(\mathbf a)[\hat{\mathbf u}]
&=
Df(\mathbf a)
\left[
\sum_{i=1}^{n}u_i\mathbf e_i
\right] \\
&=
\sum_{i=1}^{n}
u_iDf(\mathbf a)[\mathbf e_i].
\end{aligned}
$$

The derivative along $\mathbf e_i$ is the partial derivative with respect to $x_i$:

$$
Df(\mathbf a)[\mathbf e_i]=
\frac{\partial f}{\partial x_i}(\mathbf a).
$$

Therefore:

$$
D_{\hat{\mathbf u}}f(\mathbf a)=
\sum_{i=1}^{n}
u_i
\frac{\partial f}{\partial x_i}(\mathbf a).
$$

The sum appears because the chosen direction is composed of coordinate-direction movements, and a linear map adds their first-order effects.

## A Concrete Example

Let:

$$
f(x,y)=xy.
$$

At the point $(2,3)$, the gradient is:

$$
\nabla f(2,3)=
\begin{bmatrix}
3\\
2
\end{bmatrix}.
$$

Choose the unit direction:

$$
\hat{\mathbf u}=
\begin{bmatrix}
3/5\\
4/5
\end{bmatrix}.
$$

The directional derivative is:

$$
\begin{aligned}
D_{\hat{\mathbf u}}f(2,3)
&=
\nabla f(2,3)\cdot\hat{\mathbf u} \\
&=
3\left(\frac35\right)
+
2\left(\frac45\right) \\
&=
\frac{17}{5}.
\end{aligned}
$$

The $x$ movement contributes $9/5$ and the $y$ movement contributes $8/5$. Their first-order effects add to $17/5$.

## What Happens to Interactions?

The function $f(x,y)=xy$ contains an interaction between $x$ and $y$. Move by $(h_x,h_y)$:

$$
\begin{aligned}
f(x+h_x,y+h_y)-f(x,y)
&=
(x+h_x)(y+h_y)-xy \\
&=
yh_x+xh_y+h_xh_y.
\end{aligned}
$$

The derivative predicts:

$$
yh_x+xh_y.
$$

The remaining interaction $h_xh_y$ is second-order because it multiplies two small movements. It shrinks faster than either movement as both approach zero. The directional derivative is a first-order rate, so the interaction belongs to the approximation error.

The weighted sum does not claim that the original function is globally linear or contains no interactions. It says that a differentiable function's infinitesimal change is linear.

## Partial Derivatives Are Special Directional Derivatives

Choosing a standard basis vector gives:

$$
D_{\mathbf e_i}f(\mathbf a)=
\frac{\partial f}{\partial x_i}(\mathbf a).
$$

So partial derivatives are not separate from directional derivatives. They are directional derivatives along the coordinate axes.

## A Small but Important Caveat

If a function is differentiable, the gradient formula gives every directional derivative. The converse is not always true: a function may have directional derivatives in every direction without having one consistent linear approximation.

Differentiability is the stronger statement. It guarantees that all directions come from the same derivative map rather than from unrelated one-dimensional limits.

## Summary

- A directional derivative measures change per unit distance along a chosen direction.
- For differentiable scalar-valued functions, it is $\nabla f(\mathbf a)\cdot\hat{\mathbf u}$.
- The dot product is a sum because the direction is a sum of coordinate movements.
- Linearity makes the first-order effects of those movements add.
- Nonlinear interactions remain in higher-order error terms.

[Why the Gradient Points Toward Steepest Ascent](gradient_direction_of_steepest_ascent.md) uses this formula to find which direction produces the largest possible change.
