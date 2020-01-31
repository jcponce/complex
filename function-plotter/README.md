## Complex Function Plotter 
#### [Live Demo](http://jcponce.github.io/complex/function-plotter/)

A WebGL-based complex expression parser and plotter. 

This project was forked from the amazing work of [Brandon Pelfrey](https://github.com/brandonpelfrey/complex-function-plot). In this version I added a few extra complex functions and used textures that I designed. I was also able to implement the domain coloring method (HSV scheme) with level curves of modulus and phase. Finally, I had to change the code for accessing the webcam since it was not working in the previous version.

## What is this?

This tool allows you to visualize, in real-time, in a browser, how complex functions distort the complex plane, like in the [Conformal Mapping](http://mathworld.wolfram.com/ConformalMapping.html) entry from Wolfram Mathworld.

The rendered image is created by evaluating the user-supplied function and then using the results of that function to look up a color in an image which is infinitely tiled over the [Complex Plane](http://mathworld.wolfram.com/ComplexPlane.html). By changing the expression in the input field, you can visualize how various functions distort the plane.

![Plotter Screenshot](https://github.com/jcponce/complex/blob/gh-pages/function-plotter/conformal.jpg)

This tool also allows you to visualize complex functions using the domain coloring method with the HSV scheme, including level curves of modulus and phase. Thus you can visualize zeros and singularities.

![Plotter Screenshot](https://github.com/jcponce/complex/blob/gh-pages/function-plotter/domain-coloring.jpg)

## Basic arithmetic operators, constants and parameters

* Basic arithmetic operators -- "+  -  *  /" for combining various complex numbers
* Constants -- "<a,b>" for defining a complex number (a,b) from two real-values.
* Pre-Defined Constants -- "pi, e, a, b" for using common constants. The constants "a" and "b" will take on the value of the real and complex part of the point in the complex plane.
* Animated Parameter -- "t" can be used in place of a real value to provide some animation to your plot. It slowly oscillates between -1 and 1.

## Available functions

In this version I added a few extra complex functions. 

* Trigonometric functions --- "sin, cos, tan, csc, sec, cot".
* Hyperbolic trigonometric functions --- "sinh, cosh, tanh, csch, sech, coth".
* The conjugate --- "conj".
* The absolute value, also known as modulus --- "abs".
* Complex power --- "^".
* Complex logarithm --- "log".
* Real and Imaginary components --- "re, im".

## Some examples

* [Fluid around cilinder](https://jcponce.github.io/complex/function-plotter/?expression=eiAqICgxIC0gKHQrMSkvMikgKyAodCsxKS8yICogKHorMS96KQ==)
  * [Real component](https://jcponce.github.io/complex/function-plotter/?expression=cmUoKHorMS96KSApKiAodCsxKS8yICsgcmUoeikgKiAoMSAtICh0KzEpLzIp)
  * [Imaginary component](https://jcponce.github.io/complex/function-plotter/?expression=aW0oKHorMS96KSApKiAodCsxKS8yICsgaW0oeikgKiAoMSAtICh0KzEpLzIp)
* [Disk with a rotating tile](https://jcponce.github.io/complex/function-plotter/?expression=KHogKiAwLjk5ICsgMC4wMSAqICgoMSAtIHpeKDE4KSkgKiB6XjIpICkgKiAoMSArIGkgKiB0KQ==)
* [Bending reality](https://jcponce.github.io/complex/function-plotter/?expression=ZV4oaSAqIDAuNSAqICh6IC0gMyppKSArIGxvZyh6IC0gMyppKSkgKiAodCsxKS8yICsgeiAqICgxIC0gKHQrMSkvMik=)
* [Vortex within a circle](https://jcponce.github.io/complex/function-plotter/?expression=KHogKiAzKS8yICogZV4odCAqIHBpICogaSAqIGVeKCAtMSAqIGFicyggKHoqMykvMiApXjIgKSk=)
* [Waves](https://jcponce.github.io/complex/function-plotter/?expression=ZV4oaSAqICgxLjUgKiByKV41KSArIHQ=)
* [Potential](https://jcponce.github.io/complex/function-plotter/?expression=KGxvZygoei0xKS8oeisxKSkpICogKHQrMSkvMiArIHogKiAoMSAtICh0KzEpLzIp)
* [Domain coloring Example 1](https://jcponce.github.io/complex/function-plotter/hsv.htm?expression=c2luKHogKyB0KQ==)
* [Domain coloring Example 2](https://jcponce.github.io/complex/function-plotter/hsv.htm?expression=eiAqIHQgKyAxL3Npbih6KQ==)

## How does it work?
#### This tool runs in real-time thanks to a few other libraries.

* Expressions given by the user are parsed using the [PEG.js](https://pegjs.org/) library along with a grammar written specifically for this plotter that encapsulates complex-valued arithmetic and functions. The grammar is fed to PEG.js which produces a parser, and that parser is then used to transform mathematical expressions into a WebGL-compatible snippet of code. The generated code is placed into a WebGL shader template and compiled to give a new rendering based on the expression supplied by the user. All of this happens ~instantly, even on a phone.
* [THREE.js](https://threejs.org/) is used to set up the full-window Quad, manage GLSL uniforms, shader compilation, etc. (Basically all the boilerplate display logic).
* jQuery is used for some very minor setup logic (could be easily removed...)



