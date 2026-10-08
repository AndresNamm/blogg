# Q-Q Plot and Shapiro-Wilk Test

**Q: Why check normality at all?**  
A one-sample t-test measures how far the mean is from a proposed value, such as 0, in units of noise. It then looks up how rare that is using the t distribution. Strong skew or outliers can make its p-value and confidence interval unreliable.

With enough independent observations and finite variance, the sampling distribution of the *mean* becomes more bell-like (central limit theorem). Around 37 items, mild non-normality is often tolerable, but there is no magic sample-size guarantee.

---

**Q: Which thing must be normal?**  
Not the raw values. The **paired per-item differences**.

Example: we measure the same 37 logs with a new method and with a reference method. For each log:

$$
d_i = \text{new}_i - \text{reference}_i
$$

The 37 values $d_i$ are what the t-test works on, so the 37 values $d_i$ are what we check.

---

**Q: What is a Q-Q plot?**  
A picture that compares your sorted data against what a "perfect bell" sample of the same size would look like. If the dots fall on a straight line, your data looks normal.

---

**Q: How is it built? Tiny example, n = 5.**  
Data: `12, 9, 10, 15, 11`.

1. **Sort** it: `9, 10, 11, 12, 15`. These are the $y$ values.
2. Give each rank a probability slot: $p = \frac{\text{rank} - 0.5}{n}$, so `0.1, 0.3, 0.5, 0.7, 0.9`.
3. Turn each probability into a "perfect bell" value: $x = \text{norm.ppf}(p)$.
4. Plot the pairs $(x, y)$.

| rank | y (sorted data) | p | x = norm.ppf(p) |
|---|---|---|---|
| 1 | 9 | 0.1 | -1.28 |
| 2 | 10 | 0.3 | -0.52 |
| 3 | 11 | 0.5 | 0.00 |
| 4 | 12 | 0.7 | 0.52 |
| 5 | 15 | 0.9 | 1.28 |

Note: $x$ depends **only on n**, never on the data.

---

**Q: What exactly is `norm.ppf`?**  
It is the **inverse cumulative normal**: you give a probability, it gives the value that has that much probability below it. `norm.ppf(0.5) = 0`, `norm.ppf(0.9) = 1.28`.

It is **not** the bell-curve height (`norm.pdf`), and it is **not** evenly spaced numbers from -2 to 2.

Why not evenly spaced? We cut the bell into slots of **equal probability**. Near the middle the bell is tall, so the slots are narrow and the $x$ values bunch together. In the tails the bell is low, so the slots are wide and the values spread out.

---

**Q: What changes when n grows?**  
More slots, more bunching near 0, and the extremes reach further out (using $\frac{\text{rank}-0.5}{n}$):

| n | most extreme x |
|---|---|
| 5 | ±1.28 |
| 37 | ±2.21 |
| 100 | ±2.58 |
| 1000 | ±3.29 |

SciPy's `probplot` uses slightly different positions (Filliben), where for n = 37 the extremes are ±2.08. That is why Q-Q plots usually show about -2 to 2 on the x-axis.

---

**Q: Where is 0 on a Q-Q plot?**  
$x = 0$ is the middle of the bell template. $y = 0$ is just a horizontal line on the data axis, nothing special. If your data is centred at -9, the whole cloud of dots simply sits lower, around $y=-9$.

For normal data, the reference line approximately has:

- **intercept** = the mean of your data
- **slope** = the standard deviation (SD) of your data

A fitted line's exact slope depends on the plotting positions and fitting method; it need not equal the sample SD. A quartile-based line can also have a different intercept.

---

**Q: Can I see one?**  
Below: 37 dummy values from a normal distribution with mean 10 and SD 2. The dots are straight, but sit far above the grey $y=0$ line.

![](images/qq_hand_made.png)

---

**Q: How do I read it?**

| What you see | What it means |
|---|---|
| Dots on a straight line | Looks normal |
| Both ends bend away from the line | Heavy tails (more extremes than a bell) |
| A smile or frown curve | Skew (one long tail) |
| One dot far off | Outlier |
| Dots in flat steps | Rounded / discrete data |

Here is normal data next to exponential data (a strongly skewed shape):

![](images/qq_normal_vs_exponential.png)

---

**Q: What does the Shapiro-Wilk test do?**  
It asks: *"If the data were truly normal, how surprising is a sample that looks like this?"*

- $p > 0.05$: no strong evidence against normality from this test.
- $p < 0.05$: evidence against normality at the conventional 5% threshold.

Both methods use the expected behaviour of sorted normal data. A Q-Q plot usually uses normal quantiles at chosen probabilities; Shapiro-Wilk uses specially calculated weights. They are related, not identical calculations.

Think of $W$ as a numerical check of the normal-spacing pattern. It is related to Q-Q straightness, but is **not literally the squared correlation of your ordinary Q-Q plot**.

---

**Q: What is a Shapiro weight? Is it the Q-Q x value?**

A weight is simply a **multiplier**. The Q-Q x value places a dot on a chart; a Shapiro weight tells us how much a sorted value contributes to a calculation.

For five values, the numbers look like this:

```text
Q-Q x values:     -1.28,  -0.52,  0,  +0.52,  +1.28
Shapiro weights: -0.6646,-0.2413, 0, +0.2413,+0.6646
```

The weights are rounded here. They depend only on the sample size, not on your measurements. They are derived from expected normal order statistics and their covariance, not by simply rescaling the Q-Q x values. SciPy calculates approximations internally; it does not generate a fresh random template each time.

The opposite signs let us work with paired gaps:

```text
-0.6646 * smallest + 0.6646 * largest
= 0.6646 * (largest - smallest)
```

For five values, there are two pairs and the middle gets weight zero. For ten values, there are five pairs: smallest with largest, second-smallest with second-largest, and so on. The weights change with the sample size.

---

**Q: How do we calculate W?**

We calculate two numbers, **A** and **B**, then divide:

$$
W = \frac{A}{B}
$$

Use five sorted values:

```text
9, 10, 11, 12, 13
```

**A: combine the paired gaps with the weights, then square.**

```text
Outer gap: 13 - 9  = 4
Inner gap: 12 - 10 = 2

A = (0.6646 * 4 + 0.2413 * 2)**2
  = 3.141**2
  = 9.866 (approximately)
```

A is a squared, weighted measurement of spread. **A alone is not a normality score.** It is not a probability, and there is no universal "bad A" value.

**B: subtract the mean from every value, square, and add.**

The mean is 11:

```text
Values:       9   10   11   12   13
Differences: -2   -1    0   +1   +2
Squares:      4    1    0    1    4

B = 4 + 1 + 0 + 1 + 4 = 10
```

B measures total spread around the mean. Squaring stops positive and negative differences from cancelling and makes faraway values count more.

**Is B variance?** Almost: B is the *sum of squared deviations*. Sample variance is `B / (n - 1)`, which here is `10 / 4 = 2.5`.

Now divide:

```text
W = 9.866 / 10 = 0.9866 (approximately)
```

SciPy, using more precise weights, gives W = 0.9868 and p = 0.9672. With only five values, that does not prove the underlying distribution is normal.

---

**Q: Why should A and B be similar for normal-looking data?**

Normal data has a characteristic spacing pattern: values are generally crowded near the centre and more spread out in the tails. The weights are designed around that pattern.

Here are five approximate normal-template values shifted to centre them at 10:

```text
8.72, 9.48, 10.00, 10.52, 11.28
```

The neighbouring gaps are `0.76, 0.52, 0.52, 0.76`: smaller in the middle.

```text
B = 1.28**2 + 0.52**2 + 0 + 0.52**2 + 1.28**2
  = 3.8176

A = (0.6646 * 2.56 + 0.2413 * 1.04)**2
  = 3.8116 (approximately)
```

They almost match. Shifting the template or stretching every value preserves the pattern and the ratio.

**Important distinction:** an outer *paired* gap is always at least as large as an inner paired gap for sorted data. That alone does not indicate normality. The full spacing pattern is what matters.

---

**Q: But why does the multiplication recognise a pattern?**

Here is a simplified pattern-matching example, **not the actual Shapiro weights**.

Suppose the expected, centred pattern is:

```text
template = [-2, -1, 0, 1, 2]
```

Its sum of squares is 10. Make unit-length weights by dividing the template by `sqrt(10)`.

If our centred data follows exactly that pattern:

```text
Weighted sum = (4 + 1 + 0 + 1 + 4) / sqrt(10)
             = sqrt(10)

A = sqrt(10)**2 = 10
B = 4 + 1 + 0 + 1 + 4 = 10
```

**Multiplying a pattern by itself produces its squared spread.** Normalising the weights and squaring the result puts A on the same scale as B. A different pattern aligns less well.

Actual Shapiro weights use a more carefully calculated normal-based pattern. This example explains the multiplication, not how to reproduce those weights.

In linear-algebra terms, A is the squared projection of the centred, sorted data onto the unit-length weight vector. B is the data vector's squared length:

```text
B = A + squared leftover mismatch
```

That identity explains why W cannot exceed 1 in exact arithmetic. It is not because one estimator is "more careful" than another. The weight vector is not exactly your Q-Q plot's x vector.

---

**Q: What happens with a large outlier?**

Change only the last value:

```text
9, 10, 11, 12, 25
```

Now the outer gap is 16 and the inner gap is still 2. The mean changes to 13.4:

```text
A = (0.6646 * 16 + 0.2413 * 2)**2
  = 123.57 (approximately)

B = (-4.4)**2 + (-3.4)**2 + (-2.4)**2 + (-1.4)**2 + 11.6**2
  = 173.20

W = A / B = 0.7135 (approximately)
```

Stretching the normal-based template enough to reach the last value would also spread out the other values. But those remain crowded together. No single stretch fits everything well, so A captures a smaller fraction of B.

Both A and B involve squaring; the explanation is **not** that only B squares the outlier.

**Is a small A bad?** No. Double every value and A and B both grow fourfold, leaving W unchanged. The comparison matters:

| Data | A, approximate | B | W, approximate |
|---|---:|---:|---:|
| `9, 10, 11, 12, 13` | 9.87 | 10.00 | 0.987 |
| `18, 20, 22, 24, 26` | 39.46 | 40.00 | 0.987 |
| `9, 10, 11, 12, 25` | 123.57 | 173.20 | 0.714 |

Low W suggests non-normal spacing, not bad measurements or useless data. There is no universal W cutoff for every sample size.

---

**Q: Where does the p-value come from? A statistical table?**

**Essentially yes:** it comes from the reference distribution of W for normal samples of your size.

Imagine building a reference table:

```text
1. Generate many normal samples, each with n values.
2. Calculate W for each sample.
3. Count how often W is as low as, or lower than, your W.
```

If about 1% have W that low, your p-value is approximately 0.01. This is a conceptual simulation; **SciPy does not run it every time**. It uses published formulas and approximations for the reference distribution.

```text
Your data -> W
W + sample size -> p-value
```

For `9, 10, 11, 12, 25`, SciPy gives p = 0.0132: if we drew five independent values from a normal distribution, about 1.3% of samples would have W this low or lower.

**It is not a 1.3% probability that your data is normal.** Nor does a large p prove normality. Random normal samples also have imperfect spacing; the p-value allows for that randomness.

---

**Q: Can I calculate A and B in Python?**

This teaching example uses rounded weights valid **only for n = 5**. Use `stats.shapiro` for the actual test.

```python
import numpy as np
from scipy import stats

values = np.sort(np.array([9, 10, 11, 12, 25], dtype=float))

outer_gap = values[4] - values[0]
inner_gap = values[3] - values[1]
A = (0.6646 * outer_gap + 0.2413 * inner_gap) ** 2

mean = values.mean()
B = ((values - mean) ** 2).sum()

print(f"A = {A:.2f}, B = {B:.2f}, approximate W = {A / B:.4f}")
W, p = stats.shapiro(values)
print(f"SciPy W = {W:.4f}, p = {p:.4f}")
```

---

**Q: What are its limits?**

- It says **whether** data is off, not **how** (look at the Q-Q plot for that).
- Small n: low power, it misses real problems.
- Large n: it flags tiny, harmless deviations.
- $p = 0.06$ vs $p = 0.04$ is not a cliff, it is almost the same evidence.
- Passing is not proof of normality.

---

**Q: THE KEY MISCONCEPTION: does the data have to be a normal centred at 0?**  
**No.** The standard normal (mean 0, SD 1) is only a fixed *template* for the shape. Your sample's own mean and SD are free. Q-Q and Shapiro-Wilk ignore location and scale: they only care about the **shape**.

Dummy demo: 37 draws from `rng.normal(10, 2)` with `default_rng(0)`.

| Check | Result |
|---|---|
| Sample mean / SD | 9.75 / 1.55 |
| Q-Q line | intercept 9.75, slope 1.53 (SciPy `probplot` slope: 1.58) |
| Shapiro-Wilk | W = 0.9792, p = 0.7032 |
| Shapiro on `data - 10` | identical W and p |
| Shapiro on `data * 5 + 100` | identical W and p |
| One-sample t-test vs 0 | p ≈ 8e-31 |

The data was drawn from a normal distribution, yet is centred nowhere near 0. The finite sample is not a perfect bell. These are **two separate questions**:

- *Is it bell-shaped?* → Q-Q plot, Shapiro-Wilk.
- *Is the mean 0?* → t-test.

Contrast: exponential data (same seed, scale 2, 37 values) gives W = 0.80, p ≈ 1.4e-5, and a clearly bent Q-Q plot.

---

**Q: What if normality fails?**  
Options:

- Report the **median** with a **bootstrap CI**.
- Consider the **Wilcoxon signed-rank** test if its assumptions fit the question. It assumes a symmetric difference distribution for a location interpretation and is not a test of the mean. A sign test needs fewer shape assumptions.
- If errors are strictly positive and skewed (e.g. ratios new / reference), consider the **log**, then check the transformed paired differences before a t-test. Logs cannot take zero or negative values.

Recipe: **look at the Q-Q plot first, Shapiro second, consider the scientific question and test assumptions, and explain your choice.** A Shapiro rejection does not automatically invalidate a t-test.

---

**Q: What are common pitfalls?**

- Check the normality of the **differences**, not the raw data.
- Repeated measurements (e.g. many frames of the same log) are **not independent** samples. One log = one data point.
- Don't t-test simulation repetitions as if they were independent logs: you can make n as big as you like and get a "tiny p-value" that means nothing.

---

**Q: Copy-paste code?**

```python
import numpy as np
from scipy import stats
import matplotlib.pyplot as plt

rng = np.random.default_rng(0)
d = rng.normal(10, 2, 37)            # dummy "differences"

n = len(d)
y = np.sort(d)
x = stats.norm.ppf((np.arange(1, n + 1) - 0.5) / n)

slope, intercept = np.polyfit(x, y, 1)
plt.scatter(x, y)
plt.plot(x, intercept + slope * x, "r-")
plt.axhline(0, color="gray", ls="--")
plt.xlabel("perfect-bell partner x")
plt.ylabel("sorted data y")
plt.show()

W, p = stats.shapiro(d)
print(f"W={W:.4f}, p={p:.4f}")
```

---

## Remember

- A t-test needs the **paired differences** to be roughly bell-shaped, not the raw values.
- Q-Q plot: sorted data (y) against equal-probability bell values (x, from `norm.ppf`). Approximately straight suggests normality.
- x depends only on n. Line location reflects the centre, and slope reflects spread.
- A is squared weighted spread; B is total squared spread, not variance itself. Neither is a normality score alone.
- Shapiro-Wilk compares them with W = A/B. The p-value tells us how unusually low W is under normality for this sample size.
- $p<0.05$ is evidence against normality, not the probability that data is normal; a pass is not proof.
- Neither checks that the mean is 0, they ignore location and scale. "Is it bell-shaped?" and "Is the mean 0?" are different questions.
- Alternatives answer different questions and have their own assumptions: median + bootstrap, signed-rank or sign tests, or suitable transformations.
- Independence matters as much as shape.
