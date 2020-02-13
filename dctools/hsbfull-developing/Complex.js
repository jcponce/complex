/* 
This is the JavaScript parser for complex number formulae,
written by David Bau, during snowstorm Nemo 2013.

Adapted and updated with new functions by Juan Carlos Ponce Campuzano 
in the Australian summer of 2019.
*/

function complex_expression(s) {
    var consts = {
        i: {
            r: 0,
            i: 1
        },
        pi: {
            r: Math.PI,
            i: 0
        },
        e: {
            r: Math.E,
            i: 0
        }
    };
    var vars = {
        m: 'm',
        n: 'n',
        t: 't',
        r: 'r',
        s: 's',
        u: 'u',
        z: 'z',
        'z\'': 'zp'
    };
    var funcs = {
        random: 0,
        re: 1,
        im: 1,
        modulus: 1,
        arg: 1,
        recip: 1,
        neg: 1,
        conj: 1,
        disk: 1,
        floor: 1,
        ceil: 1,
        square: 1,
        cube: 1,
        sqrt: 1,
        exp: 1,
        log: 1,
        sin: 1,
        cos: 1,
        tan: 1,
        cot: 1,
        sec: 1,
        csc: 1,
        sinh: 1,
        cosh: 1,
        tanh: 1,
        coth: 1,
        sech: 1,
        csch: 1,
        asin: 1,
        acos: 1,
        atan: 1,
        arcsin: 1,
        arccos: 1,
        arctan: 1,
        arccot: 1,
        arcsec: 1,
        arccsc: 1,
        arcsinh: 1,
        arccosh: 1,
        arctanh: 1,
        arccoth: 1,
        arcsech: 1,
        arccsch: 1,
        gamma: 1,
        pow: 2,
        rationalBlaschke: 2,
        mobius: 5,
        psymbol: 2,
        binomial: 2,
        sn: 2,
        cn: 2,
        dn: 2,
        sum: 2,
        prod: 2,
        blaschke: 2,
        iter: 3
    };
    var syns = {
        asin: 'arcsin',
        acos: 'arccos',
        atan: 'arctan'
    };
    var params = [{
            name: 't',
            defn: '{r:par,i:0}',
            caption: (function (t) {
                return 't = ' + t.toFixed(3);
            })
        },
        {
            name: 'u',
            defn: '{r:Math.cos(Math.PI*2*par),i:Math.sin(Math.PI*2*par)}',
            caption: (function (t) { // epislon added to avoid displaying "-0.00".
                var s = Math.sin(Math.PI * 2 * t) + 3e-16,
                    c = Math.cos(Math.PI * 2 * t) + 3e-16;
                return 'u = ' + c.toFixed(2) + (s >= 0 ? ' + ' : ' - ') +
                    Math.abs(s).toFixed(2) + 'i';
            })
        },
        {
            name: 'n',
            defn: '{r:Math.floor(par*par*59 + 1.5),i:0}',
            caption: (function (t) {
                return 'n = ' + (Math.floor(t * t * 59 + 1.5));
            })
        },
        {
            name: 's',
            defn: '{r:Math.sin(Math.PI*2*par),i:0}',
            caption: (function (t) {
                return 's = ' + (Math.sin(Math.PI * 2 * t) + 3e-16).toFixed(3);
            })
        },
        {
            name: 'r',
            defn: '{r:0.5-Math.cos(Math.PI*2*par)/2,i:0}',
            caption: (function (t) {
                return 'r = ' + (.5 - Math.cos(Math.PI * 2 * t) / 2 + 3e-16).toFixed(3);
            })
        }
    ];
    var loops = {
        iter: 1,
        sum: 1,
        prod: 1,
    };
    var symbols = {}
    var factorials = [];

    //I need these arrays for Blaschke products
    var mds = [];
    var args = [];
    var values = [];

    function run() {
        dictadd(symbols, consts);
        dictadd(symbols, vars);
        dictadd(symbols, funcs);
        init_constants();
        init_ai();
        var state = {
            tok: tokenize(s),
            j: 0
        }
        if (state.tok === null) return null;
        var result = parsesum(state, false);
        if (result === null || state.j < state.tok.length) return null;
        var parameters = [];
        if (result.vars.hasOwnProperty('z\'')) return null;
        var fntext = '(function(z,par){';
        if (result.vars.hasOwnProperty('m')) {
            defns += 'var m = expi(z); '
        }
        for (var j = 0; j < params.length; ++j) {
            if (result.vars.hasOwnProperty(params[j].name)) {
                if (params[j].defn) {
                    fntext += 'var ' + params[j].name + '=' + params[j].defn + ';';
                }
                parameters.push({
                    name: params[j].name,
                    caption: params[j].caption
                });
            }
        }
        fntext += 'return ' + result.expr + ';})';
        return {
            fn: eval(fntext),
            fntext: fntext,
            parameters: parameters
        };
    }

    function init_constants() {
        factorials.push(1);
        for (var j = 0; j < 160; ++j) {
            factorials.push(factorials[factorials.length - 1] * factorials.length);
        }
    }

    //Constants for Blaschke products
    function init_ai() {
        for (let i = 0; i < 100; i++) {
            mds[i] = Math.random();
            args[i] = 2 * Math.PI * Math.random();
            values[i] = {
                r: mds[i] * Math.cos(args[i]),
                i: mds[i] * Math.sin(args[i])
            }

        }
    }

    //Calculates prime numbers 
    function primeFactorsTo(max) {
        var store = [],
            i, j, p = [];
        for (i = 2; i <= max; ++i) {
            if (!store[i]) {
                p.push(i);
                for (j = i << 1; j <= max; j += i) {
                    store[j] = true;
                }
            }
        }
        return p;
    }

    // Evaluate this function, and return a r, j tuple.
    function random() {
        while (true) {
            var result = {
                r: Math.random() * 2 - 1,
                i: Math.random() * 2 - 1
            };
            if (modulussquared(result) < 1) {
                return result;
            }
        }
    }

    //Auxiliary functions 
    function re(z) {
        return {
            r: z.r,
            i: 0
        };
    }

    function im(z) {
        return {
            r: z.i,
            i: 0
        };
    }

    function scale(s, z) {
        return {
            r: z.r * s,
            i: z.i * s
        };
    }

    function modulussquared(z) {
        return z.r * z.r + z.i * z.i;
    }

    function realmodulus(z) {
        return Math.sqrt(modulussquared(z));
    }

    function modulus(z) {
        if (z.i == 0) {
            return {
                r: Math.abs(z.r),
                i: 0
            };
        }
        return {
            r: realmodulus(z),
            i: 0
        };
    }

    function realarg(z) {
        return Math.atan2(z.i, z.r);
    }

    function arg(z) {
        return {
            r: realarg(z),
            i: 0
        };
    }

    //Basic arithmetic
    function add(y, z) {
        return {
            r: y.r + z.r,
            i: y.i + z.i
        };
    }

    function sub(y, z) {
        return {
            r: y.r - z.r,
            i: y.i - z.i
        };
    }

    function mult(y, z) {
        return {
            r: y.r * z.r - y.i * z.i,
            i: y.r * z.i + y.i * z.r
        };
    }

    function div(y, z) {
        var m2 = modulussquared(z);
        return {
            r: (y.r * z.r + y.i * z.i) / m2,
            i: (y.i * z.r - y.r * z.i) / m2
        };
    }

    function recip(z) {
        var m2 = modulussquared(z);
        return {
            r: z.r / m2,
            i: -z.i / m2
        };
    }

    function neg(z) {
        return {
            r: -z.r,
            i: -z.i
        };
    }

    function conj(z) {
        return {
            r: z.r,
            i: -z.i
        };
    }

    //Draws a unit circle
    function disk(z) {
        if (realmodulus(z) > 1) {
            return NaN; //{r: -1,i: 0};
        }
        return {
            r: 1,
            i: 0
        };
    }

    //Elementary functions part 1
    function exp(z) {
        var er = Math.exp(z.r);
        return {
            r: er * Math.cos(z.i),
            i: er * Math.sin(z.i)
        };
    }

    function expi(z) {
        var er = Math.exp(-z.i);
        return {
            r: er * Math.cos(z.r),
            i: er * Math.sin(z.r)
        };
    }

    function log(z) {
        return {
            r: Math.log(realmodulus(z)),
            i: realarg(z)
        };
    }

    //Auxiliary real functions
    function realsinh(x) {
        return (-Math.exp(-x) + Math.exp(x)) / 2;
    }

    function realcosh(x) {
        return (Math.exp(-x) + Math.exp(x)) / 2;
    }

    function realtanh(x) {
        return (1 - Math.exp(-2 * x)) / (1 + Math.exp(-2 * x));
    }

    //Elementary functions part 2: Trigonometric hiperbolic functions
    function sin(z) {
        var er = Math.exp(z.i);
        var enr = 1 / er;
        return {
            r: (er + enr) * 0.5 * Math.sin(z.r),
            i: (er - enr) * 0.5 * Math.cos(z.r)
        };
    }

    function cos(z) {
        var er = Math.exp(z.i);
        var enr = 1 / er;
        return {
            r: (enr + er) * 0.5 * Math.cos(z.r),
            i: (enr - er) * 0.5 * Math.sin(z.r)
        };
    }

    function sec(z) {
        return recip(cos(z));
    }

    function csc(z) {
        return recip(sin(z));
    }

    function tan(z) {
        var er = Math.exp(z.i),
            enr = 1 / er,
            es = er + enr,
            ed = er - enr,
            s = Math.sin(z.r),
            c = Math.cos(z.r);
        return div({
            r: es * s,
            i: ed * c
        }, {
            r: es * c,
            i: -ed * s
        });
    }

    function cot(z) {
        var er = Math.exp(z.i),
            enr = 1 / er,
            es = er + enr,
            ed = er - enr,
            s = Math.sin(z.r),
            c = Math.cos(z.r);
        return div({
            r: es * c,
            i: -ed * s
        }, {
            r: es * s,
            i: ed * c
        });
    }

    function sinh(z) {
        return negitimes(sin(itimes(z)));
    }

    function cosh(z) {
        return cos(itimes(z));
    }

    function tanh(z) {
        return negitimes(tan(itimes(z)));
    }

    function coth(z) {
        return itimes(cot(itimes(z)));
    }

    function sech(z) {
        return sec(itimes(z));
    }

    function csch(z) {
        return itimes(csc(itimes(z)));
    }

    //Power functions
    function intpow(y, c) {
        if (c == 1) return y;
        if (c % 2 == 0) return square(intpow(y, c / 2));
        if (c % 3 == 0) return cube(intpow(y, c / 3));
        if (c % 5 == 0) return p5(intpow(y, c / 5));
        return mult(y, intpow(y, c - 1));
    }

    function realpow(y, r) {
        if (r == Math.floor(r)) {
            if (r > 0 && r <= 64) {
                return intpow(y, r);
            }
            if (r < 0 && r >= -64) {
                return recip(intpow(y, -r));
            }
            if (r == 0) {
                return {
                    r: 1,
                    i: 0
                };
            }
        }
        var arg = realarg(y) * r,
            modulus = Math.pow(realmodulus(y), r);
        return {
            r: modulus * Math.cos(arg),
            i: modulus * Math.sin(arg)
        };
    }

    function powreal(r, z) {
        return exp(scale(Math.log(r), z));
    }

    function pow(y, z) {
        if (z.i == 0) {
            return realpow(y, z.r);
        }
        if (y.i == 0) {
            return powreal(y.r, z);
        }
        return exp(mult(log(y), z));
    }

    function floor(z) {
        return {
            r: Math.floor(z.r),
            i: Math.floor(z.i)
        };
    }

    function ceil(z) {
        return {
            r: Math.ceil(z.r),
            i: Math.ceil(z.i)
        };
    }

    function square(z) {
        var t = z.r * z.i;
        return {
            r: z.r * z.r - z.i * z.i,
            i: t + t
        };
    }

    function cube(z) {
        var r2 = z.r * z.r,
            i2 = z.i * z.i;
        return {
            r: z.r * (r2 - 3 * i2),
            i: z.i * (3 * r2 - i2)
        }
    }

    function p5(z) {
        var r2 = z.r * z.r,
            i2 = z.i * z.i,
            p2 = r2 * i2,
            t2 = p2 + p2,
            r4 = r2 * r2,
            i4 = i2 * i2;
        return {
            r: z.r * (r4 + 5 * (i4 - t2)),
            i: z.i * (i4 + 5 * (r4 - t2))
        };
    }

    function sqrt(z) {
        var a = Math.sqrt((Math.abs(z.r) + realmodulus(z)) / 2),
            b = z.i / a / 2;
        if (z.r < 0) {
            if (z.i < 0) {
                return {
                    r: -b,
                    i: -a
                };
            } else {
                return {
                    r: b,
                    i: a
                };
            }
        }
        return {
            r: a,
            i: b
        };
    }

    function itimes(z) {
        return {
            r: -z.i,
            i: z.r
        };
    }

    function negitimes(z) {
        return {
            r: z.i,
            i: -z.r
        };
    }

    function oneminus(z) {
        return {
            r: 1 - z.r,
            i: -z.i
        };
    }

    function oneplus(z) {
        return {
            r: 1 + z.r,
            i: z.i
        };
    }

    function minusone(z) {
        return {
            r: z.r - 1,
            i: z.i
        };
    }

    //Inverse trigonometric functions
    function arcsin(z) {
        return negitimes(log(add(itimes(z), sqrt(oneminus(square(z))))));
    }

    function arccos(z) {
        return negitimes(log(add(z, itimes(sqrt(oneminus(square(z)))))));
    }

    function arctan(z) {
        return scale(0.5, itimes(
            sub(log(oneminus(itimes(z))), log(oneplus(itimes(z))))));
    }

    function arccot(z) {
        return arctan(recip(z));
    }

    function arcsec(z) {
        return arccos(recip(z));
    }

    function arccsc(z) {
        return arcsin(recip(z));
    }

    function arcsinh(z) {
        var opsz = oneplus(square(z));
        return log(add(z, scale(Math.sqrt(realmodulus(opsz)),
            exp({
                r: 0,
                i: realarg(opsz) / 2
            }))));
    }

    function arccosh(z) {
        var szmo = minusone(square(z));
        return log(add(z, scale(Math.sqrt(realmodulus(szmo)),
            exp({
                r: 0,
                i: realarg(szmo) / 2
            }))));
    }

    function arctanh(z) {
        return scale(0.5, sub(log(oneplus(z)), log(oneminus(z))));
    }

    function arccoth(z) {
        return scale(0.5, sub(log(oneplus(z)), log(minusone(z))));
    }

    function arcsech(z) {
        return negitimes(arcsec(z));
    }

    function arccsch(z) {
        return negitimes(arccsc(negitimes(z)));
    }

    //Binomial function
    function binomial(n, c) {
        if (n.i == 0 && n.r == Math.floor(n.r) && n.r >= 0 &&
            c.i == 0 && c.r == Math.floor(c.r) && c.r >= 0 && c.r <= n.r) {
            // If n is small enough for n! to be fully precise, just use factorial.
            if (n.r < 21) {
                return {
                    r: factorials[n.r] /
                        factorials[c.r] / factorials[n.r - c.r],
                    i: 0
                };
            }
            // Otherwise, loop to preserve precision.
            var k = Math.min(c.r, n.r - c.r),
                m = n.r,
                result = 1,
                j;
            for (j = 1; j <= k; ++j) {
                result = result * (m - (k - j)) / j;
            }
            return {
                r: result,
                i: 0
            };
        }
        return div(gamma(oneplus(n)),
            mult(gamma(oneplus(c)), gamma(oneplus(sub(n, c)))));
    }

    function factorial(z) {
        if (z.i == 0 && z.r == Math.floor(z.r) && z.r >= 0) {
            if (z.r < factorials.length) {
                return {
                    r: factorials[z.r],
                    i: 0
                };
            }
        }
        return gamma(oneplus(z));
    }

    function gamma(z) {
        var sqrt2pi = Math.sqrt(2 * Math.PI),
            gamma_coeff = [
                0.99999999999980993, 676.5203681218851, -1259.1392167224028,
                771.32342877765313, -176.61502916214059, 12.507343278686905,
                -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7
            ],
            gamma_g = 7;
        if (z.r < 0.5) {
            return scale(Math.PI, recip(mult(
                sin(scale(Math.PI, z)), gamma(oneminus(z)))));
        }
        var zmo = minusone(z),
            x = {
                r: gamma_coeff[0],
                i: 0
            },
            i, t;
        for (i = 1; i < gamma_g + 2; ++i) {
            x = add(x, scale(gamma_coeff[i], recip({
                r: zmo.r + i,
                i: zmo.i
            })));
        }
        t = {
            r: zmo.r + gamma_g + 0.5,
            i: zmo.i
        };
        return scale(sqrt2pi, mult(mult(
            pow(t, {
                r: zmo.r + 0.5,
                i: zmo.i
            }), exp(neg(t))), x));
    }

    //Jacobi elliptic functions
    //https://en.wikipedia.org/wiki/Jacobi_elliptic_functions
    function sn(z, k) {
        if (typeof (k) == "object") {
            k = k.r;
        }
        var kp = Math.sqrt(1 - k * k),
            ju = realellipj(z.r, k),
            jv = realellipj(z.i, kp),
            denom = (1 - ju.dn * ju.dn * jv.sn * jv.sn);
        return {
            r: (ju.sn * jv.dn) / denom,
            i: (ju.cn * ju.dn * jv.sn * jv.cn) / denom
        };
    }

    function cn(z, k) {
        if (typeof (k) == "object") {
            k = k.r;
        }
        var kp = Math.sqrt(1 - k * k),
            ju = realellipj(z.r, k),
            jv = realellipj(z.i, kp),
            denom = (1 - ju.dn * ju.dn * jv.sn * jv.sn);
        return {
            r: (ju.cn * jv.cn) / denom,
            i: -(ju.sn * ju.dn * jv.sn * jv.dn) / denom
        };
    }

    function dn(z, k) {
        if (typeof (k) == "object") {
            k = k.r;
        }
        var kp = Math.sqrt(1 - k * k),
            ju = realellipj(z.r, k),
            jv = realellipj(z.i, kp),
            denom = (1 - ju.dn * ju.dn * jv.sn * jv.sn);
        return {
            r: (ju.dn * jv.cn * jv.dn) / denom,
            i: -(k * k * ju.sn * ju.cn * jv.sn) / denom
        };
    }

    function sum(z, fn, iters) {
        var r = 0,
            i = 0,
            end = Math.floor(iters.r),
            n, result;
        for (n = 0; n < end; ++n) {
            result = fn(z, {
                r: n,
                i: 0
            });
            r += result.r;
            i += result.i;
        }
        return {
            r: r,
            i: i
        };
    }

    function iter(z, fn, start, iters) {
        var result = start,
            end = Math.floor(iters.r),
            n;
        for (n = 0; n < end; ++n) {
            result = fn(z, result, {
                r: n,
                i: 0
            });
        }
        return result;
    }

    function realellipj(u, m) {
        /* Jacobi elliptical functions, real form, expressed in Javascript. */
        /* adapted from C Cephes library, ellipj.c, by Stephen L. Moshier */
        /* http://lists.debian.org/debian-legal/2004/12/msg00295.html */
        var ai, aj, b, phi, twon, a = [],
            c = [],
            i, epsilon = 2.22045e-16;
        if (m < 0.0 || m > 1.0) {
            return {
                sn: NaN,
                cn: NaN,
                ph: NaN,
                dn: NaN
            };
        }
        if (m < 1.0e-9) {
            t = Math.sin(u);
            b = Math.cos(u);
            ai = 0.25 * m * (u - t * b);
            return {
                sn: t - ai * b,
                cn: b + ai * t,
                ph: u - ai,
                dn: 1.0 - 0.5 * m * t * t
            };
        }
        if (m >= 0.9999999999) {
            ai = 0.25 * (1.0 - m);
            b = realcosh(u);
            t = realtanh(u);
            phi = 1.0 / b;
            aj = ai * t * phi;
            twon = b * realsinh(u);
            return {
                sn: t + ai * (twon - u) / (b * b),
                ph: 2.0 * Math.atan(Math.exp(u)) - Math.PI / 2 + ai * (twon - u) / b,
                cn: phi - aj * (twon - u),
                dn: phi + aj * (twon + u)
            }
        }
        a[0] = 1.0;
        b = Math.sqrt(1.0 - m);
        c[0] = Math.sqrt(m);
        twon = 1.0;
        i = 0;
        while (Math.abs(c[i] / a[i]) > epsilon && i < 8) {
            ai = a[i];
            ++i;
            c[i] = (ai - b) / 2.0;
            t = Math.sqrt(ai * b);
            a[i] = (ai + b) / 2.0;
            b = t;
            twon *= 2.0;
        }
        phi = twon * a[i] * u;
        do {
            t = c[i] * Math.sin(phi) / a[i];
            b = phi;
            phi = (Math.asin(t) + phi) / 2.0;
        } while (--i);
        t = Math.cos(phi);
        return {
            sn: Math.sin(phi),
            cn: t,
            dn: t / Math.cos(phi - b),
            ph: phi
        };
    }

    /* 
      New functions by Juan Carlos Ponce Campuzano 2019
     
      prod(expr, iters)
     
      mobius( expr, a, b, c, d) 

      psymbol(z, n>=0) 
      
      blaschke(z, number of multiples) 

     */

    function prod(z, fn, iters) {
        let result = fn(z, {
                r: 1,
                i: 0
            }),
            end = Math.floor(iters.r),
            n;

        if (end < 1) {
            return NaN;
        } else if (end === 1) {
            return fn(z, {
                r: 1,
                i: 0
            });
        } else {
            for (n = 2; n <= end; ++n) {
                result = mult(result, fn(z, {
                    r: n,
                    i: 0
                }))
            }
            return result;
        }
    }

    /*
      Pochhammer Symbol:
      http://mathworld.wolfram.com/PochhammerSymbol.html
      
    */
    function psymbol(z, iters) {

        var result = {
            r: 1,
            i: 0
        };
        var end = Math.floor(iters.r),
            n;
        if (end === 0) {
            return {
                r: 1,
                i: 0
            };
        }
        if (end > 0) {


            for (n = 1; n <= end; ++n) {

                result = mult(result, add(z, {
                    r: n - 1,
                    i: 0
                }));
            }

            return result;
        }
    }

    /* 
      Mobius transformation
      https://en.wikipedia.org/wiki/M%C3%B6bius_transformation 
      f(z)=(az+b)/(cz+d), ad − bc ≠ 0
      Real and Imaginary components: x1 x2 - y1 y2 + i (x2 y1 + y2 x1) 
    */
    function mobius(z, a, b, c, d) {
        
        let num = {
            r: z.r * a.r - z.i * a.i + b.r,
            i: z.r * a.i + z.i * a.r + b.i
        };
        let denom = {
            r: z.r * c.r - z.i * c.i + d.r,
            i: z.r * c.i + z.i * c.r + d.i
        };
        let cond = sub(mult(a, d), mult(b, c));
        if (cond.r === 0 && cond.i === 0) {
            return null; //{r: Math.cos(2*Math.PI* 0.625), i:Math.cos(2*Math.PI* 0.625)};
        } else {
            return div(num, denom);
        }
    }

    /* 
      Finite Blaschke products:
      https://en.wikipedia.org/wiki/Blaschke_product#Finite_Blaschke_products
      rationalBlaschke(z, complex numbers, multiplicity)
    */
    function rationalBlaschke(z, a) {

        let y = div({
            r: z.r - a.r,
            i: z.i - a.i
        }, {
            r: 1 - a.r * z.r - a.i * z.i,
            i: a.i * z.r - a.r * z.i
        });

        let f = div({
            r: Math.sqrt(a.r * a.r + a.i * a.i),
            i: 0
        }, {
            r: a.r,
            i: a.i
        });

        return mult(f, y);
    }

    function blaschke(z, iters) {

        var result = rationalBlaschke(z, values[0]),
            end = Math.floor(iters.r),
            n;

        if (end > 100 || end < 1) {
            return NaN;
        } else {

            for (n = 1; n < end; n++) {
                result = mult(result, rationalBlaschke(z, values[n]))
            }
            //let e = [];
            //for(let k = 0; k < 50; k++){
            //    e[k] = rationalBlaschke(z, values[k], mults[k]);
            //}

            //Multiply by a complex number z such that |z|<1
            return mult({
                r: 0.0256,
                i: 0.1321
            }, result);
        }
    }

    /*
     * ends new functions
     */



    function splitwords(tok) {
        var s = tok.text;
        var result = [];
        for (var begin = 0; begin < s.length;) {
            var found = false;
            for (var end = s.length; end > begin; --end) {
                var sub = s.substring(begin, end);
                if (symbols.hasOwnProperty(sub)) {
                    result.push({
                        spaced: begin == 0 && tok.spaced,
                        text: sub
                    });
                    begin = end;
                    found = true;
                    break;
                }
            }
            if (!found) {
                result.push({
                    spaced: begin == 0 && tok.spaced,
                    text: s.substring(begin)
                });
                break;
            }
        }
        return result;
    }

    function tokenize(s) {
        var rexp = /(\s*)(?:((?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?|\*\*|[-+()^|,*\/!]|[a-zA-Z_]+'?)|(\S.*))/g;
        var result = [];
        var match;
        while ((match = rexp.exec(s)) !== null) {
            if (match[3]) {
                return null;
            }
            if (match[2]) {
                var tok = {
                    spaced: match[1] && match[1].length > 0,
                    text: match[2]
                };
                if (/^\w/.exec(tok.text)) {
                    result.push.apply(result, splitwords(tok));
                } else {
                    result.push(tok);
                }
            }
        }
        return result;
    }

    function parsesum(state, inabs) {
        var root = null;
        var op = null;
        while (true) {
            var term = parseproduct(state, inabs);
            if (term === null) {
                return null;
            }
            if (root === null) {
                root = term;
            } else {
                root = compose(op, [root, term]);
            }
            if (state.j < state.tok.length) {
                var next = state.tok[state.j];
                if (next.text == '+' || next.text == '-') {
                    op = (next.text == '+' ? 'add' : 'sub');
                    state.j += 1;
                    continue;
                }
            }
            break;
        }
        return root;
    }

    function parseproduct(state, inabs) {
        var root = null;
        var auto = -1;
        var op = null;
        while (true) {
            var term = parseunary(state, auto >= 0, inabs);
            if (term === null) {
                return (state.j == auto) ? root : null;
            }
            if (root === null) {
                root = term;
            } else {
                root = compose(op, [root, term]);
            }
            if (state.j < state.tok.length) {
                var next = state.tok[state.j];
                if (next.text == '*' || next.text == '/') {
                    op = (next.text == '*' ? 'mult' : 'div');
                    state.j += 1;
                    auto = -1;
                    continue;
                } else if (!inabs || next.text != '|') {
                    op = 'mult';
                    auto = state.j;
                    continue;
                }
            }
            break;
        }
        return root;
    }

    function parseunary(state, noneg, inabs) {
        if (state.j < state.tok.length) {
            var next = state.tok[state.j];
            if (!noneg && next.text == '-') {
                state.j += 1;
                var term = parseunary(state, inabs);
                if (term === null) return null;
                return compose('neg', [term]);
            }
        }
        return parsetightproduct(state, inabs);
    }

    function parsetightproduct(state, inabs) {
        var root = null;
        var auto = -1;
        var op;
        while (true) {
            var term = parsepower(state, inabs);
            if (term === null) {
                return (state.j == auto) ? root : null;
            }
            if (root === null) {
                root = term;
            } else {
                root = compose('mult', [root, term]);
            }
            if (state.j < state.tok.length) {
                var next = state.tok[state.j];
                if (/^[\w\d\.]/.exec(next.text) && !next.spaced) {
                    auto = state.j
                    continue;
                }
            }
            break;
        }
        return root;
    }

    function parsepower(state, inabs) {
        var term = parsesuffixed(state, inabs);
        if (term === null) return null;
        if (state.j < state.tok.length) {
            var next = state.tok[state.j];
            if (next.text == '^' || next.text == '**') {
                state.j += 1;
                var expterm = parseunary(state, inabs);
                if (expterm === null) return null;
                return compose('pow', [term, expterm]);
            }
        }
        return term;
    }

    function parsesuffixed(state, inabs) {
        var term = parseunit(state);
        if (term === null) return null;
        var found = true;
        while (found) {
            found = false;
            if (state.j < state.tok.length &&
                state.tok[state.j].text == '*') {
                var ismult = true;
                if (state.j + 1 >= state.tok.length) {
                    ismult = false;
                } else {
                    var peek = state.tok[state.j + 1];
                    if (peek.text == ')' || peek.text == '*' ||
                        peek.text == '/' || peek.text == '+' ||
                        peek.text == '-' || peek.text == '^' ||
                        (inabs && peek.text == '|')) {
                        ismult = false;
                    }
                }
                if (!ismult) {
                    state.j += 1;
                    term = compose('conj', [term]);
                    found = true;
                }
            }
            if (state.j < state.tok.length &&
                state.tok[state.j].text == '!') {
                state.j += 1;
                term = compose('factorial', [term]);
                found = true;
            }
        }
        return term;
    }

    function parseunit(state) {
        if (state.j >= state.tok.length) {
            return null;
        }
        var next = state.tok[state.j];
        if (/^\d|\./.exec(next.text)) {
            state.j += 1;
            return composereal(parseFloat(next.text));
        }
        var result;
        if (/^\w/.exec(next.text)) {
            state.j += 1;
            if (state.j < state.tok.length &&
                state.tok[state.j].text == '(' &&
                funcs.hasOwnProperty(next.text)) {
                var paramcount = funcs[next.text];
                var params = [];
                state.j += 1;
                if (paramcount == 0) {
                    if (state.j >= state.tok.length || state.tok[state.j].text != ')') {
                        return null;
                    }
                    state.j += 1;
                }
                while (paramcount > 0) {
                    var param = parsesum(state, false);
                    if (param == null) {
                        return null;
                    }
                    params.push(param);
                    paramcount -= 1;
                    if (state.j >= state.tok.length ||
                        state.tok[state.j].text != (paramcount ? ',' : ')')) {
                        // implicit last param of 0,0,0...,'n' for loops
                        if (loops.hasOwnProperty(next.text) &&
                            state.j < state.tok.length &&
                            state.tok[state.j].text == ')') {
                            while (paramcount > 1) {
                                params.push(composereal(0));
                                paramcount -= 1;
                            }
                            params.push({
                                expr: 'n',
                                vars: {
                                    'n': 'n'
                                },
                                val: null
                            });
                            paramcount -= 1;
                        } else {
                            return null;
                        }
                    }
                    state.j += 1;
                }
                if (loops.hasOwnProperty(next.text)) {
                    var vs = {};
                    dictadd(vs, params[0].vars);
                    var funcdecl = 'function(z,n)';
                    delete vs['n'];
                    if (next.text == 'iter') {
                        funcdecl = 'function(z,zp,n)';
                        delete vs['z\''];
                    }
                    var args = ['z', funcdecl + '{return ' + params[0].expr + ';}']
                    for (var j = 1; j < params.length; ++j) {
                        dictadd(vs, params[j].vars);
                        args.push(params[j].expr);
                    }
                    return {
                        expr: next.text + '(' + args.join(',') + ')',
                        vars: vs,
                        val: null
                    };
                }
                var fname = next.text;
                if (syns.hasOwnProperty(fname)) {
                    fname = syns[fname];
                }
                return compose(fname, params);
            } else if (vars.hasOwnProperty(next.text)) {
                var vs = {};
                vs[next.text] = vars[next.text];
                return {
                    expr: vars[next.text],
                    vars: vs,
                    val: null
                };
            } else if (consts.hasOwnProperty(next.text)) {
                var vl = consts[next.text];
                return {
                    expr: '{r:' + vl.r + ',i:' + vl.i + '}',
                    vars: {},
                    val: vl
                };
            }
        }
        if (next.text == '(' || next.text == '|') {
            state.j += 1;
            result = parsesum(state, next.text == '|');
            if (state.j >= state.tok.length ||
                state.tok[state.j].text != (next.text == '|' ? '|' : ')')) {
                return null;
            }
            state.j += 1;
            if (next.text == '|') {
                return compose('modulus', [result]);
            }
            return result;
        }
        return null;
    }

    function composereal(r) {
        return {
            expr: '{r:' + r + ',i:0}',
            vars: {},
            val: {
                r: r,
                i: 0
            }
        };
    }

    function compose(fname, args) {
        var vs = {};
        var ae = [];
        var av = [];
        var vl = null;
        var valcount = 0;
        var fn = eval(fname);
        for (var j = 0; j < args.length; ++j) {
            dictadd(vs, args[j].vars);
            ae.push(args[j].expr);
            av.push(args[j].val);
            if (args[j].val !== null) ++valcount;
        }
        // Fold constants
        if (dictsize(vs) == 0 && valcount == args.length && args.length > 0) {
            vl = fn.apply(null, av);
            return {
                expr: '{r:' + vl.r + ',i:' + vl.i + '}',
                vars: vs,
                val: vl
            }
        }
        // Optimize real multiplication and division
        if ((fn === mult || fn === div) && isreal(1, av[1])) {
            return args[0];
        }
        if (fn === mult && av[0] !== null && av[0].i == 0) {
            if (isreal(1, av[0])) {
                return args[1];
            }
            return {
                expr: 'scale(' + av[0].r + ',' + ae[1] + ')',
                vars: vs,
                val: null
            }
        }
        if (fn === div && av[1] !== null && av[1].i == 0 && av[1].r != 0) {
            if (isreal(1, av[1])) {
                return args[1];
            }
            return {
                expr: 'scale(' + (1 / av[1].r) + ',' + ae[0] + ')',
                vars: vs,
                val: null
            }
        }
        if (fn === div && av[0] !== null && av[0].i == 0) {
            var r = compose('recip', [args[1]]);
            if (isreal(1, av[0])) {
                return r;
            }
            return {
                expr: 'scale(' + av[0].r + ',' + r.expr + ')',
                vars: vs,
                val: null
            }
        }
        // Optimize integral powers and natural exponentiation.
        if (fn === pow) {
            if (isreal(-1, av[1])) {
                return compose('recip', [args[0]]);
            }
            if (isreal(0, av[1])) {
                return composereal(1);
            }
            if (isreal(0.5, av[1])) {
                return compose('sqrt', [args[0]]);
            }
            if (isreal(1, av[1])) {
                return args[0];
            }
            if (isreal(2, av[1])) {
                return compose('square', [args[0]]);
            }
            if (isreal(3, av[1])) {
                return compose('cube', [args[0]]);
            }
            if (isreal(4, av[1])) {
                return compose('square', [compose('square', [args[0]])]);
            }
            if (isreal(5, av[1])) {
                return compose('p5', [args[0]]);
            }
            if (isreal(6, av[1])) {
                return compose('square', [compose('cube', [args[0]])]);
            }
            if (isreal(Math.E, av[0])) {
                return compose('exp', [args[1]]);
            }
        }
        // Apply the function at runtime.
        return {
            expr: fname + '(' + ae.join(',') + ')',
            vars: vs,
            val: null
        }
    }

    function isreal(r, c) {
        return c !== null && c.i == 0 && c.r == r;
    }

    function dictsize(dict) {
        var size = 0,
            key;
        for (key in dict)
            if (dict.hasOwnProperty(key)) ++size;
        return size;
    }

    function dictadd(d1, d2) {
        for (key in d2)
            if (d2.hasOwnProperty(key)) d1[key] = d2[key];
    }
    return run();
} 
// end of complex_expression