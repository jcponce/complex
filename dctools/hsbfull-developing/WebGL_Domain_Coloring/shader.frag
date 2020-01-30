// casey conchinha - @kcconch ( https://github.com/kcconch )
// louise lessel - @louiselessel ( https://github.com/louiselessel )
// more p5.js + shader examples: https://itp-xstory.github.io/p5js-shaders/

#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265358979323846

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;

// this is the same variable we declared in the vertex shader
// we need to declare it here too!
varying vec2 vTexCoord;

void main() {
  
  // normalized mouse coordinates
  vec2 n_mouse = u_mouse / u_resolution;
  
  // oscillator
  vec2 osc = vec2((cos(u_time)+1.0)/2.0,(sin(u_time)+1.0)/2.0);

  // copy the vTexCoord
  // vTexCoord is a value that goes from 0.0 - 1.0 depending on the pixels location
  // we can use it to access every pixel on the screen
  vec2 coord = vTexCoord;
  
  // x values for red, y values for green, both for blue
  vec3 color = vec3(coord.x*osc.x, coord.y*osc.y*n_mouse.y, coord.x*osc.x*n_mouse.x);
  
  gl_FragColor = vec4(color, 1.0 );
}