var uniforms = {
  offset:           {value: new THREE.Vector2()},
  scale:            {value: 1},
  c_C:              {value: new THREE.Vector2()},
  width:            {value: 5},
  plotHeight:       {value: 1}, //Height option
  plotColor:        {value: 1}, //Color option
  plotSaturation:   {value: 0.67},
  grid:             {value: null},
};

function compileMaterial(expr, type) {
  var scope = {};

  var variables = baseScope.variables.slice();
  var functions = baseScope.functions.slice();

  var calculation = `
//Compiled code ---------------
/* ${expr} */

${GLcompileLines(expr, "init", variables, functions, true)}
//End of compiled code---------`;

  if (!functions.includes("f1")) {
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
  init();
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

// Convert from Hue,Saturation/Value to RGB
// http://lolengine.net/blog/2013/07/27/rgb-to-hsv-in-glsl
vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

// https://github.com/d3/d3-color
vec3 cubehelix(vec3 c) {
  float a = c.y * c.z * (1.0 - c.z);
  float cosh = cos(c.x + pi_C.x / 2.0);
  float sinh = sin(c.x + pi_C.x / 2.0);
  return vec3(
    (c.z + a * (1.78277 * sinh - 0.14861 * cosh)),
    (c.z - a * (0.29227 * cosh + 0.90649 * sinh)),
    (c.z + a * (1.97294 * cosh))
  );
}

// https://github.com/d3/d3-scale-chromatic
vec3 cubehelixDefault(float t) {
  return cubehelix(vec3(mix(300.0 / 180.0 * pi_C.x, -240.0 / 180.0 * pi_C.x, t), 0.5, t));
}

// https://github.com/d3/d3-scale-chromatic
vec3 cubehelixRainbow(float t) {
  if (t < 0.0 || t > 1.0) t -= floor(t);
  float ts = abs(t - 0.5);
  return cubehelix(vec3((360.0 * t - 100.0) / 180.0 * pi_C.x, 1.5 - 1.5 * ts, 0.8 - 0.9 * ts));
}

/*{Calculation}*/

void main() {
  vec2 z, w;
  
  if (plotColor <= 7.0) {//Do not calculate if constant color
    //calculate point
    init();
    z = vUv.xy * scale + offset;
    w = f_C(z);
  }

  if (abs(vUv.z) > width || discardTri > 0.0) discard;

  if (w.x != w.x || w.y != w.y || abs(w.x) > 1.0e+38 || abs(w.y) > 1.0e+38) discard;

  float sharp = 0.39; // delay
  float b = 0.655; // brightness 0 -> dark, 1 -> bright
  float nMod = 2.0; // num of level curves mod
  float nPhase = 20.0; // num. of level curves phase

  if (plotColor == 1.0) {
    //***********************
    //vec2 polar = polar_C(w);
    //float hue = polar.y / 2.0 / pi_C.x;
    //float light = min(1.0 - pow(max(1.0 - plotSaturation, 0.0), polar.x / scale), 1.0);
    //gl_FragColor = vec4(hsl2rgb(vec3(hue, 1.0, light)), 1.0);
    //***********************

    vec2 polar = polar_C(w);
    float hue = polar.y / 2.0 / pi_C.x;
    float light = plotSaturation;
    gl_FragColor = vec4(hsl2rgb(vec3(hue, 1.0, light)), 1.0);
    //gl_FragColor = vec4(cubehelixRainbow(hue), 1.0);

  } else if (plotColor == 2.0) {
    //***********************
    //vec2 polar = polar_C(w);
    //float hue = polar.y / 2.0 / pi_C.x;
    //float light = 0.5;
    //gl_FragColor = vec4(hsl2rgb(vec3(hue, 1.0, light)), 1.0);
    //***********************

    vec2 polar = polar_C(w);
    float hue = polar.y / 2.0 / pi_C.x;

    float _r = polar.x;
    _r = b + sharp * ( _r - floor( _r ) );

    float _c = sharp * ( nPhase * hue - floor( nPhase * hue) ) + b;

    float light =  _c * 0.5;

    vec3 _col = hsl2rgb(vec3(hue, 1.0, light));

    gl_FragColor = vec4(_col, 1.0);

  } else if (plotColor == 3.0) {

    //***********************
    //vec2 polar = polar_C(w);
    //float hue = 0.0;
    //float light = min(1.0 - pow(max(1.0 - plotSaturation, 0.0), polar.x / scale), 1.0);
    //gl_FragColor = vec4(hsl2rgb(vec3(hue, 1.0, light)), 1.0);
    //***********************

    vec2 polar = polar_C(w);
    float hue = polar.y / 2.0 / pi_C.x;

    float _r = 2.0 * log(polar.x);
    _r = b + sharp * ( _r - floor( _r ) );

    float light =  _r * 0.5;

    vec3 _col = hsl2rgb(vec3(hue, 1.0, light));
    gl_FragColor = vec4(_col, 1.0);

  } else if (plotColor == 4.0) {
    vec2 polar = polar_C(w);
    float hue = polar.y / 2.0 / pi_C.x;

    float _r = 2.0 * log(polar.x);
    _r = 0.65 + 0.39 * ( _r - floor( _r ) );

    float _c = 0.39 * ( 20.0 * hue - floor( 20.0 * hue) ) + 0.655;

    float light =  _r * 0.5 *_c;

    vec3 _col = hsl2rgb(vec3(hue, 1.0, light));

    gl_FragColor = vec4(_col, 1.0);

    //gl_FragColor = vec4(0.22, 0.55, 0.27, 1.0); //Desmos green

  } else if (plotColor == 5.0) {
    vec2 polar = polar_C(w);
    float hue = polar.y / 2.0 / pi_C.x;

    vec2 _re = re_C(w);

    float _r = _re.x;
    _r = 0.65 + 0.39 * ( _r - floor( _r ) );

    float _c = 0.39 * ( 20.0 * hue - floor( 20.0 * hue) ) + 0.655;

    float light =  _r * 0.5;

    vec3 _col = hsl2rgb(vec3(hue, 1.0, light));
    gl_FragColor = vec4(_col, 1.0);
    
  } else if (plotColor == 6.0) {
    vec2 polar = polar_C(w);
    float hue = polar.y / 2.0 / pi_C.x;

    vec2 _im = im_C(w);

    float _r = _im.x;
    _r = 0.65 + 0.39 * ( _r - floor( _r ) );

    float _c = 0.39 * ( 20.0 * hue - floor( 20.0 * hue) ) + 0.655;

    float light =  _r * 0.5;

    vec3 _col = hsl2rgb(vec3(hue, 1.0, light));

    gl_FragColor = vec4(_col, 1.0);
    
  } else if (plotColor == 7.0) {
    vec2 polar = polar_C(w);
    float hue = polar.y / 2.0 / pi_C.x;
     
    vec2 _re = re_C(w);
    vec2 _im = im_C(w);

    float _r = _re.x;
    _r = 0.65 + 0.39 * ( _r - floor( _r ) );
    float _i = _im.x;
    _i = 0.65 + 0.39 * ( _i - floor( _i ) );

    float _c = 0.39 * ( 20.0 * hue - floor( 20.0 * hue) ) + 0.655;

    float light =  _r * 0.5 * _i;

    vec3 _col = hsl2rgb(vec3(hue, 1.0, light));
    gl_FragColor = vec4(_col, 1.0);
    
  }

}
`;