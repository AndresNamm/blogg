# Derivatives, Directional Derivatives, and Gradients: A Practical Map

Derivatives become easier to understand when they are treated as one connected idea instead of a collection of formulas:

> Near a point, a differentiable function behaves like a linear map from a small input movement to the resulting output movement.

This series develops that idea through four questions.

| Question | Article | Core answer |
| --- | --- | --- |
| What is a derivative? | [What Is a Derivative?](what_is_a_derivative.md) | The derivative is the best linear prediction of local change. |
| What is a directional derivative, and why is it a sum? | [Directional Derivatives and Why They Are Sums](directional_derivative_and_why_it_is_a_sum.md) | A direction is made of coordinate movements, and the derivative adds their first-order effects. |
| How do derivatives work in neural networks? | [How Derivatives Work in Neural Networks](micrograd_gradient_accumulation.md) | Backpropagation multiplies derivatives along paths and adds contributions across paths. |
| What is a gradient, and why does it point toward the largest change? | [Why the Gradient Points Toward Steepest Ascent](gradient_direction_of_steepest_ascent.md) | The directional derivative is largest when the movement direction aligns with the gradient. |

## The Whole Idea in Four Equations

For a single-variable function, the derivative is introduced as a local rate:

$$
f'(a)=\lim_{h\to0}\frac{f(a+h)-f(a)}{h}.
$$

Its practical meaning is a prediction of nearby change:

$$
f(a+h)-f(a)\approx f'(a)h.
$$

For a scalar-valued function with several inputs, the same prediction becomes:

$$
f(\mathbf a+\mathbf h)-f(\mathbf a)
\approx
\nabla f(\mathbf a)\cdot\mathbf h.
$$

If $\hat{\mathbf u}$ is a unit vector, the change per unit distance in that direction is:

$$
D_{\hat{\mathbf u}}f(\mathbf a)=
\nabla f(\mathbf a)\cdot\hat{\mathbf u}.
$$

The dot product is a weighted sum of partial derivatives. The sum appears because a movement such as $\mathbf h=(h_1,\ldots,h_n)$ is composed of movements along the coordinate axes. Differentiability says that, to first order, the effects of those component movements combine linearly.

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
