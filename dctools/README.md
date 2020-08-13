# Domain coloring plotting tools

Hi! Welcome. Here are the sketches about domain coloring for visualizing complex functions with JavaScript.

#### [Click here to see all demos](https://jcponce.github.io/domain-coloring/)

<img src="https://github.com/jcponce/complex/blob/gh-pages/dctools/plotfz.png" width="50%">

---

# Introduction
            
Domain coloring is a method that allows us to represent complex functions by assigning a color
to each point of the complex plane. The method involves basically two main ideas:

1. Assign a color to every point in the complex plane.
2. Color the domain of f by painting the location z with the color determined by the value f(z).

It is common to use the color wheel because it is easy to match the HUE values with the phase (argument) of a complex number z which is usually defined in the interval [0,2\pi), or (-\pi, \pi].

<img src="https://raw.githubusercontent.com/jcponce/jcponce.github.io/master/domain-coloring/img/wheel.svg" width="35%">

To implement this method in the computer consider a rectangular region of pixels on
the screen. This will be a discretized domain D_h for the function f. Every pixel i is
identified with a complex number z_i where f is evaluated. Then calculate
the phase of the value f(z) and its corresponding color. Finally assign the resulting
color to that pixel. This procedure is shown in the animation below.

![Color Wheel](https://raw.githubusercontent.com/jcponce/jcponce.github.io/master/domain-coloring/img/diagram.gif)

---

# Basic set up

In this project I used [p5.js](https://p5js.org/). At the begining I had only one function for plotting one color scheme but later I realized that it was better to have a class to include other color schemes: 

* [domainColoring class](https://github.com/jcponce/complex/blob/gh-pages/dctools/libraries/domainColoring.js)

This class also requieres a complex function parser and the library for the HSLuv color scheme.

* [Complex parser](https://github.com/jcponce/complex/blob/gh-pages/dctools/libraries/Complex.min.js)
* [HSLuv](https://github.com/jcponce/complex/blob/gh-pages/dctools/libraries/hsluvmin.js)

To set it up in p5.js you must include in the index file the class and the other two libraries, including your sketch file:

    <script src="hsluvmin.js"></script>
    <script src="Complex.min.js"></script>
    <script src="domainColoring.js"></script>
    <script src="sketch.js"></script>
    
In the sketch file define within the setup function the class 'domanColoring(func, size)' with two parameters:
- func: a complex function (as a string) e.g. 'z^2',
- size: a real number > 0 e.g. 6.

Thus we have

    let domC; 
    let fn = 'z^2'; // Change this function
    let s = 6; // Change this size
    function setup() {
      // It looks better when the canvas is a square, min 400x400
      createCanvas(500, 500);
      pixelDensity(1);
  
      // Domain coloring setting
      domC = new domainColoring(fn, s); 
    }
        
Now we just need to plot it using one of the following options defined within our class:

- plotHSV(opt)
  - opt: 'Phase', 'Modulus', 'Phase/Modulus', 'None'
- plotHSVDisc(opt)
  - opt: 'Phase', 'Modulus', 'Phase/Modulus', 'None'
- plotHSL(opt)
  - opt: 'Phase', 'Modulus', 'Phase/Modulus', 'Standard', 'None'
- plotRGB(opt)
  - opt: 'Phase', 'Modulus', 'Phase/Modulus', 'None'
- plotHSVReIm(opt)
  - opt: 'Real', 'Imaginary', 'Re/Im', 'Modulus', 'All', 'None'
- plotHSLuv(opt, minHue, maxHue)
  - opt: 'Phase', 'Modulus', 'Phase/Modulus', 'None'
  - minHue: 0
  - maxHue: 1
- plotBW(opt),
   - opt: 'Phase', 'Modulus', 'Phase/Modulus', 'Real', 'Imaginary', 'Re/Im'
- plotHSVG()   

For example, let's use plotHSV(opt):

    function draw() {
      domC.plotHSV('Modulus');
    }

#### Result

<img src="https://github.com/jcponce/complex/blob/gh-pages/dctools/demo-basic.png" width="40%">

Check the live demo [HERE](https://editor.p5js.org/jcponce/sketches/sfoT8EUys)

## About the HSV (or HSB) color scheme

The method I used for the HSV (or HSB) color scheme is based on [Elias Wegert](http://www.visual.wegert.com/)'s work from his book [Visual Complex Functions.](http://www.springer.com/de/book/9783034801799) He basically employs phase portraits with contour lines of phase and modulus, *enhanced phase portraits*, for the study of the theory of complex functions. I also added extra color schemes to explore different ways to visualize complex functions. In particular, I used some of the equations discussed in the *MATHEMATICA &amp; Wolfram Language* section from the *Stack Exchange* site:

[How can I generate this “domain coloring” plot?](https://mathematica.stackexchange.com/questions/7275/how-can-i-generate-this-domain-coloring-plot)

### Other amazing projects

I have been inspired for so many people sharing their work on this topic. The following are similar projects, or online plotters, using other programming languages: 

* [Complex Color Map](https://github.com/endolith/complex_colormap) (Python)
* [C-plot](https://github.com/nschloe/cplot) (Python by Nico Schlömer)
* [Domain Coloring](https://github.com/fogleman/domaincoloring) (by Michael Fogleman)
* [The Complex Grapher](https://talbrenev.com/complexgrapher/) (JavaScript)
* [Complex Function Grapher](http://jutanium.github.io/ComplexNumberGrapher/) (Math.js by Dan Jutan)
* [Conformal Map Viewer](http://davidbau.com/archives/2013/02/10/conformal_map_viewer.html) (JavaScript by David Bau)
* [Exploring complex functions](https://cindyjs.org/gallery/cindygl/ComplexExplorer/index.html) (Cindy.JS)
* [Complex Function Explorer](https://au.mathworks.com/matlabcentral/fileexchange/45464-complex-function-explorer) (MATLAB)
* [Complex function plotter](https://people.ucsc.edu/~wbolden/complex/) (Shader by Will Bolden)
* [Complex function plotter](https://samuelj.li/complex-function-plotter/) (Shader by Samuel J. Li)

Visit the site [Domain coloring](https://jcponce.github.io/domain-coloring) to play with the different tools I made or if you prefer you can visit the [Domain Coloring Gallery](https://jcponce.github.io/domain-coloring/dcgallery.html).

I also recommend you the following galleries:

* [Phase Plot Gallery](http://www.mathe.tu-freiberg.de/~wegert/PhasePlot/images.html)
* [Gallery of Complex Functions](https://vqm.uni-graz.at/pages/complex/index.html)

---

# More about the complex function parser

This library was inspired by [David Bau's work](http://davidbau.com/). It defines the basic arithmetic of complex numbers and contains a wide range of complex functions.

## Available functions

* Trigonometric functions --- "sin, cos, tan, csc, sec, cot, arcsin, arccos, arctan, arccsc, arcsec, arccot".
  * E.g. sin(z)
* Hyperbolic trigonometric functions --- "sinh, cosh, tanh, csch, sech, coth, arcsinh, arccosh, arctanh, arccsch, arcsech, arccoth".
  * E.g. sinh(z)
* The conjugate --- "conj".
  * E.g. conj(z)
* The absolute value, also known as modulus --- "abs", "||".
  E.g abs(z), |z|
* Complex power --- "^, exp".
  * E.g. z^2, exp(z), e^z
* Complex logarithm --- "log".
  * log(z)
* Real and Imaginary components --- "re, im".
  * E.g. re(z), im(z)
* [Jacobi Elliptic](https://en.wikipedia.org/wiki/Jacobi_elliptic_functions) --- "sn( expr, parameter [0,1]), cn( expr, parameter [0,1]), dn( expr, parameter [0,1])".
  * E.g. sn(z, 0.3)
* [Gamma function](https://en.wikipedia.org/wiki/Gamma_function) --- "gamma( expr )".
  * E.g. sn(z, 0.3)
* [Finite Blaschke product](https://en.wikipedia.org/wiki/Blaschke_product) --- "blaschke( expr, positive integer )"
  * E.g. blaschke(z, 20)
* [Binet's Formula](https://mathworld.wolfram.com/BinetsFibonacciNumberFormula.html) ---"binet( expr )" 
  * E.g. binet(z)
* Sum series function--- "sum( expr, positive integer)".
  * E.g. sum((-1)^n*z^(2n)/(2n)!, 7)
* Multiplicative function --- "prod( expr, positive integer)".
  * E.g. prod(e^((z+(e^(2*pi*i/5))^n )/(z-(e^(2*pi*i/5))^n)), 5)
* Iterated function --- "iter( expr, variable positive integer)".
  * E.g. iter(z+z'^2,z,15)

---

# Updates

July 2018: Version 1. First time online.

Feb-2019: Added Complex arithmetic and functions library.

May-2019: Added more color schemes.

Sep-2019: I was able to work out how to add a parser for complex functions thanks to [David Bau's work](http://davidbau.com/). Now you can easily input a function such as 'f(z)=z^2+cos(z)'. Version 1.5.

Nov-2019: Version 2. Added a new input box to enter the functions. It looks better 😃. I also added a new color scheme and the Finite Blaschke product with randomly distributed points.

May-2020: I added sliders to define three parameters. t:[0,1], s:[0,2pi] defining the complex number u:=exp(i*s), and n:[0,30] an integer.

Jul-2020: Fixed issue with power function and added Binet's formula. I also added an alert message in case there is something wrong in the input 😃.

Aug-2020: Version 3. New updates comming soon! Refactored code and defined class to plot all color schemes.

---

# LICENSE  
This code is under a [Creative Commons Attribution, Non-Commercial, Share-Alike license](https://creativecommons.org/licenses/by-nc-sa/4.0/).
