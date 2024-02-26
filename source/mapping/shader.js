/*
  Author: David Block
  Soruce: https://replit.com/@DavidBrock1/complexplotter#shader.js
*/

var uniforms = {
  offset:           {value: new THREE.Vector2()},
  scale:            {value: 1},
  c:                {value: new THREE.Vector2()},
  width:            {value: 5},
  plotHeight:       {value: 1}, //Height option
  plotColor:        {value: 1}, //Color option
  plotSaturation:   {value: 0.67},
  grid:             {value: null},
};

function compileMaterial(expr, type) {
  var scope = {};

  if (expr.split("\n").length > 1) {
    throw new Error("Only one equation is currently supported.");
  }

  var calculation = `
//Compiled code ---------------
/* ${expr} */

${GLcompile(expr, scope)}
//End of compiled code---------`;

  if (!scope.functions.includes("f1")) {
    throw new Error("Code must define a function named 'f' with one argument");
  }

  console.log(calculation);

  var vShader, fShader;

  if (type == "plot") {
    vShader = plotVertexShader.replace("/*{Calculation}*/", calculation);
    fShader = plotFragmentShader.replace("/*{Calculation}*/", calculation);
  } else {
    vShader = conformalVertexShader.replace("/*{Calculation}*/", calculation);
    fShader = conformalFragmentShader.replace("/*{Calculation}*/", calculation);
  }

  return new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: vShader,
    fragmentShader: fShader,
    side: THREE.DoubleSide,
    transparent: true,
    depthWrite: true,
  });
}

var plotVertexShader = `
uniform vec2 offset;
uniform float scale;
uniform float plotHeight;
uniform float plotColor;
uniform float width;
varying vec3 vUv;
varying float discardTri;

${commonShaderCode}

/*{Calculation}*/

void main() {
  vec3 vertex = position;

  //calculate point
  vec2 z = vertex.xy * scale + offset;
  vec2 w = f_C(z);
  
  
  if (plotHeight == 1.0) vertex.z = abs_C(w).x / scale;
  else if (plotHeight == 2.0) vertex.z = re_C(w).x / scale;
  else if (plotHeight == 3.0) vertex.z = im_C(w).x / scale;
  else if (plotHeight == 4.0) vertex.z = -0.1;

  vUv = vertex;

  if (abs(vertex.z) < width * 1.0e+3) discardTri = 0.0;
  else discardTri = 1.0;

  vec4 modelViewPosition = modelViewMatrix * vec4(vertex, 1.0);
  gl_Position = projectionMatrix * modelViewPosition; 
}
`;

var plotFragmentShader = `
uniform vec2 offset;
uniform float scale;
uniform float plotHeight;
uniform float plotColor;
uniform float plotSaturation;
uniform float width;
varying vec3 vUv;
varying float discardTri;

${commonShaderCode}

vec3 hsl2rgb(in vec3 c) {
  vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0, 0.0, 1.0);
  return c.z + c.y * (rgb-0.5)*(1.0-abs(2.0*c.z-1.0));
}

/*{Calculation}*/

void main() {
  //calculate point
  vec2 z = vUv.xy * scale + offset;
  vec2 w = f_C(z);

  if (abs(vUv.z) > width || discardTri > 0.0) discard;

  if (w.x != w.x || w.y != w.y || abs(w.x) > 1.0e+38 || abs(w.y) > 1.0e+38) discard;

  if (plotColor == 1.0) {
    vec2 polar = polar_C(w);
    float hue = polar.y / 2.0 / pi.x;
    float light = min(1.0 - pow(max(1.0 - plotSaturation, 0.0), polar.x / scale), 1.0);
    gl_FragColor = vec4(hsl2rgb(vec3(hue, 1.0, light)), 1.0);

  } else if (plotColor == 2.0) {
    vec2 polar = polar_C(w);
    float hue = polar.y / 2.0 / pi.x;
    float light = 0.5;
    gl_FragColor = vec4(hsl2rgb(vec3(hue, 1.0, light)), 1.0);

  } else if (plotColor == 3.0) {
    vec2 polar = polar_C(w);
    float hue = 0.0;
    float light = min(1.0 - pow(max(1.0 - plotSaturation, 0.0), polar.x / scale), 1.0);
    gl_FragColor = vec4(hsl2rgb(vec3(hue, 1.0, light)), 1.0);

  } else {
    gl_FragColor = vec4(0.22, 0.55, 0.27, 1.0); //Desmos green
  }
}
`;

var conformalVertexShader = `
uniform vec2 offset;
uniform float scale;
uniform float width;
varying vec3 vUv;

${commonShaderCode}

/*{Calculation}*/

void main() {
  vec3 vertex = position;
  vUv = vertex;

  //calculate point
  vec2 z = vUv.xy;
  vec2 w = f_C(z);

  vertex.xy = (w - offset) / scale;
  
  vec4 modelViewPosition = modelViewMatrix * vec4(vertex, 1.0);
  gl_Position = projectionMatrix * modelViewPosition; 
}
`;

var conformalFragmentShader = `
uniform float width;
uniform sampler2D grid;
varying vec3 vUv;

/*{Calculation}*/

void main() {
  gl_FragColor = texture2D(grid, vUv.xy / width / 2.0 + 0.5);
}
`;