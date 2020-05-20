// Adapted by Juan Carlos Ponce Campuzano 10-Dec-2019

/*
 * Complex Arithmetic Grammar
 * (Utilizes http://pegjs.org/ to build a parser based on this grammar)
 */

{
  function combine(first, rest, combiners) {
    var result = first, i;
    for (i = 0; i < rest.length; i++) {
      result = combiners[rest[i][1]](result, rest[i][3]);
    }
    return result;
  }
}

Expression
  = first:Term rest:(_ ("+" / "-") _ Term)* _ {
      return combine(first, rest, {
        "+": function(left, right) { return 'cadd(' + left + ',' + right + ')'; },
        "-": function(left, right) { return 'csub(' + left + ',' + right + ')'; }
      });
    }

Term
  = first:Powered rest:(_ ("*" / "/") _ Powered)* {
      return combine(first, rest, {
        "*": function(left, right) { return 'cmul(' + left + ',' + right + ')'; },
        "/": function(left, right) { return 'cdiv(' + left + ',' + right + ')'; }
      });
    }

Powered
  =  _ left:Factor _ "^" _ right:Factor _ { return 'cpow(' + left + ',' + right + ')'; }
  / Factor
// Added a few extra functions by Juan Carlos Ponce Campuzano 12-Nov-2019
Factor
  = "(" _ expr:Expression _ ")" { return expr; }
  / _ "joukowsky"  _ "(" _ arg:Expression _ "," _ c:Expression _ "," _ a:Real _ ")" _ { return 'joukowsky(' + arg + ',' + c + ','+ a +')'; }
  / _ "zeta"  _ "(" _ arg:Expression _ ")" _ { return 'zeta(' + arg + ')'; }
  / _ "mandelbrot"  _ "(" _ arg:Expression _ ")" _ { return 'mandelbrot(' + arg + ')'; }
  / _ "julia"  _ "(" _ arg:Expression _ "," _ c:Expression _ ")" _ { return 'julia(' + arg + ',' + c + ')'; }
  / _ "gamma"  _ "(" _ arg:Expression _ ")" _ { return 'gamma(' + arg + ')'; }
  / _ "floor"  _ "(" _ arg:Expression _ ")" _ { return 'cfloor(' + arg + ')'; }
  / _ "ceil"  _ "(" _ arg:Expression _ ")" _ { return 'cceil(' + arg + ')'; }
  / _ "map"  _ "(" _ arg:Expression _ ")" _ { return 'map(' + arg + ')'; }
  / _ "transform"  _ "(" _ argz:Expression _ "," _ argw:Expression _"," _ a:Real _")" _ { return 'transform(' + argz + ','+ argw +','+ a +')'; }
  / _ "floor"  _ "(" _ arg:Expression _ ")" _ { return 'cfloor(' + arg + ')'; }
  / _ "ceil"  _ "(" _ arg:Expression _ ")" _ { return 'cceil(' + arg + ')'; }
  / _ "disk"  _ "(" _ arg:Expression _ ")" _ { return 'disk(' + arg + ')'; }
  / _ "log"  _ "(" _ arg:Expression _ ")" _ { return 'clog(' + arg + ')'; }
  / _ "arg"  _ "(" _ arg:Expression _ ")" _ { return 'carg(' + arg + ')'; }
  / _ "exp"  _ "(" _ arg:Expression _ ")" _ { return 'cexp(' + arg + ')'; }
  / _ "tan"  _ "(" _ arg:Expression _ ")" _ { return 'ctan(' + arg + ')'; }
  / _ "cos"  _ "(" _ arg:Expression _ ")" _ { return 'ccos(' + arg + ')'; }
  / _ "sin"  _ "(" _ arg:Expression _ ")" _ { return 'csin(' + arg + ')'; }
  / _ "sec"  _ "(" _ arg:Expression _ ")" _ { return 'csec(' + arg + ')'; }
  / _ "csc"  _ "(" _ arg:Expression _ ")" _ { return 'ccsc(' + arg + ')'; }
  / _ "cot"  _ "(" _ arg:Expression _ ")" _ { return 'ccot(' + arg + ')'; }
  / _ "arctan"  _ "(" _ arg:Expression _ ")" _ { return 'actan(' + arg + ')'; }
  / _ "arccos"  _ "(" _ arg:Expression _ ")" _ { return 'accos(' + arg + ')'; }
  / _ "arcsin"  _ "(" _ arg:Expression _ ")" _ { return 'acsin(' + arg + ')'; }
  / _ "arcsec"  _ "(" _ arg:Expression _ ")" _ { return 'acsec(' + arg + ')'; }
  / _ "arccsc"  _ "(" _ arg:Expression _ ")" _ { return 'accsc(' + arg + ')'; }
  / _ "arccot"  _ "(" _ arg:Expression _ ")" _ { return 'accot(' + arg + ')'; }
  / _ "sech"  _ "(" _ arg:Expression _ ")" _ { return 'csech(' + arg + ')'; }
  / _ "csch"  _ "(" _ arg:Expression _ ")" _ { return 'ccsch(' + arg + ')'; }
  / _ "coth"  _ "(" _ arg:Expression _ ")" _ { return 'ccoth(' + arg + ')'; }
  / _ "tanh"  _ "(" _ arg:Expression _ ")" _ { return 'ctanh(' + arg + ')'; }
  / _ "cosh"  _ "(" _ arg:Expression _ ")" _ { return 'ccosh(' + arg + ')'; }
  / _ "sinh"  _ "(" _ arg:Expression _ ")" _ { return 'csinh(' + arg + ')'; }
  / _ "sech"  _ "(" _ arg:Expression _ ")" _ { return 'csech(' + arg + ')'; }
  / _ "arccsch"  _ "(" _ arg:Expression _ ")" _ { return 'accsch(' + arg + ')'; }
  / _ "arccoth"  _ "(" _ arg:Expression _ ")" _ { return 'accoth(' + arg + ')'; }
  / _ "arctanh"  _ "(" _ arg:Expression _ ")" _ { return 'actanh(' + arg + ')'; }
  / _ "arccosh"  _ "(" _ arg:Expression _ ")" _ { return 'accosh(' + arg + ')'; }
  / _ "arcsinh"  _ "(" _ arg:Expression _ ")" _ { return 'acsinh(' + arg + ')'; }
  / _ "arcsech"  _ "(" _ arg:Expression _ ")" _ { return 'acsech(' + arg + ')'; }
  / _ "abs"  _ "(" _ arg:Expression _ ")" _ { return 'cabs(' + arg + ')'; }
  / _ "|" _ arg:Expression _ "|"  _ { return 'cabs(' + arg + ')'; }
  / _ "re"  _ "(" _ arg:Expression _ ")" _ { return 're(' + arg + ')'; }
  / _ "im"  _ "(" _ arg:Expression _ ")" _ { return 'im(' + arg + ')'; }
  / _ "conj"  _ "(" _ arg:Expression _ ")" _ { return 'conjugate(' + arg + ')'; }
  / _ "iter" _ "(" _ arg:Expression _ "," _ count:PositiveInteger _ ")" _ {
    var n = parseInt(count) - 1, Q = arg;
    for(var it=0; it < n; ++it) {
      Q = Q.replace(/complex\(a,b\)/g, '(' + Q + ')');
    }
    return Q;
  }
  / Complex

Complex
  = "<" _ a:Real _ "," _ b:Real _ ">" { return 'complex(' + a + ',' + b + ')'; }
  / "-z"     { return 'complex(-a,-b)'; }
  / "z"     { return 'complex(a,b)'; }
  / "i"     { return 'complex(0.0,1.0)'; }
  / "-i"     { return 'complex(0.0,-1.0)'; }
  / a:Real  { return 'complex(' + a + ',0.0)'; }

Real
  = whole:Integer "." fractional:Integer { return '' + whole + '.' + fractional; }
  / whole:Integer { return '' + whole + '.0'; }
  / "pi" { return '3.14159265358979'; }
  / "e" { return '2.71828182845904'; }
  / "a" { return 'a'; }
  / "b" { return 'b'; }
  / "theta" { return 'theta(a,b)'; }
  / "t" { return 't'; }
  / "s" { return 's'; }
  / "-t" { return '-t'; }
  / "-s" { return '-s'; }
  / "r"     { return 'r(a,b)'; }
  // / "|" + arg + "|"     { return 'cabs( ' +arg + ' )'; }

Integer "integer"
  = "-" int:Integer { return "-" + int;}
  / PositiveInteger

PositiveInteger
  = [0-9]+ { return text(); }

_ "whitespace"
  = [ \t\n\r]*