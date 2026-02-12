# IMPORTANT CONCEPTS OF PROBABILITY THEORY

1. Probability must be between 0..1. 
2. Independence and Conditional probability
    1. Independence: $P(A \cap B)=P(A)P(B)$
    2. Always true: $P(A \cap B) = P(A)P(B|A)$
3. Random Variables 
4. Probability Distributions
5. Bayes Theorem 

# RANDOM VARIABLES AND PROBABILITY DISTRIBUTIONS

## PROBABILITY SPACE

First we will define Probability Space

**Sample Space $\Omega$**

**Points** in **Sample Space** are called **Sample Outcomes** 

**Subsets** of **Sample Space** are called **Events**

![alt text](images/event_space.png)

### EXAMPLE

We have an experiment with 1 draw from pack of cards:

- Sample Space - All possible draws
- Sample Outcome - Elementaarsündmus
    - 1 card
- Example events - (Can contain multiple Sample Outcoumes)
    - Draw any card from Spades
    - Draw any card more powerful than 6
    

## LETS DEFINE PROBABILITY

P,$\Omega$,F

- F Is the events space - All subsets of Sample Outcome possible for $\Omega$ - $2^n$ where n is the amount of sample outcomes. This is binary because event can either happen/not happen.
    - Pack of cards
        - 1 possible event is draw any card from spades
        - another is to draw card more powerful than 6
        - All combinations of events.
- Probability assigns now any event in F a certain probability
