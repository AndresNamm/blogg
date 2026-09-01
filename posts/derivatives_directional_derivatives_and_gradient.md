# Derivatives Practical Map

Derivatives become easier to understand when they are treated as one connected idea instead of a collection of formulas:

> Near a point, a differentiable function behaves like a linear map from a small input movement to the resulting output movement.

This series develops that idea through four separate blogposts.

# Thorough Overview

- [What Is a Derivative?, Why is it a sum?](what_is_a_derivative.md)
- [Directional Derivatives and Why They Are Sums](directional_derivative_and_why_it_is_a_sum.md)
- [How Derivatives Work in Neural Networks](micrograd_gradient_accumulation.md)
- [Why the Gradient Points Toward Steepest Ascent](gradient_direction_of_steepest_ascent.md)

If you want to get idea quickly, below is short recap

# Short Recap



For a single-variable function, the derivative is introduced as a local rate:

$$
f'(a)=\lim_{h\to0}\frac{f(a+h)-f(a)}{h}.
$$

Its practical meaning is a prediction of nearby change. We can rewrite the derivative definition to show that, for small $h$, the change in $f$ is approximately linear in $h$:

$$
f(a+h)-f(a)\approx f'(a)h.
$$

## Directional Derivatives and Why They Are Sums

For a scalar-valued function with several inputs, the same prediction becomes:

$$
f(\mathbf a+\mathbf h)-f(\mathbf a)
\approx
\nabla f(\mathbf a)\cdot\mathbf h.
$$

Here, $\mathbf h=(h_1,\ldots,h_n)$ describes how far we move in each input coordinate. The dot product expands to:

$$
\nabla f(\mathbf a)\cdot\mathbf h
=
\frac{\partial f}{\partial x_1}(\mathbf a)h_1
+\cdots+
\frac{\partial f}{\partial x_n}(\mathbf a)h_n.
$$

Each term predicts one coordinate's contribution to the change in $f$. For example, $\frac{\partial f}{\partial x_1}(\mathbf a)h_1$ is the change caused by moving $h_1$ in the first coordinate. **We add the terms because the complete movement combines all of these coordinate movements. When the movement is small, differentiability tells us that this sum is a good approximation of the total change.**

## How This Becomes Backpropagation

A neural network is a composition of many small functions. Each operation knows only its local derivative. Backpropagation connects those local derivatives to the final loss:

- derivatives multiply when operations occur one after another;
- contributions add when one value affects the loss through several paths;
- reverse traversal ensures every downstream contribution arrives before a node propagates its gradient further.

This is the same local-linear model, applied repeatedly through a computation graph.

## Why the Gradient Gives the Largest Change

For every unit direction $\hat{\mathbf u}$:

$$
\nabla f(\mathbf a)\cdot\hat{\mathbf u}=
\|\nabla f(\mathbf a)\|\cos\theta,
$$

where $\theta$ is the angle between the gradient and the direction. This quantity is largest when $\theta=0$, so the direction of steepest ascent is the gradient direction. The opposite direction, $-\nabla f$, gives steepest descent.

## Suggested Reading Order

Start with [What Is a Derivative?](what_is_a_derivative.md), then read [Directional Derivatives and Why They Are Sums](directional_derivative_and_why_it_is_a_sum.md). The gradient article turns the directional-derivative formula into a geometric result, while the neural-network article applies the same calculus to computation graphs and Micrograd.
