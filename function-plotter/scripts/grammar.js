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
          "+": function(left, right) { return 'complex_add(' + left + ',' + right + ')'; },
          "-": function(left, right) { return 'complex_sub(' + left + ',' + right + ')'; }
        });
      }

  Term
    = first:Powered rest:(_ ("*" / "/") _ Powered)* {
        return combine(first, rest, {
          "*": function(left, right) { return 'complex_mul(' + left + ',' + right + ')'; },
          "/": function(left, right) { return 'complex_div(' + left + ',' + right + ')'; }
        });
      }

  Powered
    =  _ left:Factor _ "^" _ right:Factor _ { return 'complex_pow(' + left + ',' + right + ')'; }
    / Factor
  // Added a few extra functions by Juan Carlos Ponce Campuzano 12-Nov-2019
  Factor
    = "(" _ expr:Expression _ ")" { return expr; }
    / _ "log"  _ "(" _ arg:Expression _ ")" _ { return 'complex_log(' + arg + ')'; }
    / _ "tan"  _ "(" _ arg:Expression _ ")" _ { return 'complex_tan(' + arg + ')'; }
    / _ "cos"  _ "(" _ arg:Expression _ ")" _ { return 'complex_cos(' + arg + ')'; }
    / _ "sin"  _ "(" _ arg:Expression _ ")" _ { return 'complex_sin(' + arg + ')'; }
    / _ "sec"  _ "(" _ arg:Expression _ ")" _ { return 'complex_sec(' + arg + ')'; }
    / _ "csc"  _ "(" _ arg:Expression _ ")" _ { return 'complex_csc(' + arg + ')'; }
    / _ "cot"  _ "(" _ arg:Expression _ ")" _ { return 'complex_cot(' + arg + ')'; }
    / _ "sech"  _ "(" _ arg:Expression _ ")" _ { return 'complex_sech(' + arg + ')'; }
    / _ "csch"  _ "(" _ arg:Expression _ ")" _ { return 'complex_csch(' + arg + ')'; }
    / _ "coth"  _ "(" _ arg:Expression _ ")" _ { return 'complex_coth(' + arg + ')'; }
    / _ "tanh"  _ "(" _ arg:Expression _ ")" _ { return 'complex_tanh(' + arg + ')'; }
    / _ "cosh"  _ "(" _ arg:Expression _ ")" _ { return 'complex_cosh(' + arg + ')'; }
    / _ "sinh"  _ "(" _ arg:Expression _ ")" _ { return 'complex_sinh(' + arg + ')'; }
    / _ "abs"  _ "(" _ arg:Expression _ ")" _ { return 'complex_abs(' + arg + ')'; }
    / _ "re"  _ "(" _ arg:Expression _ ")" _ { return 'complex_re(' + arg + ')'; }
    / _ "im"  _ "(" _ arg:Expression _ ")" _ { return 'complex_im(' + arg + ')'; }
    / _ "conj"  _ "(" _ arg:Expression _ ")" _ { return 'complex_conj(' + arg + ')'; }
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
    / "z"     { return 'complex(a,b)'; }
    / "i"     { return 'complex(0.0,1.0)'; }
    / a:Real  { return 'complex(' + a + ',0.0)'; }

  Real
    = whole:Integer "." fractional:Integer { return '' + whole + '.' + fractional; }
    / whole:Integer { return '' + whole + '.0'; }
    / "pi" { return '3.14159265359'; }
    / "e" { return '2.7182818284'; }
    / "a" { return 'a'; }
    / "b" { return 'b'; }
    / "theta" { return 'complex_theta(a,b)'; }
    / "t" { return 't'; }
    / "r"     { return 'complex_r(a,b)'; }

  Integer "integer"
    = "-" int:Integer { return "-" + int;}
    / PositiveInteger

  PositiveInteger
    = [0-9]+ { return text(); }

  _ "whitespace"
    = [ \t\n\r]*