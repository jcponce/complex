# Domain coloring plotting tools

Hi! Welcome. Here are the sketches about domain coloring for visualizing complex functions.

![alt tag](https://github.com/jcponce/complex/blob/gh-pages/dctools/plotfz.png)

---

## About the method

The method I used here is based on [Elias Wegert](http://www.visual.wegert.com/)'s work from his book [Visual Complex Functions.](http://www.springer.com/de/book/9783034801799) He basically employs phase portraits with contour lines of phase and modulus, *enhanced phase portraits*, for the study of the theory of complex functions. I also added extra color schemes to explore different ways to visualize complex functions. In particular, I used some of the equations discussed in the *MATHEMATICA &amp; Wolfram Language* section from the *Stack Exchange* site:

[How can I generate this “domain coloring” plot?](https://mathematica.stackexchange.com/questions/7275/how-can-i-generate-this-domain-coloring-plot)

In this project I used [p5.js](https://p5js.org/) but there are similar projects or online plotters using other programming languages: 

* [Complex Color Map](https://github.com/endolith/complex_colormap) (Python)
* [C-plot](https://github.com/nschloe/cplot) (Python)
* [Domain Coloring](https://github.com/fogleman/domaincoloring)
* [The Complex Grapher](https://talbrenev.com/complexgrapher/) (JavaScript)
* [Complex Function Grapher](http://jutanium.github.io/ComplexNumberGrapher/) (Math.js)
* [Conformal Map Viewer](http://davidbau.com/archives/2013/02/10/conformal_map_viewer.html) (JavaScript)
* [Exploring complex function](https://cindyjs.org/gallery/cindygl/ComplexExplorer/index.html) (Cindy.JS)
* [Complex Function Explorer](https://cindyjs.org/gallery/cindygl/ComplexExplorer/index.html) (MATLAB)

Visit the site [Domain coloring](https://jcponce.github.io/domain-coloring) to play with the different tools I made or if you prefer you can visit the [Domain Coloring Gallery](https://www.dynamicmath.xyz/domain-coloring/dcgallery.html).

I also recommend you the following galleries:

* [Phase Plot Gallery](http://www.mathe.tu-freiberg.de/~wegert/PhasePlot/images.html)
* [Gallery of Complex Functions](https://vqm.uni-graz.at/pages/complex/index.html)

---

## Available functions

* Trigonometric functions --- "sin, cos, tan, csc, sec, cot, arcsin, arccos, arctan, arccsc, arcsec, arccot".
* Hyperbolic trigonometric functions --- "sinh, cosh, tanh, csch, sech, coth, arcsinh, arccosh, arctanh, arccsch, arcsech, arccoth".
* The conjugate --- "conj".
* The absolute value, also known as modulus --- "abs".
* Complex power --- "^, exp".
* Complex logarithm --- "log".
* Real and Imaginary components --- "re, im".
* Jacobi Elliptic --- "sn( expr, parameter [0,1]), cn( expr, parameter [0,1]), dn( expr, parameter [0,1])". 
* Gamma function --- "gamma".
* Sum series function--- "sum( expr, positive integer)".
* Multiplicative function --- "multIter( expr, positive integer)".
* Iterated function --- "iter( expr, variable positive integer)".

---

#### Updates

Feb-2019: Added Complex arithmetic and functions library.

May-2019: Added more color schemes.

Sep-2019: I was able to work out how to add a parser for complex functions thanks to [David Bau's work](http://davidbau.com/). Now you can easily input a function such as 'f(z)=z^2+cos(z)'. 

Nov-2019: Added a new input box to enter the functions. It looks better :). Also added a new color scheme.

---

#### LICENSE  
This code is under a [Creative Commons Attribution, Non-Commercial, Share-Alike license](https://creativecommons.org/licenses/by-nc-sa/4.0/).
