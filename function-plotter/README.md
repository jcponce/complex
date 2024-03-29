## Complex Function Plotter 

A WebGL-based complex expression parser and plotter. 

This project was forked from the amazing work of [Brandon Pelfrey](https://github.com/brandonpelfrey/complex-function-plot). In this version I re-wrote the syntax for the arithmetic of complex numbers and added extra complex functions. It also has new textures that I designed and I was also able to implement the method of domain coloring (HSV scheme). Finally, I had to change the code for accessing the webcam since it was not working in the previous version.

## What is this?

### Conformal mapping

This tool allows you to visualize, in real-time, in a browser, how complex functions distort the complex plane, like in the [Conformal Mapping](http://mathworld.wolfram.com/ConformalMapping.html) entry from Wolfram Mathworld. 

The rendered image is created by evaluating the user-supplied function and then using the results of that function to look up a color in an image which is infinitely tiled over the [Complex Plane](http://mathworld.wolfram.com/ComplexPlane.html). By changing the expression in the input field, you can visualize how various functions distort the plane.

<img src="https://github.com/jcponce/complex/blob/gh-pages/function-plotter/conformal.png" width="65%">

#### [Live Demo - Conformal Mapping](http://jcponce.github.io/complex/function-plotter/)

### Domain coloring

You can also visualize complex functions plotted with the domain coloring method using the HSV scheme, including level curves of modulus and phase. Thus you can visualize zeros and singularities.

<img src="https://github.com/jcponce/complex/blob/gh-pages/function-plotter/hsv.png" width="65%">

#### [Live Demo - Domain coloring](http://jcponce.github.io/complex/function-plotter/hsv.htm)

## Basic arithmetic operators, constants and parameters

* Basic arithmetic operators: "+",  "-",  "*",  "/" for combining various complex numbers
* Constants: "<a,b>" for defining a complex number (a,b) from two real-values.
* Pre-Defined Constants: "pi, e, phi, x, y" for using common constants. The constants "x" and "y" will take on the value of the real and complex part of the point in the complex plane.
* Animated Parameters: 
  * "t" can be used in place of a real value to provide some animation to your plot. It slowly oscillates between -1 and 1.
  * "s" is a real value chaging at a constant rate over time. It will be reset every time you update the expression in the input.

## Available functions

* Trigonometric functions --- "sin, cos, tan, csc, sec, cot".
* Hyperbolic trigonometric functions --- "sinh, cosh, tanh, csch, sech, coth".
* The conjugate --- "conj".
* The absolute value, also known as modulus --- "abs, |z|".
* Complex power --- "^".
* Complex logarithm --- "log".
* Complex exponential --- "exp".
* Real and Imaginary components --- "re, im".
* Gamma function --- "gamma"
* Riemann zeta function --- "zeta"
* Joukowsky function --- "joukowsky( variable z, center: a+b*i, radius: real number)"

#### Examples

* [z * (1-z)](https://www.dynamicmath.xyz/complex/function-plotter/index.htm?expression=eiAqICgxLXop)
* [1/z + i * z^(1/2)](https://www.dynamicmath.xyz/complex/function-plotter/index.htm?expression=MS96K2kqel4oMS8yKQ==)
* [z + pi * log(z + e)](https://www.dynamicmath.xyz/complex/function-plotter/index.htm?expression=eiArIHBpICogbG9nKHogKyBlKQ==)
* [e^z + t](https://www.dynamicmath.xyz/complex/function-plotter/index.htm?expression=ZV56ICsgdA==)
* [s * i + s - 0.09 * (z - 6)^2](https://www.dynamicmath.xyz/complex/function-plotter/index.htm?expression=s*i+s-0.09*(z-6)^2)
* [sin(z + pi)/tanh(z^2 - i) + t](https://www.dynamicmath.xyz/complex/function-plotter/hsv.htm?expression=cyAqIGkgKyBzIC0gMC4wOSAqICh6IC0gNileMg==)

## Some interesting examples about conformal mapping

* [Fluid around cylinder](https://www.dynamicmath.xyz/complex/function-plotter/?expression=eiooMS0odCsxKS8yKSsodCsxKS8yKih6KzEveik=)
  * [Real component](https://www.dynamicmath.xyz/complex/function-plotter/?expression=cmUoKHorMS96KSkqKHQrMSkvMityZSh6KSooMS0odCsxKS8yKQ==)
  * [Imaginary component](https://www.dynamicmath.xyz/complex/function-plotter/?expression=aW0oKHorMS96KSkqKHQrMSkvMitpbSh6KSooMS0odCsxKS8yKQ==)
* [Disk with a rotating tile](https://www.dynamicmath.xyz/complex/function-plotter/?expression=KHoqMC45OSswLjAxKigoMS16XigxOCkpKnpeMikpKigxK2kqdCk=)
* [Bending reality](https://www.dynamicmath.xyz/complex/function-plotter/?expression=ZV4oaSowLjUqKHotMyppKStsb2coei0zKmkpKSoodCsxKS8yK3oqKDEtKHQrMSkvMik=)
* [Vortex within a circle](https://www.dynamicmath.xyz/complex/function-plotter/?expression=KHoqMykvMiplXih0KnBpKmkqZV4oLTEqYWJzKCh6KjMpLzIpXjIpKQ==)
* [Waves](https://www.dynamicmath.xyz/complex/function-plotter/?expression=ZV4oaSooMS41KnIpXjUpK3Q=)
* [Potential](https://www.dynamicmath.xyz/complex/function-plotter/?expression=KGxvZygoei0xKS8oeisxKSkpKih0KzEpLzIreiooMS0odCsxKS8yKQ==)
* [Transform the unit circle to the UHP](https://www.dynamicmath.xyz/complex/function-plotter/?expression=dHJhbnNmb3JtKHosKHotaSkvKHoraSksdCkqZGlzayh0cmFuc2Zvcm0oeiwoei1pKS8oeitpKSx0KSk=)
* [Joukowsky airfoil](https://www.dynamicmath.xyz/complex/function-plotter/?expression=am91a293c2t5KHosLTAuMTUrMC4yMyppLDEuMTcp)
* [Loxodromic](https://www.dynamicmath.xyz/complex/function-plotter/?expression=KCgwLjI1NSswLjc2MyppKSpsb2coKHotMSkvKHorMSkpKStz)

## Examples about domain coloring

* Analytic functions:
  * [sin(z + t)](https://www.dynamicmath.xyz/complex/function-plotter/hsv.htm?expression=c2luKHordCk=)
  * [z * t + 1/sin(z)](https://www.dynamicmath.xyz/complex/function-plotter/hsv.htm?expression=eip0KzEvc2luKHop)
  * [z^(10 * (t + 1)/2 + 2) - 1](https://www.dynamicmath.xyz/complex/function-plotter/hsv.htm?expression=el4oMTAqKHQrMSkvMisyKS0x)
  * [(z-1)/(z^2+z+1) * (t+1)/2 + z * ( 1- (t+1)/2 )](https://www.dynamicmath.xyz/complex/function-plotter/hsv.htm?expression=KHotMSkvKHpeMit6KzEpKih0KzEpLzIreiooMS0odCsxKS8yKQ==)
* Non-Analytic functions:
  * [(z+1) * conj(z)](https://www.dynamicmath.xyz/complex/function-plotter/hsv.htm?expression=KHorMSkqY29uaih6KQ==)
  * [conj(z) * (t+1)/2 + cos(z * ( 1- (t+1)/2 ))](https://www.dynamicmath.xyz/complex/function-plotter/hsv.htm?expression=Y29uaih6KSoodCsxKS8yK2Nvcyh6KigxLSh0KzEpLzIpKQ==)


## How does it work?
#### This tool runs in real-time thanks to a few other libraries.

* Expressions given by the user are parsed using the [PEG.js](https://pegjs.org/) library along with a grammar written specifically for this plotter that encapsulates complex-valued arithmetic and functions. The grammar is fed to PEG.js which produces a parser, and that parser is then used to transform mathematical expressions into a WebGL-compatible snippet of code. The generated code is placed into a WebGL shader template and compiled to give a new rendering based on the expression supplied by the user. All of this happens instantly, even on a phone.
* [THREE.js](https://threejs.org/) is used to set up the full-window Quad, manage GLSL uniforms, shader compilation, etc. (Basically all the boilerplate display logic).
* jQuery is used for some very minor setup logic (could be easily removed...)

## License

This content is under the license [Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)](https://creativecommons.org/licenses/by-nc-sa/4.0/)

## Thanks!
I learned a lot working on this project. I hope you liked it too. 

Please [let me know](https://twitter.com/jcponcemath) what you think.

Have fun!
