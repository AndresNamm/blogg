# Normal Distribution & Probability Density

**Q: What does Density functions compute?**  
The Normal (Gaussian) PDF: $f(x) = \frac{1}{\sigma\sqrt{2\pi}} \cdot e^{-\frac{1}{2}\left(\frac{x-\mu}{\sigma}\right)^2}$  
Returns the relative likelihood of a value given a distribution defined by `mean` (μ) and `std` (σ).

---

**Q: If I integrate from -∞ to +∞, what happens?**  
The result is exactly **1** — total probability over all outcomes = 100%. The $\frac{1}{\sigma\sqrt{2\pi}}$ constant exists precisely to ensure this.

---

**Q: Shouldn't the density value at each point be 0?**  
That's the probability of an exact point, yes — but density ≠ probability. Density is a **relative score** (like kg/m³). The probability of a *range* is obtained by integrating density over that range.

---


---

**Q: So integration of density = probability?**  
Yes: $P(a \leq X \leq b) = \int_a^b f(x)dx$

| Need | Approach |
|---|---|
| Is this value anomalous? | Compare density scores directly |
| Probability of falling in a range | Integrate density over that range |
| Rank anomalous tenants | Sort by density — lowest = most anomalous |

---

**Q: Why express probabilities via density at all?**  
For continuous variables, assigning non-zero probability to every point is impossible — uncountably infinite points would sum to ∞. Density sidesteps this by answering *"how likely is x relative to other values?"* rather than assigning absolute probability to a point.
