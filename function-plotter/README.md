![Plotter Screenshot](https://github.com/jcponce/complex/blob/gh-pages/function-plotter/reim.png)

## Complex Function Plotter 
#### [Live Demo](http://jcponce.github.io/complex/function-plotter/)

A WebGL-based complex expression parser and plotter. This project was forked from the amazing work of [Brandon Pelfrey](https://github.com/brandonpelfrey/complex-function-plot). 


## Available Functions and Variables
I added extra complex functions to explore.

* Basic arithmetic operators -- "+ - * /" for combining various complex numbers
* Functions -- "sin, cos, tan, sinh, cosh, tanh, abs, conj, re, im, log, ^" for computing sine, cosine, tangent, hyperbolic trigonometric functions, the conjugate, real and imaginary components, along with complex power and logarithms
* Constants -- "<a,b>" for defining a complex number (a,b) from two real-values.
* Pre-Defined Constants -- "pi, e, a, b" for using common constants. The constants "a" and "b" will take on the value of the real and complex part of the point in the complex plane.
* "Animated" Parameter -- "t" can be used in place of a real value to provide some animation to your plot. It slowly oscillates between -1 and 1.

## How does it work?
#### This tool runs in real-time thanks to a few other libraries.

* Expressions given by the user are parsed using the [PEG.js](https://pegjs.org/) library along with a grammar written specifically for this plotter that encapsulates complex-valued arithmetic and functions. The grammar is fed to PEG.js which produces a parser, and that parser is then used to transform mathematical expressions into a WebGL-compatible snippet of code. The generated code is placed into a WebGL shader template and compiled to give a new rendering based on the expression supplied by the user. All of this happens ~instantly, even on a phone.
* [THREE.js](https://threejs.org/) is used to set up the full-window Quad, manage GLSL uniforms, shader compilation, etc. (Basically all the boilerplate display logic).
* jQuery is used for some very minor setup logic (could be easily removed...)


Refer to the [instructions in the wiki](https://github.com/brandonpelfrey/complex-function-plot/wiki/Complex-Function-Plotter) for information on usage and background info.

