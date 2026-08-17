# What Is a Derivative?

The shortest useful answer is:

> A derivative describes how a tiny input movement changes a function's output.

For a single input and output, this idea is introduced as the limit:

$$
f'(a)=
\lim_{h\to0}
\frac{f(a+h)-f(a)}{h}.
$$

The numerator is the output change, the denominator is the input change, and the limit asks what their ratio approaches as the input movement becomes infinitesimal.

## From Measuring Change to Predicting Change

The limit formula measures the slope at $a$. The same derivative can predict the output change caused by a small finite movement $h$:

$$
f(a+h)-f(a)\approx f'(a)h.
$$

Equivalently:

$$
f(a+h)\approx f(a)+f'(a)h.
$$

Read this as:

- $f(a)$ is the current output;
- $f'(a)$ is the local change rate;
- $h$ is the input movement;
- $f'(a)h$ is the predicted output movement.

The function may be curved globally, but sufficiently close to $a$, its change looks approximately linear.

## Example: The Prediction Is Local

Let:

$$
f(x)=x^2.
$$

At $a=3$:

$$
f'(3)=6.
$$

The derivative therefore predicts:

$$
f(3+h)-f(3)\approx6h.
$$

For $h=0.01$, the predicted change is $0.06$. The exact change is:

$$
(3.01)^2-3^2=0.0601.
$$

The prediction is close because the movement is small. For $h=10$, the derivative predicts a change of $60$, while the exact change is $160$. The derivative still accepts the input $h=10$, but its approximation meaning is local.

## Is the Derivative a Number or a Linear Map?

In one-dimensional calculus, $f'(a)$ is a number. More formally, the derivative at $a$ is the linear map:

$$
Df(a):h\mapsto f'(a)h.
$$

For the previous example:

$$
Df(3)[h]=6h.
$$

The number $6$ represents the map $h\mapsto6h$. Every linear map from $\mathbb R$ to $\mathbb R$ has this form, so elementary calculus usually identifies the map with its single scalar coefficient.

This distinction becomes useful in several dimensions, where one number is no longer enough.

## The Derivative in Several Dimensions

For:

$$
f:\mathbb R^n\to\mathbb R^m,
$$

the derivative at $\mathbf a$ is a linear map:

$$
Df(\mathbf a):\mathbb R^n\to\mathbb R^m.
$$

Its input $\mathbf h$ is a displacement in the input space. Its output $Df(\mathbf a)[\mathbf h]$ is the first-order predicted displacement in the output space:

$$
f(\mathbf a+\mathbf h)-f(\mathbf a)
\approx
Df(\mathbf a)[\mathbf h].
$$

After coordinates are chosen, the Jacobian matrix represents this linear map:

$$
Df(\mathbf a)[\mathbf h]=
J_f(\mathbf a)\mathbf h.
$$

The Jacobian is not a different derivative. It is the matrix representation of the derivative map.

If $f:\mathbb R^n\to\mathbb R$ has one scalar output, its Jacobian is a row vector and the gradient is conventionally the corresponding column vector:

$$
J_f(\mathbf a)=\nabla f(\mathbf a)^\mathsf T.
$$

Therefore:

$$
Df(\mathbf a)[\mathbf h]=
\nabla f(\mathbf a)\cdot\mathbf h.
$$

## What "First-Order" Means

The exact definition separates the function's change into a linear prediction and a remainder:

$$
f(\mathbf a+\mathbf h)-f(\mathbf a)=
Df(\mathbf a)[\mathbf h]+r(\mathbf h),
$$

where:

$$
\frac{\|r(\mathbf h)\|}{\|\mathbf h\|}
\to0
\quad\text{as}\quad
\mathbf h\to\mathbf0.
$$

This says the error becomes negligible compared with the size of the movement.

Terms proportional to one small movement are first-order. Terms such as $h_x^2$ or $h_xh_y$ are second-order: if every component has size roughly $\varepsilon$, first-order terms have size roughly $\varepsilon$, while second-order terms have size roughly $\varepsilon^2$ and disappear faster.

The derivative keeps the first-order part. Curvature and interactions remain in the higher-order error.

## Why the Derivative Must Be Linear

A small combined movement can be decomposed into component movements. The first-order model must satisfy:

$$
Df(\mathbf a)[\mathbf u+\mathbf v]=
Df(\mathbf a)[\mathbf u]
+
Df(\mathbf a)[\mathbf v],
$$

and:

$$
Df(\mathbf a)[c\mathbf u]=
cDf(\mathbf a)[\mathbf u].
$$

This is what makes the derivative usable: it predicts the effect of any small movement by combining the effects of simpler movements.

## Summary

- A derivative is a local description of change.
- At a fixed point, it maps an input displacement to a first-order predicted output displacement.
- In one dimension, a scalar represents that linear map.
- In several dimensions, a Jacobian matrix represents it.
- The prediction approaches the exact change as the displacement approaches zero.

Next, [Directional Derivatives and Why They Are Sums](directional_derivative_and_why_it_is_a_sum.md) shows how this linear map measures change along any chosen direction.
