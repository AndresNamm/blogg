# How Backpropagation Multiplies and Sums Gradients

When learning backpropagation, two rules can initially feel disconnected:

1. **Multiply gradients along a path.**
2. **Add gradients when several paths meet.**

These are not arbitrary implementation details. Multiplication comes from the chain rule, while addition comes from the multivariable chain rule when one value affects the loss through several routes.

This post develops that idea using my [Micrograd from scratch notebook](https://github.com/AndresNamm/nn_zero_to_hero/blob/main/micrograd_from_scratch.ipynb). The companion post [Derivatives, Directional Derivatives, and the Gradient](derivatives_directional_derivatives_and_gradient.md) develops the underlying calculus intuition: a differentiable multivariable function is locally linear, so simultaneous first-order effects combine as a sum. This post applies that idea to gradient accumulation in computation graphs.

## Table of Contents

- [How Backpropagation Multiplies and Sums Gradients](#how-backpropagation-multiplies-and-sums-gradients)
  - [Table of Contents](#table-of-contents)
  - [1. The Computation Graph](#1-the-computation-graph)
  - [2. Why Backward Traversal?](#2-why-backward-traversal)
  - [3. Local Derivatives vs Global Gradients](#3-local-derivatives-vs-global-gradients)
  - [4. The Chain Rule Multiplies Along a Path](#4-the-chain-rule-multiplies-along-a-path)
  - [5. Gradients Add Where Paths Merge](#5-gradients-add-where-paths-merge)
  - [6. How Micrograd Implements Both Rules](#6-how-micrograd-implements-both-rules)
  - [7. Where Gradient Addition Appears in a Neural Network](#7-where-gradient-addition-appears-in-a-neural-network)
    - [One input feeds several neurons](#one-input-feeds-several-neurons)
    - [One hidden activation feeds the next layer](#one-hidden-activation-feeds-the-next-layer)
    - [Shared parameters receive contributions from every training example](#shared-parameters-receive-contributions-from-every-training-example)
    - [The same principle appears in other architectures](#the-same-principle-appears-in-other-architectures)
  - [8. Accumulation Within a Graph vs Across Training Steps](#8-accumulation-within-a-graph-vs-across-training-steps)
    - [Required: accumulation within the current computation graph](#required-accumulation-within-the-current-computation-graph)
    - [Usually unwanted: accumulation from an earlier optimization step](#usually-unwanted-accumulation-from-an-earlier-optimization-step)
  - [9. The Rule to Remember](#9-the-rule-to-remember)
  - [Deeper Dive References](#deeper-dive-references)


## 1. The Computation Graph  

A neural network can be viewed as a computation graph. Each scalar `Value` stores:

- its forward-pass value,
- the operation that created it,
- its input values,
- its current gradient,
- and a local `_backward()` function.

Consider a simple chain:

```text
i1 --> i2 --> L
```

Here, `i1` changes `i2`, and `i2` changes the final loss `L`. Backpropagation answers:

> If I make a tiny change to `i1`, how much will the final loss change?

That quantity is:

$$\frac{\partial L}{\partial i_1}$$

The forward pass constructs the graph and calculates its values. The backward pass traverses the same graph in the opposite direction and calculates how sensitive the loss is to each value.

## 2. Why Backward Traversal?
The Micrograd notebook first uses depth-first search to build a topological ordering and then reverses it. This means in backpropagation gradients for resulting neurons (Loss, final neurons) are calculated before earlier neurons
 

The loss is seeded with:

$$
\frac{\partial L}{\partial L}=1
$$

This simply says that changing `L` by one unit changes `L` by one unit.

The traversal then moves from results toward inputs. This order is essential because an input's `_backward()` function needs its already-calculated gradient with respect to the final loss. A node must first receive all gradient contributions from the nodes that use it. Only then can it propagate the complete gradient farther backward.

Reverse dfs therefore provides this guarantee:

> Every node propagates its gradient only after all downstream paths have contributed to it.

## 3. Local Derivatives vs Global Gradients

Consider one operation inside a larger computation graph:

$$
y=f(x_1,x_2,\ldots,x_n)
$$

The operation has **local derivatives**:

$$\frac{\partial y}{\partial x_1},
\frac{\partial y}{\partial x_2},
\ldots,
\frac{\partial y}{\partial x_n}$$

Each local derivative answers a question about this operation only:

> If this input changes slightly, how much does this function's immediate output change?

The function `f` does not need to know what happens before or after it in the neural network. For example, if:

$$
y=x_1x_2
$$

then its local derivatives are simply:

$$
\frac{\partial y}{\partial x_1}=x_2
\qquad\text{and}\qquad
\frac{\partial y}{\partial x_2}=x_1
$$

A **global gradient**, in the computation-graph sense, connects a value to the chosen final objective `L`:

$$
\frac{\partial L}{\partial y}
\qquad\text{or}\qquad
\frac{\partial L}{\partial x_i}
$$

It answers a different question:

> If this intermediate value changes slightly, how much does the final loss change after all downstream functions and paths are taken into account?

Micrograd's `Value.grad` stores this global gradient. If a `Value` named `y` is an intermediate result in the computation graph, then:

```python
y.grad
```

represents:

$$
\frac{\partial L}{\partial y}
$$

The operation's `_backward()` function combines that incoming global gradient with its own local derivative:

$$
\left.
\frac{\partial L}{\partial x_i}
\right|_{\text{through }y} =
\underbrace{\frac{\partial L}{\partial y}}_{\text{incoming global gradient}}
\underbrace{\frac{\partial y}{\partial x_i}}_{\text{local derivative}}
$$

The product is one path's contribution to the input's global gradient. If the input is used by several functions, it receives one such contribution from each function, and those contributions are added.

One terminology detail matters: **global gradient does not mean a derivative that is valid globally over the whole function domain**. Every derivative here is still local to the values from the current forward pass. “Global” only means that the derivative measures sensitivity to the final objective rather than sensitivity to one immediate function output.

This separation is what makes reverse-mode automatic differentiation modular:

- Each operation knows only its own local derivatives.
- The graph traversal supplies the global gradient arriving from downstream.
- The chain rule combines them into global gradients for the operation's inputs.

## 4. The Chain Rule Multiplies Along a Path

Return to the chain:

```text
i1 --> i2 --> L
```

Suppose:

$$
\frac{\partial L}{\partial i_2}=2
$$

This means a tiny one-unit movement in `i2` would produce approximately a two-unit movement in `L`.

Now suppose:

$$
\frac{\partial i_2}{\partial i_1}=7
$$

A tiny movement in `i1` is amplified seven times by the time it reaches `i2`. Each of those seven units then has the two-times effect that `i2` has on `L`. The total effect is:

$$
\frac{\partial L}{\partial i_1} =
\frac{\partial L}{\partial i_2}
\frac{\partial i_2}{\partial i_1} =
2 \cdot 7 =
14
$$

This is the chain rule. Along a single path, local change rates multiply:

$$
	ext{upstream gradient} =
\text{downstream gradient}
\times
\text{local derivative}
$$

This explains the basic pattern inside every Micrograd `_backward()` function:

```python
input.grad += local_derivative * output.grad
```

`output.grad` describes how the output affects the final loss. The local derivative describes how the input affects that output. Multiplying them connects the input all the way to the loss.

## 5. Gradients Add Where Paths Merge

Now consider a branch:

```text
        --> y1 --
       /         \
x ----           --> L
       \         /
        --> y2 --
```

The value `x` affects the loss through both `y1` and `y2`. Its total influence cannot be described by either path alone. It must include both:

$$
\frac{\partial L}{\partial x} =
\frac{\partial L}{\partial y_1}
\frac{\partial y_1}{\partial x}
+
\frac{\partial L}{\partial y_2}
\frac{\partial y_2}{\partial x}
$$

Each term is one complete route from `x` to `L`. Derivatives multiply within each route, and the route contributions are then added.

A concrete example is:

$$
y_1=w_1x
$$

$$
y_2=w_2x
$$

$$
L=y_1+y_2
$$

Because:

$$
\frac{\partial L}{\partial y_1}=1
\qquad\text{and}\qquad
\frac{\partial L}{\partial y_2}=1
$$

we get:

$$
\frac{\partial L}{\partial x} =
1\cdot w_1+1\cdot w_2 =
w_1+w_2
$$

The same `x` participated in two forward paths, so it receives two backward contributions.

This gives a useful visual rule:

```text
Forward pass:   one value branches into multiple paths
Backward pass:  gradients from those paths merge by addition
```

## 6. How Micrograd Implements Both Rules

For multiplication, the notebook defines the local backward function approximately as:

```python
def _backward():
    self.grad += other.data * out.grad
    other.grad += self.data * out.grad
```

For:

$$
\text{out}=\text{self}\cdot\text{other}
$$

the local derivatives are:

$$
\frac{\partial \text{out}}{\partial \text{self}}=\text{other}
$$

and:

$$
\frac{\partial \text{out}}{\partial \text{other}}=\text{self}
$$

Each local derivative is multiplied by `out.grad`, which carries the effect from `out` to the final loss. That is the chain rule.

The `+=` is equally important. If the same `Value` participates in several later operations, each `_backward()` call contributes another path to its gradient:

```python
self.grad += local_derivative * out.grad
```

Using assignment instead would be wrong:

```python
self.grad = local_derivative * out.grad
```

The second path would overwrite the first path's contribution. Micrograd would then report only whichever path happened to run last, rather than the total effect on the loss.

## 7. Where Gradient Addition Appears in a Neural Network

### One input feeds several neurons

In a fully connected layer, one input is normally connected to every neuron in that layer:

```text
          --> neuron 1
         /
input ----> neuron 2
         \
          --> neuron 3
```

Each neuron creates a different route from the input to the loss. The input gradient is the sum of all those routes.

The Micrograd notebook tracks this explicitly with `_gradient_updates`. In its example, `X_11` is passed to four neurons, so its gradient receives four updates: one contribution from each neuron.

### One hidden activation feeds the next layer

The same pattern appears between hidden layers. A hidden activation is typically consumed by every neuron in the following layer.

The notebook's `N_12` example receives four gradient updates because it is an input to four neurons in the next layer. Before `N_12` propagates backward, those four contributions must be added:

$$
\frac{\partial L}{\partial N_{12}} =
\sum_{j=1}^{4}
\frac{\partial L}{\partial z_j}
\frac{\partial z_j}{\partial N_{12}}
$$

Reverse topological traversal ensures the sum is complete before `N_12._backward()` runs.

### Shared parameters receive contributions from every training example

Neural-network weights are reused for all examples in a batch. Suppose the total loss for two examples is:

$$
L=L_1+L_2
$$

For a shared weight `w`:

$$
\frac{\partial L}{\partial w} =
\frac{\partial L_1}{\partial w}
+
\frac{\partial L_2}{\partial w}
$$

The notebook demonstrates this by constructing multiple forward passes and adding their individual losses into one total cost. Calling `backward()` on that cost sends every example's contribution to the shared weights.

This is why a parameter such as `W_141` may receive one contribution from one training example, but more contributions when additional examples use the same network.

### The same principle appears in other architectures

The rule is not limited to fully connected networks:

- A residual connection computes something like $y=F(x)+x$, so `x` receives gradients through both the transformed and skip paths.
- A recurrent neural network reuses the same parameters at several time steps, so their gradients sum across time.
- A convolutional kernel is reused at many image positions, so its gradient sums contributions from every output position where it was applied.

Whenever a value is reused, its gradient must gather the effect from every use.

## 8. Accumulation Within a Graph vs Across Training Steps

There are two different kinds of accumulation, and separating them is important.

### Required: accumulation within the current computation graph

During one backward pass, `+=` is necessary because it combines all valid paths from a value to the current loss.

### Usually unwanted: accumulation from an earlier optimization step

After the model parameters are updated, they occupy new positions. Gradients calculated at the old positions no longer describe the current local slopes. Before the next independent backward pass, those old gradients must therefore be cleared:

```python
for parameter in neural_network.parameters():
    parameter.grad = 0.0

loss.backward()

for parameter in neural_network.parameters():
    parameter.data -= learning_rate * parameter.grad
```

Resetting immediately after the update is also valid, as long as gradients are cleared exactly once before the next backward pass.

The distinction is:

> Sum contributions that belong to the same loss calculation; reset contributions that belong to an earlier optimization step.

Frameworks such as PyTorch follow the same model. Gradients accumulate by default, and training code explicitly clears them between optimization steps unless accumulation across several batches is intentional.

## 9. The Rule to Remember

Backpropagation becomes easier to reason about with three compact rules:

| Graph situation | Backward operation | Reason |
| --- | --- | --- |
| Operations occur one after another | Multiply gradients | Chain rule |
| One value reaches the loss through several paths | Add path contributions | Multivariable chain rule |
| A new optimization step begins | Reset old gradients | The parameters have moved |

Or even more compactly:

> **Multiply along paths. Add across paths. Reset between independent training steps.**

Micrograd makes these rules visible because each scalar operation implements its own local derivative, while reverse topological traversal connects all local derivatives into a complete gradient for every value.
