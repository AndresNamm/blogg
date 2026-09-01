
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
f(a+h)-f(a)\approx
\left(
\lim_{\delta\to0}
\frac{f(a+\delta)-f(a)}{\delta}
\right)h \approx f'(a)h
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

## Formal Definition of a Derivative

Let $f:\mathbb R^n\to\mathbb R^m$. The function $f$ is **differentiable at $\mathbf a$** if there is a linear map

$$
L:\mathbb R^n\to\mathbb R^m
$$

such that

$$
\lim_{\mathbf h\to\mathbf 0}
\frac{
\left\|f(\mathbf a+\mathbf h)-f(\mathbf a)-L(\mathbf h)\right\|
}{\|\mathbf h\|}
=0.
$$

This requires the **prediction error**

$$
f(\mathbf a+\mathbf h)-f(\mathbf a)-L(\mathbf h)
$$

must approach zero faster than $\|\mathbf h\|$. In asymptotic notation, this
error is $o(\|\mathbf h\|)$.

**This linear map is the derivative of $f$ at $\mathbf a$**, and we write it as

$$
Df(\mathbf a)=L.
$$


The expression $L(\mathbf h)$ is the derivative's prediction of the output change caused by the input movement $\mathbf h$. The limit says that the remaining prediction error becomes negligible compared with the size of $\mathbf h$ as $\mathbf h$ approaches zero.


- In coordinates, this linear map is represented by a matrix of partial derivatives. Each row corresponds to one output function, and each cell in that row shows how one input variable affects that output.
- This matrix is called the Jacobian



The **Jacobian** is a table containing every first partial derivative of the function. If

$$
f(\mathbf x)=
\begin{bmatrix}
f_1(\mathbf x)\\
\vdots\\
f_m(\mathbf x)
\end{bmatrix},
$$

then its Jacobian at $\mathbf a$ is the $m\times n$ matrix:

$$
J_f(\mathbf a)=
\begin{bmatrix}
\frac{\partial f_1}{\partial x_1}(\mathbf a) & \cdots & \frac{\partial f_1}{\partial x_n}(\mathbf a)\\
\vdots & \ddots & \vdots\\
\frac{\partial f_m}{\partial x_1}(\mathbf a) & \cdots & \frac{\partial f_m}{\partial x_n}(\mathbf a)
\end{bmatrix}.
$$

When $f:\mathbb R^n\to\mathbb R$ has only one output, $m=1$, so the Jacobian has only one row:

$$
J_f(\mathbf a)=
\begin{bmatrix}
\frac{\partial f}{\partial x_1}(\mathbf a) & \cdots & \frac{\partial f}{\partial x_n}(\mathbf a)
\end{bmatrix}.
$$

For a scalar-valued function, the Jacobian is therefore a $1\times n$ row
matrix. **NB** The gradient contains the same partial derivatives but arranges them as
an $n\times1$ column vector. Thus, the Jacobian is the transpose of the gradient:

$$
J_f(\mathbf a)=\nabla f(\mathbf a)^\mathsf T.
$$

For example, if

$$
f(x,y)=x^2+3y,
$$

then the single-output Jacobian is the row vector

$$
J_f(x,y)=
\begin{bmatrix}
2x & 3
\end{bmatrix}.
$$

At $(x,y)=(2,1)$, it becomes $J_f(2,1)=\begin{bmatrix}4 & 3\end{bmatrix}$. This says that near $(2,1)$, a small movement $h_x$ in $x$ contributes approximately $4h_x$ to the output change, while a small movement $h_y$ in $y$ contributes approximately $3h_y$.

Each row describes how one output changes with all the inputs. Each column describes how one input affects all the outputs. Multiplying the Jacobian by a small input movement $\mathbf h$ combines these effects to predict the resulting output movement:

$$
Df(\mathbf a)[\mathbf h]=
J_f(\mathbf a)\mathbf h.
$$

For example, consider:

$$
f(x,y)=
\begin{bmatrix}
x^2+y\\
xy
\end{bmatrix}.
$$

Its Jacobian is:

$$
J_f(x,y)=
\begin{bmatrix}
2x & 1\\
y & x
\end{bmatrix}.
$$

At $(x,y)=(2,3)$, this becomes:

$$
J_f(2,3)=
\begin{bmatrix}
4 & 1\\
3 & 2
\end{bmatrix}.
$$

If the input moves by $\mathbf h=(0.01,-0.02)$, the predicted output movement is:

$$
J_f(2,3)\mathbf h=
\begin{bmatrix}
4 & 1\\
3 & 2
\end{bmatrix}
\begin{bmatrix}
0.01\\
-0.02
\end{bmatrix}
=
\begin{bmatrix}
0.02\\
-0.01
\end{bmatrix}.
$$

So a small input movement of $(0.01,-0.02)$ produces an output movement of approximately $(0.02,-0.01)$. The Jacobian is not a different derivative; it is the matrix that represents the derivative map in coordinates.

## What "First-Order" Means


Based on formal definition of derivative we can also predict change using derivatives in multiple dimensions:

$$
f(\mathbf a+\mathbf h)-f(\mathbf a)
\approx
Df(\mathbf a)[\mathbf h].
$$

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

This says the error becomes negligible compared with the size of the movement. And if h approaches 0, we again have the definition of derivative.

Terms proportional to one small movement are first-order. Terms such as $h_x^2$ or $h_xh_y$ are second-order: if every component has size roughly $\varepsilon$, first-order terms have size roughly $\varepsilon$, while second-order terms have size roughly $\varepsilon^2$ and disappear faster.

The derivative keeps the first-order part. Curvature and interactions remain in the higher-order error.

## Why the Derivative Must Be Linear

A linear map can be decomposed into component movements. The first-order model must satisfy:

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

This is what makes the derivative usable even in case of multivariable inputs: it predicts the effect of any small movement by combining the effects of simpler movements.

## Summary

- A derivative is a local description of change.
- At a fixed point, it maps an input displacement to a first-order predicted output displacement.
- In one dimension, a scalar represents that linear map.
- In several dimensions, a Jacobian matrix represents it.
- The prediction approaches the exact change as the displacement approaches zero.

Next, [Directional Derivatives and Why They Are Sums](directional_derivative_and_why_it_is_a_sum.md) shows how this linear map measures change along any chosen direction.
