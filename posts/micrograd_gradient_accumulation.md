# How Derivatives Work in Neural Networks

Backpropagation can be summarized with three rules:

> **Multiply along paths. Add across paths. Reset between independent optimization steps.**

These rules are not special conventions invented for neural networks. They follow from the chain rule and from the fact that derivatives describe first-order change with a linear map.

This post uses the scalar computation-graph style of my [Micrograd from scratch notebook](https://github.com/AndresNamm/nn_zero_to_hero/blob/main/micrograd_from_scratch.ipynb). For the underlying calculus, first read [What Is a Derivative?](what_is_a_derivative.md) and [Directional Derivatives and Why They Are Sums](directional_derivative_and_why_it_is_a_sum.md).

## 1. A Neural Network Is a Computation Graph

A neural network is built from small operations such as addition, multiplication, matrix multiplication, and activation functions. The forward pass evaluates these operations and produces a loss:

```text
inputs -> layers -> prediction -> loss
```

The backward pass asks, for every intermediate value $x$:

> If $x$ changed by a tiny amount, how much would the final loss $L$ change?

The answer is the gradient:

$$
\frac{\partial L}{\partial x}.
$$

In Micrograd, each scalar `Value` stores its forward value, its inputs, the operation that created it, a gradient, and a local `_backward()` function.

## 2. Local Derivatives and Loss Gradients

Suppose one operation is:

$$
y=f(x_1,x_2).
$$

Its local derivatives are:

$$
\frac{\partial y}{\partial x_1}
\qquad\text{and}\qquad
\frac{\partial y}{\partial x_2}.
$$

They describe only how the operation's immediate output responds to its inputs. The operation does not need to know where the inputs came from or how $y$ will later be used.

During backpropagation, the operation also receives:

$$
\frac{\partial L}{\partial y},
$$

which describes how its output affects the final loss. Combining the incoming loss gradient with a local derivative gives one contribution to an input gradient:

$$
\left.
\frac{\partial L}{\partial x_i}
\right|_{\text{through }y}=
\frac{\partial L}{\partial y}
\frac{\partial y}{\partial x_i}.
$$

Micrograd's `Value.grad` stores the complete derivative of the current loss with respect to that value.

## 3. Why Derivatives Multiply Along a Path

Consider a chain:

```text
x -> y -> L
```

If:

$$
\frac{\partial L}{\partial y}=2
\qquad\text{and}\qquad
\frac{\partial y}{\partial x}=7,
$$

then a tiny change in $x$ is scaled by $7$ on its way to $y$, and the resulting change in $y$ is scaled by $2$ on its way to $L$:

$$
\frac{\partial L}{\partial x}=
\frac{\partial L}{\partial y}
\frac{\partial y}{\partial x}=
2\cdot7=
14.
$$

This is the chain rule. In a longer chain, every local rate along the path multiplies with the others.

For vector-valued operations, the same principle is composition of derivative maps, represented in coordinates by multiplication of Jacobian matrices. Reverse-mode automatic differentiation avoids constructing every full Jacobian and instead propagates the loss gradient backward through each operation.

## 4. Why Gradient Contributions Add Across Paths

Now let one value affect the loss through two branches:

```text
        -> y1 -
       /       \
x ----         -> L
       \       /
        -> y2 -
```

A change in $x$ changes both $y_1$ and $y_2$. The loss receives both first-order effects:

$$
\frac{\partial L}{\partial x}=
\frac{\partial L}{\partial y_1}
\frac{\partial y_1}{\partial x}
+
\frac{\partial L}{\partial y_2}
\frac{\partial y_2}{\partial x}.
$$

Each product is one complete path from $x$ to $L$. The products add because changing $x$ activates all paths simultaneously.

For example:

$$
y_1=w_1x,
\qquad
y_2=w_2x,
\qquad
L=y_1+y_2.
$$

Then:

$$
\frac{\partial L}{\partial x}=
w_1+w_2.
$$

The result must contain both uses of $x$. Keeping only one path would underestimate its effect on the loss.

## 5. Why Micrograd Uses `+=`

For multiplication:

$$
\text{out}=\text{self}\cdot\text{other},
$$

the local backward function is approximately:

```python
def _backward():
    self.grad += other.data * out.grad
    other.grad += self.data * out.grad
```

The multiplication by `out.grad` applies the chain rule. The `+=` accumulates a new path contribution without destroying contributions that arrived through other uses of the same value.

Using assignment would be wrong:

```python
self.grad = other.data * out.grad
```

If `self` affected the loss through two later operations, the second backward call would overwrite the first contribution.

## 6. Why the Graph Is Traversed Backward

Backpropagation begins by seeding the loss:

$$
\frac{\partial L}{\partial L}=1.
$$

Micrograd uses depth-first search to build a topological ordering, then processes that order in reverse. This guarantees that a node receives all downstream contributions before it sends its completed gradient farther toward its inputs.

The required order is:

```text
loss first -> later operations -> earlier operations -> inputs
```

An earlier node cannot calculate its effect on the loss until the nodes after it have calculated theirs.

## 7. Where Addition Appears in Real Networks

### One input feeds several neurons

In a fully connected layer, one activation is used by many neurons in the next layer. Its gradient is the sum of the path contributions through all of those neurons.

### Parameters are shared across examples

If the batch loss is:

$$
L=L_1+L_2+\cdots+L_b,
$$

then a shared weight $w$ receives:

$$
\frac{\partial L}{\partial w}=
\sum_{i=1}^{b}\frac{\partial L_i}{\partial w}.
$$

### Convolution and recurrence reuse values

A convolutional kernel is reused at many image positions, so its gradient adds contributions from every use. A recurrent network reuses parameters across time, so their gradients add across time steps. Residual connections create multiple routes and therefore multiple gradient contributions.

The architecture changes, but the rule does not: reused values collect derivatives from every route to the loss.

## 8. Accumulation Within a Graph vs Across Training Steps

Accumulation during one backward pass is required. Accumulation from an old optimization step is usually unwanted.

After parameters are updated, old gradients describe slopes at the old parameter values. Before calculating gradients for a new independent step, clear them:

```python
for parameter in neural_network.parameters():
    parameter.grad = 0.0

loss.backward()

for parameter in neural_network.parameters():
    parameter.data -= learning_rate * parameter.grad
```

Frameworks such as PyTorch also accumulate gradients by default. This enables intentional gradient accumulation across several mini-batches, but ordinary training loops explicitly reset gradients between optimizer steps.

## Summary

| Graph situation | Backward operation | Reason |
| --- | --- | --- |
| Operations occur sequentially | Multiply local derivatives | Chain rule |
| A value reaches the loss through several paths | Add path contributions | Linearity of first-order change |
| A new independent training step begins | Reset old gradients | Parameters now occupy a new point |

Backpropagation is therefore not a separate kind of calculus. It is an efficient way to repeatedly compose and accumulate ordinary local derivatives through a large computation graph.
