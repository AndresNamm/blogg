# Classification Metrics

## Accuracy

Proportion of correct predictions:

$$\text{Accuracy} = \frac{TP + TN}{TP + TN + FP + FN}$$

## Precision

Proportion of positive predictions that are correct:

$$\text{Precision} = \frac{TP}{TP + FP}$$

Answers: "Of all predicted positives, how many are truly positive?"

## Recall (Sensitivity)

Proportion of actual positives correctly identified:

$$\text{Recall} = \frac{TP}{TP + FN}$$

Answers: "Of all actual positives, how many did we find?"

## Notation

- $TP$ = True Positives
- $TN$ = True Negatives
- $FP$ = False Positives
- $FN$ = False Negatives

## Trade-off

High precision = fewer false alarms
High recall = fewer missed cases
Often inversely related.
