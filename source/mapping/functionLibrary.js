/*
  Author: David Block
  Source: https://replit.com/@DavidBrock1/complexplotter#functionLibrary.js
*/

//Create GLSL code for all function
var commonShaderCode = "";
var baseScope = {
  variables: [],
  functions: []
};

//Add variables that are defines in shader code
baseScope.variables.push("c");
baseScope.variables.push("i");
baseScope.variables.push("e");
baseScope.variables.push("pi");

//Math constants
commonShaderCode += "uniform vec2 c;\n";
commonShaderCode += "const vec2 i = vec2(0.0, 1.0);\n";
commonShaderCode += "const vec2 e = vec2(" + Math.E + ", 0.0);\n";
commonShaderCode += "const vec2 pi = vec2(" + Math.PI + ", 0.0);\n";

//Add basic functions that are defined in shader code
baseScope.functions.push("re1");
baseScope.functions.push("im1");
baseScope.functions.push("conj1");
baseScope.functions.push("abs1");
baseScope.functions.push("mul2");
baseScope.functions.push("div2");
baseScope.functions.push("polar1");
baseScope.functions.push("ln1");
baseScope.functions.push("exp1");
baseScope.functions.push("gamma1");
baseScope.functions.push("zeta1");
baseScope.functions.push("zeta2");

//Enementry functions that other functions are defined in terms of
commonShaderCode += `
vec2 re_C(vec2 a) {
  return vec2(a.x, 0.0);
}
vec2 im_C(vec2 a) {
  return vec2(a.y, 0.0);
}
vec2 conj_C(vec2 a) {
  return vec2(a.x, -a.y);
}
vec2 abs_C(vec2 a) {
  return vec2(sqrt(a.x*a.x + a.y*a.y), 0.0);
}
vec2 mul_C(vec2 a, vec2 b) {
  return vec2(a.x*b.x - a.y*b.y, a.x*b.y + a.y*b.x);
}
vec2 div_C(vec2 a, vec2 b) {
  return mul_C(a, conj_C(b)) / (b.x*b.x + b.y*b.y);
}
vec2 polar_C(vec2 a) {
  return vec2(abs_C(a).x, atan(a.y, a.x));
}
vec2 ln_C(vec2 a) {
  return vec2(log(abs_C(a).x), atan(a.y, a.x));
}
vec2 exp_C(vec2 a) {
  return exp(a.x) * vec2(cos(a.y), sin(a.y));
}`;

commonShaderCode += GLcompile("pow(b, p) = exp(ln(b) * p)", baseScope);
commonShaderCode += GLcompile("sqrt(z) = z^0.5", baseScope);
commonShaderCode += GLcompile("log(z) = ln(z) / 2.30258509;", baseScope);
commonShaderCode += GLcompile("log(z, b) = ln(z) / ln(b)", baseScope);

commonShaderCode += GLcompile("sin(z) = (e^(i*z) - e^(-i*z)) / 2i", baseScope);
commonShaderCode += GLcompile("cos(z) = (e^(i*z) + e^(-i*z)) / 2", baseScope);
commonShaderCode += GLcompile("tan(z) = sin(z)/cos(z)", baseScope);
commonShaderCode += GLcompile("sec(z) = 1/cos(z)", baseScope);
commonShaderCode += GLcompile("csc(z) = 1/sin(z)", baseScope);
commonShaderCode += GLcompile("cot(z) = 1/tan(z)", baseScope);

commonShaderCode += GLcompile("asin(z) = -i * ln(i*z + sqrt(1 - z^2))", baseScope);
commonShaderCode += GLcompile("acos(z) = -i * ln(z + sqrt(z^2 - 1))", baseScope);
commonShaderCode += GLcompile("atan(z) = (i/2) * ln((i + z) / (i - z))", baseScope);

commonShaderCode += GLcompile("sinh(z) = (e^z - e^(-z)) / 2", baseScope);
commonShaderCode += GLcompile("cosh(z) = (e^z + e^(-z)) / 2", baseScope);
commonShaderCode += GLcompile("tanh(z) = sinh(z)/cosh(z)", baseScope);

commonShaderCode += GLcompile("asinh(z) = ln(z + sqrt(z^2 + 1))", baseScope);
commonShaderCode += GLcompile("acosh(z) = ln(z + sqrt(z^2 - 1))", baseScope);
commonShaderCode += GLcompile("atanh(z) = (1/2) * ln((1 + z) / (1 - z))", baseScope);

//These functions are a bit too complex to write in one line
commonShaderCode += `
vec2 gammaPartial_C(vec2 z) {
  z.x -= 1.0;
  vec2 x = vec2(1.0, 0.0);
  
  x += ${GLcompile("+676.5203681218851 / (z+1)", {variables: ["z"]})};
  x += ${GLcompile("-1259.139216722403 / (z+2)", {variables: ["z"]})};
  x += ${GLcompile("+771.3234287776531 / (z+3)", {variables: ["z"]})};
  x += ${GLcompile("-176.6150291621406 / (z+4)", {variables: ["z"]})};
  x += ${GLcompile("+12.50734327868691 / (z+5)", {variables: ["z"]})};
  x += ${GLcompile("-0.1385710952657201 / (z+6)", {variables: ["z"]})};
  x += ${GLcompile("+0.000009984369578019572 / (z+7)", {variables: ["z"]})};
  x += ${GLcompile("+0.0000001505632735149312 / (z+8)", {variables: ["z"]})};
  
  ${GLcompile("t = z + 7.5", {variables: ["z"]})};
  return ${GLcompile("sqrt(2pi) * t^(z+0.5) * exp(-t) * x", {variables: ["z", "t", "x"]})};
}

vec2 gamma_C(vec2 z) {
  vec2 y;
  if (z.x < 0.5) {
    y = ${GLcompile("pi / (sin(pi*z) * gammaPartial(1-z))", {variables: ["z"], functions: ["gammaPartial1"]})}; //Reflection formula
  } else {
    y = gammaPartial_C(z);
  }
  return y;
}

vec2 zetaPartial_C(vec2 s, vec2 count) {
  vec2 total = vec2(1.0, 0.0);
  vec2 n1 = vec2(0.0);
  vec2 n2 = vec2(0.0);

  for (float i = 1.0; i < 1024.0; i++) {
    n1.x = 2.0 * i;
    n2.x = 2.0 * i + 1.0;
    total += ${GLcompile("-1/n1^s + 1/n2^s", {variables: ["n1", "n2", "s"]})};
    if (2.0 * i >= count.x) break;
  }
  return ${GLcompile("1/(1-2^(1-s)) * total", {variables: ["s", "total"]})};
}

vec2 zeta_C(vec2 s, vec2 count) {
  vec2 y;
  if (s.x < 0.5) {
    y = ${GLcompile("2^s * pi^(s-1) * sin(pi*s/2) * gamma(1-s) * zetaPartial(1-s, count)", {variables: ["s", "count"], functions: ["zetaPartial2"]})};
  } else {
    y = zetaPartial_C(s, count);
  }
  return y;
}

vec2 zeta_C(vec2 s) {
  return zeta_C(s, vec2(64.0, 0.0));
}`;

//Import functions not included in the math library so they can be used in JavaScript
math.import({
  zeta: math.typed({
    "Complex, Complex": (function () {
      var sumTerm = math.compile("total -1/n1^s +1/n2^s");
      var result = math.compile("1/(1-2^(1-s)) * total");
      var reflection = math.compile("2^s * pi^(s-1) * sin(pi*s/2) * gamma(1-s) * zetaPartial(1-s, count)");

      function zetaPartial(s, count) {
        var total = math.complex(1.0, 0.0);
        var n1 = 0.0;
        var n2 = 0.0;

        for (var i = 1.0; i < 1024.0; i++) {
          n1 = 2.0 * i;
          n2 = 2.0 * i + 1.0;
          total = sumTerm.evaluate({s: s, total: total, n1: n1, n2: n2});
          if (2.0 * i >= count) break;
        }
        return result.evaluate({s: s, total: total});
      }

      return function (s, count) {
        var y;
        if (s.re < 0.5) {
          y = reflection.evaluate({s: s, count: count.re, zetaPartial: zetaPartial});
        } else {
          y = zetaPartial(s, count.re);
        }
        return y;
      };
    })(),

    "Complex": function (s) {
      return math.zeta(s, 64);
    }
  }),
});