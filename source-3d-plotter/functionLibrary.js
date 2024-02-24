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
commonShaderCode += "uniform vec2 c_C;\n";
commonShaderCode += "vec2 i_C = vec2(0.0, 1.0);\n";
commonShaderCode += "vec2 e_C = vec2(" + Math.E + ", 0.0);\n";
commonShaderCode += "vec2 pi_C = vec2(" + Math.PI + ", 0.0);\n";

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

commonShaderCode += GLcompileLines(`
pow(b, p) = exp(ln(b) * p)
sqrt(z) = z^0.5
log(z) = ln(z) / 2.30258509
log(z, b) = ln(z) / ln(b)

sin(z) = (e^(i*z) - e^(-i*z)) / 2i
cos(z) = (e^(i*z) + e^(-i*z)) / 2
tan(z) = sin(z)/cos(z)
sec(z) = 1/cos(z)
csc(z) = 1/sin(z)
cot(z) = 1/tan(z)

asin(z) = -i * ln(i*z + sqrt(1 - z^2))
acos(z) = -i * ln(z + sqrt(z^2 - 1))
atan(z) = (i/2) * ln((i + z) / (i - z))

sinh(z) = (e^z - e^(-z)) / 2
cosh(z) = (e^z + e^(-z)) / 2
tanh(z) = sinh(z)/cosh(z)

asinh(z) = ln(z + sqrt(z^2 + 1))
acosh(z) = ln(z + sqrt(z^2 - 1))
atanh(z) = (1/2) * ln((1 + z) / (1 - z))
`, null, [], baseScope.functions);

//These functions are a bit too complex to write in one line
baseScope.functions.push("gamma1");
baseScope.functions.push("zeta1");
baseScope.functions.push("zeta2");

//They are partially written in shader code instead
commonShaderCode += `
vec2 gammaPartial_C(vec2 z_C) {
  z_C.x -= 1.0;
  vec2 x_C = vec2(1.0, 0.0);
  
  x_C += ${GLcompile("+676.5203681218851 / (z+1)")};
  x_C += ${GLcompile("-1259.139216722403 / (z+2)")};
  x_C += ${GLcompile("+771.3234287776531 / (z+3)")};
  x_C += ${GLcompile("-176.6150291621406 / (z+4)")};
  x_C += ${GLcompile("+12.50734327868691 / (z+5)")};
  x_C += ${GLcompile("-0.138571095265720 / (z+6)")};
  x_C += ${GLcompile("+0.000009984369578 / (z+7)")};
  x_C += ${GLcompile("+0.000000150563274 / (z+8)")};
  
  ${GLcompile("t = z + 7.5")};
  return ${GLcompile("sqrt(2pi) * t^(z+0.5) * exp(-t) * x")};
}

vec2 gamma_C(vec2 z_C) {
  vec2 y_C;
  if (z_C.x < 0.5) {
    y_C = ${GLcompile("pi / (sin(pi*z) * gammaPartial(1-z))")}; //Reflection formula
  } else {
    y_C = gammaPartial_C(z_C);
  }
  return y_C;
}

vec2 zetaPartial_C(vec2 s_C, vec2 count_C) {
  vec2 total_C = vec2(1.0, 0.0);
  vec2 n1_C = vec2(0.0);
  vec2 n2_C = vec2(0.0);

  for (float i = 1.0; i < 1024.0; i++) {
    n1_C.x = 2.0 * i;
    n2_C.x = 2.0 * i + 1.0;
    total_C += ${GLcompile("-1/n1^s + 1/n2^s")};
    if (2.0 * i >= count_C.x) break;
  }
  return ${GLcompile("1/(1-2^(1-s)) * total")};
}

vec2 zeta_C(vec2 s_C, vec2 count_C) {
  vec2 y_C;
  if (s_C.x < 0.5) {
    y_C = ${GLcompile("2^s * pi^(s-1) * sin(pi*s/2) * gamma(1-s) * zetaPartial(1-s, count)")};
  } else {
    y_C = zetaPartial_C(s_C, count_C);
  }
  return y_C;
}

vec2 zeta_C(vec2 s_C) {
  return zeta_C(s_C, vec2(64.0, 0.0));
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