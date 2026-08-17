# Why the Gradient Points Toward Steepest Ascent

For a scalar-valued function:

$$
f:\mathbb R^n\to\mathbb R,
$$

the gradient is the vector of partial derivatives:

$$
\nabla f(\mathbf a)=
\begin{bmatrix}
\frac{\partial f}{\partial x_1}(\mathbf a)\\
\vdots\\
\frac{\partial f}{\partial x_n}(\mathbf a)
\end{bmatrix}.
$$

The gradient stores the local rate of change along every coordinate axis. Its deeper meaning appears when it is combined with a movement.

For a small displacement $\mathbf h$:

$$
f(\mathbf a+\mathbf h)-f(\mathbf a)
\approx
\nabla f(\mathbf a)\cdot\mathbf h.
$$

The gradient represents the derivative map for a scalar-valued function. It is not itself an output change; the dot product applies it to a particular movement.

## Turning Steepest Ascent into a Precise Question

To compare directions fairly, every candidate direction must have the same length. Let $\hat{\mathbf u}$ be a unit vector:

$$
\|\hat{\mathbf u}\|=1.
$$

The rate of change in that direction is the directional derivative:

$$
D_{\hat{\mathbf u}}f(\mathbf a)=
\nabla f(\mathbf a)\cdot\hat{\mathbf u}.
$$

The steepest-ascent question is therefore:

> Which unit vector $\hat{\mathbf u}$ maximizes this dot product?

## The Geometric Proof

The dot product can be written as:

$$
\nabla f(\mathbf a)\cdot\hat{\mathbf u}=
\|\nabla f(\mathbf a)\|
\|\hat{\mathbf u}\|
\cos\theta,
$$

where $\theta$ is the angle between the vectors. Since $\hat{\mathbf u}$ is a unit vector:

$$
D_{\hat{\mathbf u}}f(\mathbf a)=
\|\nabla f(\mathbf a)\|\cos\theta.
$$

The gradient length is fixed at the current point. The only varying part is $\cos\theta$, whose largest possible value is $1$. This occurs when $\theta=0$, meaning that $\hat{\mathbf u}$ points in the same direction as the gradient.

Therefore, if $\nabla f(\mathbf a)\ne\mathbf0$, the unit direction of steepest ascent is:

$$
\hat{\mathbf u}_{\max}=
\frac{\nabla f(\mathbf a)}
{\|\nabla f(\mathbf a)\|}.
$$

The maximum directional derivative is:

$$
D_{\hat{\mathbf u}_{\max}}f(\mathbf a)=
\|\nabla f(\mathbf a)\|.
$$

So:

- the gradient's direction gives the steepest local ascent;
- the gradient's length gives that maximum rate of ascent.

## Why Not Follow Only the Largest Partial Derivative?

Suppose:

$$
\nabla f=
\begin{bmatrix}
3\\
4
\end{bmatrix}.
$$

The largest partial derivative is $4$, so moving only along the $y$ axis gives:

$$
\begin{bmatrix}
3\\
4
\end{bmatrix}
\cdot
\begin{bmatrix}
0\\
1
\end{bmatrix}=
4.
$$

But the gradient length is:

$$
\|\nabla f\|=
\sqrt{3^2+4^2}=
5.
$$

The unit vector in the gradient direction is:

$$
\hat{\mathbf g}=
\frac15
\begin{bmatrix}
3\\
4
\end{bmatrix}=
\begin{bmatrix}
0.6\\
0.8
\end{bmatrix}.
$$

Moving in this direction gives:

$$
\nabla f\cdot\hat{\mathbf g}=
3(0.6)+4(0.8)=
5.
$$

Both candidate movements have total length $1$. The gradient direction performs better because it uses useful movement along both axes in exactly the proportions that maximize their combined contribution.

## Steepest Descent and Gradient Descent

The smallest possible directional derivative occurs when $\theta=\pi$ and $\cos\theta=-1$. The direction is:

$$
-\frac{\nabla f(\mathbf a)}
{\|\nabla f(\mathbf a)\|},
$$

and the rate is:

$$
-\|\nabla f(\mathbf a)\|.
$$

This is why optimization updates parameters opposite to the gradient:

$$
\mathbf w_{\text{new}}=
\mathbf w_{\text{old}}
-\eta\nabla L(\mathbf w_{\text{old}}),
$$

where $\eta$ is the learning rate.

The gradient gives the best infinitesimal descent direction, but it does not choose a safe finite step size. If $\eta$ is too large, curvature can make the actual loss increase even though the initial direction was downhill.

## What If the Gradient Is Zero?

When:

$$
\nabla f(\mathbf a)=\mathbf0,
$$

every directional derivative is zero:

$$
D_{\hat{\mathbf u}}f(\mathbf a)=0.
$$

There is then no first-order ascent or descent direction. The point could be a local minimum, a local maximum, a saddle point, or a flatter higher-order structure. Second-order information, summarized by the Hessian, is needed to distinguish these cases.

## Summary

- The gradient represents the derivative of a scalar-valued function.
- Its dot product with a unit direction is the directional derivative.
- That dot product is $\|\nabla f\|\cos\theta$.
- It is largest when the direction and gradient are aligned.
- The negative gradient gives the steepest local descent direction.
- This is a local, first-order result; step size and curvature still matter.

See [How Derivatives Work in Neural Networks](micrograd_gradient_accumulation.md) for how these local gradients are propagated through a neural-network computation graph.
