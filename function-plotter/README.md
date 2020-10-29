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
* Pre-Defined Constants: "pi, e, phi, a, b" for using common constants. The constants "a" and "b" will take on the value of the real and complex part of the point in the complex plane.
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

* [z * (1-z)](https://jcponce.github.io/complex/function-plotter/index.htm?expression=eiAqICgxLXop)
* [1/z + i * z^(1/2)](https://jcponce.github.io/complex/function-plotter/index.htm?expression=MS96ICsgaSAqIHpeKDEvMik=)
* [z + pi * log(z + e)](https://jcponce.github.io/complex/function-plotter/index.htm?expression=eiArIHBpICogbG9nKHogKyBlKQ==)
* [e^z + t](https://jcponce.github.io/complex/function-plotter/index.htm?expression=ZV56ICsgdA==)
* [s * i + s - 0.09 * (z - 6)^2](https://jcponce.github.io/complex/function-plotter/index.htm?expression=cyAqIGkgKyBzIC0gMC4wOSAqICh6IC0gNileMg==)
* [sin(z + pi)/tanh(z^2 - i) + t](https://jcponce.github.io/complex/function-plotter/hsv.htm?expression=c2luKHogKyBwaSkvdGFuaCh6XjIgLSBpKSArIHQ=)

## Some interesting examples about conformal mapping

* [Fluid around cylinder](https://jcponce.github.io/complex/function-plotter/?expression=eiAqICgxIC0gKHQrMSkvMikgKyAodCsxKS8yICogKHorMS96KQ==)
  * [Real component](https://jcponce.github.io/complex/function-plotter/?expression=cmUoKHorMS96KSApKiAodCsxKS8yICsgcmUoeikgKiAoMSAtICh0KzEpLzIp)
  * [Imaginary component](https://jcponce.github.io/complex/function-plotter/?expression=aW0oKHorMS96KSApKiAodCsxKS8yICsgaW0oeikgKiAoMSAtICh0KzEpLzIp)
* [Disk with a rotating tile](https://jcponce.github.io/complex/function-plotter/?expression=KHogKiAwLjk5ICsgMC4wMSAqICgoMSAtIHpeKDE4KSkgKiB6XjIpICkgKiAoMSArIGkgKiB0KQ==)
* [Bending reality](https://jcponce.github.io/complex/function-plotter/?expression=ZV4oaSAqIDAuNSAqICh6IC0gMyppKSArIGxvZyh6IC0gMyppKSkgKiAodCsxKS8yICsgeiAqICgxIC0gKHQrMSkvMik=)
* [Vortex within a circle](https://jcponce.github.io/complex/function-plotter/?expression=KHogKiAzKS8yICogZV4odCAqIHBpICogaSAqIGVeKCAtMSAqIGFicyggKHoqMykvMiApXjIgKSk=)
* [Waves](https://jcponce.github.io/complex/function-plotter/?expression=ZV4oaSAqICgxLjUgKiByKV41KSArIHQ=)
* [Potential](https://jcponce.github.io/complex/function-plotter/?expression=KGxvZygoei0xKS8oeisxKSkpICogKHQrMSkvMiArIHogKiAoMSAtICh0KzEpLzIp)
* [Transform the unit circle to the UHP](https://jcponce.github.io/complex/function-plotter/?expression=dHJhbnNmb3JtKHosICh6LWkpLyh6K2kpLCB0KSAqIGRpc2sodHJhbnNmb3JtKHosICh6LWkpLyh6K2kpLCB0KSk=)
* [Joukowsky airfoil](https://jcponce.github.io/complex/function-plotter/?expression=am91a293c2t5KHosIC0wLjE1KzAuMjMqaSwgMS4xNyk=)

## Examples about domain coloring

* Analytic functions:
  * [sin(z + t)](https://jcponce.github.io/complex/function-plotter/hsv.htm?expression=c2luKHogKyB0KQ==)
  * [z * t + 1/sin(z)](https://jcponce.github.io/complex/function-plotter/hsv.htm?expression=eiAqIHQgKyAxL3Npbih6KQ==)
  * [z^(10 * (t + 1)/2 + 2) - 1](https://jcponce.github.io/complex/function-plotter/hsv.htm?expression=el4oMTAgKiAodCArIDEpLzIgKyAyKSAtIDE=)
  * [(z-1)/(z^2+z+1) * (t+1)/2 + z * ( 1- (t+1)/2 )](https://jcponce.github.io/complex/function-plotter/hsv.htm?expression=KHotMSkvKHpeMit6KzEpICogKHQrMSkvMiArIHogKiAoIDEtICh0KzEpLzIgKQ==)
* Non-Analytic functions:
  * [(z+1) * conj(z)](https://jcponce.github.io/complex/function-plotter/hsv.htm?expression=KHorMSkgKiBjb25qKHop)
  * [conj(z) * (t+1)/2 + cos(z * ( 1- (t+1)/2 ))](https://jcponce.github.io/complex/function-plotter/hsv.htm?expression=Y29uaih6KSAqICh0KzEpLzIgKyBjb3MoeiAqICggMS0gKHQrMSkvMiApKQ==)


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
