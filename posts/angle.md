- [References](#references)
- [Projection Topic](#projection-topic)
- [**PROJECTION TOPIC** Projection | Coursera](#projection-topic-projection--coursera)
- [**CHANGE OF BASIS**](#change-of-basis)
- [NURGA TULETUSKÄIK](#nurga-tuletuskäik)
- [**MIKS ON NURK SEOTUD SIINUSE VÕI KOOSINUSEGA?**](#miks-on-nurk-seotud-siinuse-või-koosinusega)
- [OTHER WAYS TO THINK ABOUT ANGLE](#other-ways-to-think-about-angle)
  - [ANGLE IDEA](#angle-idea)
    - [DERIVATION OF ANGLE BETWEEN VECTORS FROM COSINE RULE - ML MATH COURSE](#derivation-of-angle-between-vectors-from-cosine-rule---ml-math-course)
- [ANGLE PROPERTIES](#angle-properties)
- [PREREQUISITES FOR ANGLE](#prerequisites-for-angle)
  - [DOT PRODUCT AND LENGTH](#dot-product-and-length)
  - [CAUCHY SWARCH](#cauchy-swarch)
  - [TRIANGLE INEQUALITY](#triangle-inequality)
  - [REMINDER OF COSINE AND SINUS](#reminder-of-cosine-and-sinus)
  - [**COSINE RULE**](#cosine-rule)
- [Arccosine](#arccosine)
- [Understanding the Angle Between Rays and the Arccosine Function](#understanding-the-angle-between-rays-and-the-arccosine-function)
  - [The Angle Between Two Rays Formula](#the-angle-between-two-rays-formula)
    - [Breakdown of the Formula:](#breakdown-of-the-formula)
  - [What is the Arccosine ($\\arccos$) Function?](#what-is-the-arccosine-arccos-function)
    - [1. The "Reverse" Function](#1-the-reverse-function)
    - [2. Calculus Definition (Integral)](#2-calculus-definition-integral)
    - [3. Infinite Series (How Computers Calculate It)](#3-infinite-series-how-computers-calculate-it)



If you look at the history of algebra and geometry that leads to vector spaces:

### Historical Milestones

- **570 BCE:** Pythagoras’ theorem
- **300 BCE:** Euclidean geometry (pre‐vectors)
- **17th Century (1637):** Cartesian coordinates introduced by Descartes
    - Enabled analytic geometry (e.g. circle: x² + y² = 4 )
    - Development of polar coordinates
- **19th Century:** Formal theory of vector spaces (Cauchy, Peano)

You will see how the angle we know from ancient geometry has been also defined in the algebraic world in a way the properties work in both. Essentially the connection to geometric intuition is established because this algebraic definition successfully captures and generalizes the properties of angles we are familiar with from traditional Euclidean geometry. Essentially you can generalize the geometric world tor alegbra. Thanks Descartes for doing this. 

https://miro.com/app/live-embed/uXjVIlruzkc=/?embedMode=view_only_without_ui&moveToViewport=595%2C55%2C964%2C929&embedId=161538425906

# References

https://miro.com/app/board/uXjVIlruzkc=/?share_link_id=571311439815

# Projection Topic


# **PROJECTION TOPIC** Projection | Coursera

We have 2 vectors, s and r. We are looking for s projection (Shade) to r. Aka how much s moves in direction to r.  

!Untitled

1. If we look at the picture, then s is hypotenuse and its projection to r is $\theta$ adjacent(KÜLGNEV) side. 
2. $cos (\theta) = \frac{adj}{hyp} = \frac{\text{|projection vector|}}{|s|} => |s| cos(\theta)   = \text{|projection vector|}$  
3. From the  angle derivation based on cosine rule  we get $s \cdot r = |r||s|cos(\theta)$
4. From previous we know $|s|cos(\theta)=|\text{projection vector}|$
5. Thus $s \cdot r = |r||\text{projection vector}|$
6. Thus $\frac{s\cdot r}{|r|} = \text{|projection vector|} = \text{Projection length of s onto r}$ (**Scalar Projection**)  **The lengths units are in standard basis here. Intuitiivselt ma leian skalaarkoruutisega kui palju vektor s läheb samal suunal, mis vektor r ning jagamisega tagan, et see “KUI PALJU” oleks standardbaasi mõõtühikutes.** 
    1. if we are projecting on standard basis , then $|r|=1$ and projection to it becomes just regular dot product $s \cdot r$
7. $\frac{r}{|r|}= \text{Vector going within the same direction as r but with length 1}$  (Unit vector in direction of r
    1. Proof :$\sqrt{\sum{\frac{r_i}{|r|}}^2}=\sqrt{\frac{1}{|r|^2}\sum{r_i}^2}=\sqrt{\frac{1}{\sqrt{\sum{r_i^2}}^2}\sum{r_i}^2}=\sqrt{\frac{1}{\sum{r_i^2}}\sum{r_i}^2}=\sqrt{1}=1$
8. Scalar Projection * Unit Vector in direction R = **Vector projection = $\frac{s\cdot r}{|r|} \cdot \frac{r}{|r|}$** 
9. Projecting to different basis $\frac{s\cdot r}{|r|{|r|}}$ - explanation below.  **Opposing to regular projection, the length units are of r basis length here.** 

# **CHANGE OF BASIS**

In the example above we are going to change the basis of the vector $r_e$ to use the basis $\hat{b_1},\hat{b_2}$ 

For this we first need to have the **new** basis $\hat{b_1},\hat{b_2}$ defined with $\hat{e}$ coordinates.

In this case 

$b_1e= \begin{bmatrix}
    2 \\ 
    1 \\ 
\end{bmatrix}=2*\hat{e_1}+1*\hat{e_2}$

$b_2e= \begin{bmatrix}
    -2 \\ 
    4 \\ 
\end{bmatrix}=-2*\hat{e_1}+4*\hat{e_2}$

Now we need to derive how r is looking like when described by basis b1 and b2 

That means 

- We need to describe r based on how much it goes towards $b_{1}$ and $b_2$ with length units of $b_{1}$ and $b_{2}$ accordingly.

To describe r by basis b for both b1 and b2 I need to 

1. Get scalar projection of r to $b_i$. $=> \frac{r \cdot b_i}{|b_i|}$
2. Divide that scalar projection by $|b_i|$. We **need** to do this to describe direction to $b_i$ with **length** units of **basis** $b_i$ instead of **basis** $e_i$

**NB, et antud projektsiooni funktsionaalsus toimuks baasivahetuse puhul peavad uued baasivektorid olema omavahel risti.**


# NURGA TULETUSKÄIK

Suures plaanis tasandil defineeritu nurgast vektorite vahelise nurgani minemine näeb välja midagi sellist, kus me liigume geomeetrilisest ruumist **eukleidilisse** vektorruumi. Me kasutame midagi sellist nagu isomorfimismid, kus me toome mingist ruumist omadused üle.

Eukleidilises vektorruumis on meie jaoks defineeritud ära 

- skalaarkorrutis
- pikkus

Nende abil saamegi **defineerida** nurga. 

!Untitled

Algebraliselt on nurk 2 vektori vahel defineerimiseks , oletame et need vektorid on **a ja b**

Oletame, et meil on 3 vektor

- a-b

Ja oletame, et meil on pikkus defineeritud vektorrruumis. Selleks on 

$\sqrt{a\cdot a}$

Ja me mõõdame iga elemendi pikkust

- a
- b
- a-b

KhanAcademys nüüd tõestatakse, et selliste pikkustega kolmnurka alati võimalik moodustada. Tõestamine kasutades teoreemi 

> (triangle inequality) $||x+y|| ≤||x||+||y||$ link
> 

- Ei kehti ||a|| > ||b|| + ||a-b||
    - ||a|| = ||b+(a-b)|| ≤ ||b|| + ||a-b|| because of triangle inequality $\cdot$
- Ei kehti ||b|| > ||a|| + ||a-b||
    - ||b||=||a+(b-a)||
        - ||a-b||=||b-a|| ⇒ ||a|| + ||a-b|| = ||a|| + ||b-a||
        - ||a+(b-a)||≤||a|| + ||b-a|| $\cdot$
- Ei kehti ||a-b|| > ||a|| + ||b||
    - ||b+(a-b)+a+(b-a)|| = ||a+b||
    - ||a+b||≤||a||+||b|| $\cdot$
    

Kui me oleme selle tõestanud, siis saame omadust, et võimalik on moodustada kolmnurka kasutada ära järgmistes sammudes. 

*Okei, aga kas on võimalik moodustada äkki mitut sellist kolmnurka? Nii, et a ja b vahel oleks erinevad nurgad*

- Ei, sest kui a ja b vahel oleks mõni muu nurk ning a ja b pikkused oleks samad, siis sellisel juhul oleks kohe a-b pikkus ka erinev.
- On võimalik moodustada võrdelist kolmnurka, kus a ja b vaheline nurk on täpselt sama ning pikkused mingi kordajaga vähendatud/ssuurendatud

Kui oleme defineerinud kolmnurga võimalikuse, siis me defineerimegi a,b,a-b vektorite pikkuste **kiirtega** kolmnurga ja **DEFINEERIME,** et nurk **vektori** a ja b vahel on see sama nurk, mis on, nurk a ja b **kiirte** vahel selles samas kolmnurgas

- *NB, siin eristame kontseptuaalselt vektoreid ja tasandil defineeritud kolmnurga kiiri, aga toome läbi isomorfismi tasandil defineeritud reeglid vektorruumi üle ja defineerime selle läbi nurga.*

Edasi saame kasutada koosinuse reeglit, mis kehtib kolmnurkadel. 

 

> $||a-b||^2 = ||a||^2+||b||^2 - 2||a||||b||\cos(\theta),\text{kus }\theta \text{ on nurk a ja b vahel}$ link
> 

Arvutame selle nüüd lahti

$(a-b)\cdot(a-b) = a\cdot a + b\cdot  b - 2||a||||b||cos(\theta)$

$a\cdot a -2a\cdot b +  b\cdot  b = a\cdot a + b\cdot  b - 2||a||||b||cos(\theta)$

$(a\cdot b)  =  ||a||||b||cos(\theta)$

$\frac{(a\cdot b)}{||a||||b||}  =  cos(\theta)$ ⇒ a ja b vahelise nurga koosinus

if a=cb and c>0 ⇒ $cos(\theta)=1$  ⇒ $\theta=0\degree$ 

if a=cb and c<0 ⇒  $cos(\theta)=-1$  ⇒ $\theta=180\degree$

!Untitled

 

Proof: Angle Between Two Vectors (youtube.com)

# **MIKS ON NURK SEOTUD SIINUSE VÕI KOOSINUSEGA?**

1. Kui me võtame ringi, siis olenemata ringi suurusest on ringi ümbermõõdu ja diameetri vaheline jagatis $\pi$
2. Me saame sarnast asja teha täisnurkse kolmnurga puhul. Kui me võtame täisnurkse kolmnurga, siis on olenemata kolmnurga suurusest nurga $\theta$ siinus $\frac{opposite}{hypothenus}$koosinus = $\frac{adjacent}{opposite}$ sama kõikide täisnurksete kolmnurkade $\theta$ puhul . See on loogiline, sest, kui meil on täisnurkne kolmnurk, mille üks külg on $\theta$ ja teine külg on 90 $\degree$, siis kolmas külg on alati $180\degree-90\degree-\theta\degree$ ja teiste samade nurkadega kolmnurk on lihtsalt kolmnurk, kus iga külg on mingi korrutis eelnevast kolmnurgast. S.t suhted külgede vahel jäävad samaks. S.t ka koosinused jms asjad jäävad samask.  SARNASED KOLMNURGAD JA SARNASUSE TUNNUSED - Matemaatika - 9. klass | TaskuTark

**Selle järgi on meil siis tekkinud mäping $\theta$ maailmast $\sin$ ja $\cos$ väärtustesse ja täisnurkse kolmnurga loogikast ka tagasi.** 

Kristoga tuli jutuks, et seda funktsiooni cos v sinus saab üles ehitada näiteks kuidagi Taylori rea abil .. S.t kui meil on kahe vektori vaheline koosinus defineeritud, siis me saame sellest tuletada ka nurga $\theta$

# OTHER WAYS TO THINK ABOUT ANGLE

## ANGLE IDEA

Nurk on defineeritud **TASANDIL** kui lõikekoht 2 kiire vahel. Seda mõõdetakse kraadides. See on inimeste poolt kasutusele võetud mõõteühik. Nagu meetrid või jardid.  Nurk on seotud siinuse ja koosinusega ning vastavate täisnurkse kolmnurga vahega. 

Tekib suhe 

$cos(\theta) = \frac{adjacent}{hypothenus} => arcos(cos(\theta))=\theta$ 

 kasutades seda suhet saame defineerida ära ka nurga kahe vektori vahel

### DERIVATION OF ANGLE BETWEEN VECTORS FROM COSINE RULE - ML MATH COURSE

Siin ma rääkisin Kristoga ühe korra ja tuli selline põnev teema, et kui elementaargeomeetrias on defineeritud mingi tasandi, selle peal nurk jms põnevad asjad, siis me teeme selle tasandist isomorfimismie $\R_n$ ruumi ja “avastame” need omadused seal. Allpool oleva ongi seletus, kuidas me kausutades vektorruumis ära pikkust ning koosinusteooreemi, saame me leida 2 vektori vahelise nurga. 

Alloleval pildil defineerime me kahe vektori vahelise nurga

1. Esmalt me kasutame ära seda, et oleme defineerinud vektorite pikkuses. 
2. Sealt edasi saame kasutada ära nüanssi, et meil tekib vektoritest s,r ja r-s kolmnurk
3. Kuivõrd meil on tekkinud kolmnurk, siis saame kasutada ära koosinuse teoreemi - **Siit me kaasame juba mängu koosinuse ja s.t ka nurga.** 

!Untitled

PS: Cosine **rule does not need one angle of the triangle to be 90 degrees**

Here we have as vectors r, s and r-s. We separate these from a, b and c

1. cosine rule $c^2=a^2+b^2 - 2ab*cos(\theta)$
2. $|r-s|^2=|r|^2+|s|^2 -2|r||s|cos\theta$
3. If we transform cosine rule  we get $r \cdot s = |r||s|cos(\theta)$  ⇒ $\frac{r \cdot s}{|r||s|}=cos(\theta)$

# ANGLE PROPERTIES

Based on cosine rules now when  Video to explain this

$\theta=90  \degree => cos(\theta) = 0 => r \cdot s = 0$

$\theta=0  \degree => cos(\theta) = 1 => A \cdot B = |r|*|s|$  (If both vectors are of unit lenth then dot product = 1) 

$\theta=180  \degree => cos(\theta) = -1 => r \cdot s = -|s|*|s|$

# PREREQUISITES FOR ANGLE

## DOT PRODUCT AND LENGTH

V1 PIKKUS = $\sqrt{v_1^2+v_2^2}$ = $\sqrt{v \cdot v}$  , assuming v1 is the multiplier for $e_1$ and v2 is multiplier for $e_2$

Intuitiivselt selgitatakse PIKKUST dot producti kaudu arvutamisel läbi baaside väärtuste kordajate ja Pythagorase teoreemi. St me saame kätte hüpotenuusi

 Pythagorase teoreemi **kehtib ainult siis, kui baasid on ortogonaalsed. PYTHAGORAS PROOF** 

!Untitled

Arutelu StackExchangis siin

ORTHOGONAL/NON ORTHOGONAL SPACE VECTOR NORM/LENGTH 

Üldiselt on pikkus siinkohal võetud kui lihtsalt definitsioon. 

- Length/Pikkus on sama mis magnitude/norm

## CAUCHY SWARCH

!Untitled

Võib 

!Untitled

$|a \cdot b| \leq ||a|| \text{ }||b||$ , Is equal when x = cy

Absolute value of dot product between vector a and b is less or equal than the multiplications of their lengths. 

Intuitively 

!Untitled

15.6: Cauchy-Schwarz Inequality - Engineering LibreTexts/15%3A_Appendix_B-_Hilbert_Spaces_Overview/15.06%3A_Cauchy-Schwarz_Inequality)  — Proves quite well. The proof is algerbaic though. Leverages writing out the dot product.

- Proof of the Cauchy-Schwarz inequality (video) | Khan Academy
- Cauchy Schwarz Inequality | Applications to Problems, and When Equality Occurs (youtube.com)

## TRIANGLE INEQUALITY

||x|| - means lenght of vector

Vector triangle inequality (video) | Khan Academy

$||x+y||\leq||x||+||y||$

!Untitled

- Intuitive through visual interpretation.
- Proof is rather algebraic. Leverages writing out $|| x + y ||^2$ and Cauchy to build the equation
    - Equal only if vectors are goin in same direction

!Untitled

## REMINDER OF COSINE AND SINUS

COS is just a relationship between specific 2 sides in a right angled triangle. 

This rule works on right angle triangles .(one angle is 90 degrees)

$cos(\theta)=\frac{adjacent}{hypothenus}$

$sin(\theta)=\frac{opposite}{hypothenus}$

- More thorough explanation

In this case 

$cos(A)=\frac{b}{c}$

$cos(B)=\frac{a}{c}$

!Untitled

## **COSINE RULE**

This applies to all triangles, not only right triangles.  

!Untitled

 

NB — C is the opposite corner of side c

- Proof of the Law of Cosines - Math Open Referenc  Proof that leverages Pythagoras theorem
- PYTHAGORAS PROOF



# Arccosine

# Understanding the Angle Between Rays and the Arccosine Function

## The Angle Between Two Rays Formula
When determining the angle $\theta$ between two rays (or vectors) $\mathbf{a}$ and $\mathbf{b}$ starting from the exact same point (like a camera's pinhole), we use the vector dot product formula:

$$
\theta = \arccos\left(\frac{\mathbf{a} \cdot \mathbf{b}}{\|\mathbf{a}\| \|\mathbf{b}\|}\right)
$$

### Breakdown of the Formula:
1. **The Denominator ($\|\mathbf{a}\| \|\mathbf{b}\|$):** This represents the lengths (magnitudes) of the two vectors. Dividing the top part by these lengths "normalizes" the vectors so they both have a length of exactly $1$. This ensures we are only comparing their *directions*, not how long they are.
2. **The Dot Product ($\mathbf{a} \cdot \mathbf{b}$):** This is a mathematical way of measuring how "aligned" the two directions are:
   - $1$ if they point in the exact same direction.
   - $0$ if they are exactly perpendicular ($90^\circ$ apart).
   - $-1$ if they point in exactly opposite directions.
3. **The Cosine Relationship:** It is a fundamental law in geometry that the dot product of two normalized vectors is exactly equal to the cosine of the angle between them: $\cos(\theta) = \text{alignment ratio}$.
4. **The Inverse Cosine ($\arccos$):** This function goes backward. It asks, "If the cosine of an angle is this number, what is the angle?" to extract the exact angle $\theta$ in radians.

---

## What is the Arccosine ($\arccos$) Function?
While it may seem like a formal "magic button" on a calculator, $\arccos$ is a strictly defined mathematical function.

### 1. The "Reverse" Function
At its core, $\arccos$ is defined purely as the inverse of the $\cos$ function. 
- **Domain (input):** Strictly between $-1$ and $1$.
- **Range (output):** Exactly between $0$ and $\pi$ radians ($0^\circ$ to $180^\circ$).

### 2. Calculus Definition (Integral)
If you want to look under the hood to see how it's structurally defined without referencing the cosine function, it is defined in calculus as the area under a specific curve:
$$
\arccos(x) = \int_{x}^{1} \frac{1}{\sqrt{1 - t^2}} dt
$$
This tells a computer or mathematician exactly how to calculate it from scratch without a geometry cheat sheet.

### 3. Infinite Series (How Computers Calculate It)
It does not have a simple algebra formula like $3x + 2$. It is a "transcendental" function. When your computer or calculator computes $\arccos(x)$, it actually approximates it using an infinite series (adding up smaller and smaller fractions):
$$
\arccos(x) = \frac{\pi}{2} - \left( x + \frac{1}{2}\frac{x^3}{3} + \frac{1 \cdot 3}{2 \cdot 4}\frac{x^5}{5} + \frac{1 \cdot 3 \cdot 5}{2 \cdot 4 \cdot 6}\frac{x^7}{7} + \dots \right)
$$
