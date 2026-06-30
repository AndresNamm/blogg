# Derivatives, Directional Derivatives, and the Gradient

The shortest useful definition of a derivative is:

> A derivative tells how much a function output changes relative to a tiny input movement. Ratio between output change to input change.

For a single-variable function, that idea is written as:

$$
f'(x)=\lim_{h\to0}\frac{f(x+h)-f(x)}{h}
$$

This says: move the input by a very small amount $h$, measure the output change, and divide by the size of the input movement.

Another way to rearrange the same idea is:

$$
f(x+h)\approx f(x)+f'(x)h
$$

Above is just moving pices around from the derivative formula. We are removing the lim sign but starting to use the approximation sign now.



Through this we are using the derivative to estimate a nearby function value.

This is the key intuition for the whole topic. Near one point, a differentiable function behaves almost like a line. The function can still be curved globally, but if we zoom in enough around one point, the best local description is linear. In this case, linear means that each tiny input step produces a proportional output change, with the same local rate $f'(x)$.

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

The gradient is the vector of partial derivatives:

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

This is why multivariable derivative calculations often become weighted sums. The small movement $\mathbf{h}$ has some amount of movement in the $x$ direction and some amount of movement in the $y$ direction. The partial derivatives tell the local change rate in each coordinate direction, and the movement vector tells how much of the step goes in each direction.

The important assumption is not only that the function is continuous. The function must be differentiable at the point. Differentiability means the function has a good local linear approximation there. Curvature and complicated behavior can exist, but as the step size goes toward zero, the linear part dominates.

## Directional Derivative

The directional derivative asks:

> If I take a tiny step from point $\mathbf{a}$ in a chosen direction, how fast does the function value change?

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

Because $\hat{\mathbf{u}}$ has length 1, the number $h$ is the actual step length.

Using the local linear approximation:

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

- the gradient, which stores the local change rates in the coordinate directions
- the unit direction vector, which stores the direction of the movement

## Why Is It a Weighted Sum?

At first, it can feel strange that a complicated function can be handled by just summing weighted partial derivatives.

The reason is that the derivative is about infinitesimally small movement. Around the point $\mathbf{a}$, a differentiable function behaves like its tangent plane:

$$
f(\mathbf{a}+\mathbf{h})-f(\mathbf{a})
\approx
\nabla f(\mathbf{a})\cdot \mathbf{h}
$$

If:

$$
\hat{\mathbf{u}}=(u_x,u_y)
$$

then stepping in that direction means moving partly in $x$ and partly in $y$:

$$
h\hat{\mathbf{u}}=(hu_x,hu_y)
$$

The approximate output change is:

$$
\Delta f
\approx
\frac{\partial f}{\partial x}(hu_x)
+
\frac{\partial f}{\partial y}(hu_y)
$$

Divide by $h$:

$$
\frac{\Delta f}{h}
\approx
\frac{\partial f}{\partial x}u_x
+
\frac{\partial f}{\partial y}u_y
$$

That is exactly:

$$
\nabla f(\mathbf{a})\cdot\hat{\mathbf{u}}
$$

The weighted sum works because we are measuring the best local linear approximation. For a finite step, curvature may matter. For an infinitesimal step, the linear part is the derivative.

## A More Formal Version

If $f$ is differentiable at $\mathbf{a}$, then:

$$
\lim_{\mathbf{x}\to\mathbf{a}}
\frac{
\left|
f(\mathbf{x})-
\left(f(\mathbf{a})+\nabla f(\mathbf{a})\cdot(\mathbf{x}-\mathbf{a})\right)
\right|
}{
\|\mathbf{x}-\mathbf{a}\|
}
=0
$$

This says the error of the linear approximation becomes tiny compared with the input step length.

Choose:

$$
\mathbf{x}=\mathbf{a}+h\hat{\mathbf{u}}
$$

Then:

$$
\mathbf{x}-\mathbf{a}=h\hat{\mathbf{u}}
$$

and because $\hat{\mathbf{u}}$ is a unit vector:

$$
\|h\hat{\mathbf{u}}\|=|h|
$$

So the differentiability condition becomes:

$$
\lim_{h\to0}
\frac{
\left|
f(\mathbf{a}+h\hat{\mathbf{u}})
-f(\mathbf{a})
-h\nabla f(\mathbf{a})\cdot\hat{\mathbf{u}}
\right|
}{
|h|
}
=0
$$

This means:

$$
\lim_{h\to0}
\left|
\frac{f(\mathbf{a}+h\hat{\mathbf{u}})-f(\mathbf{a})}{h}
-
\nabla f(\mathbf{a})\cdot\hat{\mathbf{u}}
\right|
=0
$$

Therefore:

$$
D_{\hat{\mathbf{u}}}f(\mathbf{a})
=
\lim_{h\to0}
\frac{f(\mathbf{a}+h\hat{\mathbf{u}})-f(\mathbf{a})}{h}
=
\nabla f(\mathbf{a})\cdot\hat{\mathbf{u}}
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

which happens when $\theta=0$, meaning the direction vector points in the same direction as the gradient.

Therefore, the gradient points in the direction of steepest ascent.

The maximum directional derivative value is:

$$
\|\nabla f(\mathbf{a})\|
$$

The steepest descent direction is the opposite direction:

$$
-\nabla f(\mathbf{a})
$$

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

The reason this is possible is that both directions have total length 1, but the gradient direction uses that unit-length movement across both coordinates. It is not moving "more than one unit" in total. It is choosing the unit direction whose components best align with all the positive partial derivative contributions.

## Summary

- A derivative measures output change relative to a tiny input movement.
- A differentiable function is locally approximated by an affine expression.
- The linear part of that approximation is the derivative.
- In many dimensions, the gradient stores the partial derivatives.
- A directional derivative measures the change rate in one chosen unit direction.
- The directional derivative formula is:

$$
D_{\hat{\mathbf{u}}}f(\mathbf{a})
=
\nabla f(\mathbf{a})\cdot\hat{\mathbf{u}}
$$

- This dot product is a projection of the gradient onto the chosen direction.
- The largest projection happens when the direction matches the gradient.
- Therefore, the gradient points in the direction of steepest ascent.

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

