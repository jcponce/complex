/* 

This is the JavaScript parser for complex number formulae,
inspired by the work of David Bau, during snowstorm Nemo 2013.

Adapted and updated with new functions by Juan Carlos Ponce Campuzano 
in the Australian summer of 2019.

With minor corrections to the power complex and the inverse hyperbolic functions.

Under Creative Commons License
https://creativecommons.org/licenses/by-sa/4.0/

Last update 3-Jul-2020

https://javascript-minifier.com/

*/

let complex_expression = (s) => {

    const consts = {
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
        },
        phi: {
            r: (1 + Math.pow(5, 1 / 2)) / 2,
            i: 0
        },
        invphi: {
            r: (1 - Math.pow(5, 1 / 2)) / 2,
            i: 0
        }
    };

    let vars = {
        m: 'm',
        n: 'n',
        t: 't',
        r: 'r',
        s: 's',
        u: 'u',
        z: 'z',
        'z\'': 'zp'
    };

    let funcs = {
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
        binet: 1,
        joukowsky: 3,
        zeta: 1,
        dirichletEta: 1,
        binomial: 2,
        sn: 2,
        cn: 2,
        dn: 2,
        sum: 2,
        prod: 2,
        blaschke: 2,
        iter: 3
    };

    //Syntax for inverse trig functions
    let syns = {
        asin: 'arcsin',
        acos: 'arccos',
        atan: 'arctan'
    };

    let params = [{
            name: 't',
            defn: '{r:clts.slidert,i:0}', //'{r:par,i:0}',
            caption: (function (t) {
                return 't = ' + t.toFixed(3);
            })
        },
        {
            name: 'u',
            defn: '{r:Math.cos(clts.slideru),i:Math.sin(clts.slideru)}', //'{r:Math.cos(Math.PI*2*par),i:Math.sin(Math.PI*2*par)}',
            caption: (function (t) { // epislon added to avoid displaying "-0.00".
                var s = Math.sin(Math.PI * 2 * t) + 3e-16,
                    c = Math.cos(Math.PI * 2 * t) + 3e-16;
                return 'u = ' + c.toFixed(2) + (s >= 0 ? ' + ' : ' - ') +
                    Math.abs(s).toFixed(2) + 'i';
            })
        },
        {
            name: 'n',
            defn: '{r:clts.slidern,i:0}', //'{r:Math.floor(par*par*59 + 1.5),i:0}',
            caption: (function (t) {
                return 'n = ' + (Math.floor(t * t * 59 + 1.5));
            })
        },
        //The next two parameters are not included yet.
        {
            name: 's',
            defn: '{r:Math.sin(Math.PI*2*clts.slidert),i:0}', //'{r:Math.sin(Math.PI*2*par),i:0}',
            caption: (function (t) {
                return 's = ' + (Math.sin(Math.PI * 2 * t) + 3e-16).toFixed(3);
            })
        },
        {
            name: 'r',
            defn: '{r:0.5-Math.cos(Math.PI*2*clts.slidert)/2,i:0}', //'{r:0.5-Math.cos(Math.PI*2*par)/2,i:0}',
            caption: (function (t) {
                return 'r = ' + (.5 - Math.cos(Math.PI * 2 * t) / 2 + 3e-16).toFixed(3);
            })
        }
    ];

    let loops = {
        iter: 1,
        sum: 1,
        prod: 1,
    };

    let symbols = {}
    let factorials = [];

    //I need these arrays for Blaschke products
    let mds = [];
    let args = [];
    let values = [];
    let dk = [];

    let run = () => {
        dictadd(symbols, consts);
        dictadd(symbols, vars);
        dictadd(symbols, funcs);
        init_constants();
        init_ai(); //This is for Blaschke products
        init_dk();

        let state = {
            tok: tokenize(s),
            j: 0
        }
        if (state.tok === null) return null;
        let result = parsesum(state, false);
        if (result === null || state.j < state.tok.length) return null;
        let parameters = [];
        if (result.vars.hasOwnProperty('z\'')) return null;
        let fntext = '(function(z,par){';
        if (result.vars.hasOwnProperty('m')) {
            defns += 'let m = expi(z); '
        }
        for (let j = 0; j < params.length; ++j) {
            if (result.vars.hasOwnProperty(params[j].name)) {
                if (params[j].defn) {
                    fntext += 'let ' + params[j].name + '=' + params[j].defn + ';';
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

    let init_constants = _ => {
        factorials.push(1);
        for (let j = 0; j < 160; ++j) {
            factorials.push(factorials[factorials.length - 1] * factorials.length);
        }
    }

    //Constants for Blaschke products
    let init_ai = _ => {
        for (let i = 0; i < 100; i++) {
            mds[i] = Math.random();
            args[i] = 2 * Math.PI * Math.random();
            values[i] = {
                r: mds[i] * Math.cos(args[i]),
                i: mds[i] * Math.sin(args[i])
            }

        }
    }

    let init_dk = _ => {
        let dkr = [1];
        let n = 20;
        for (let i = 1; i <= n; i++) {
            // order of multiplication reduces overflow, but factorial overflows at 171
            dkr.push(dkr[i - 1] + n * factorials[n + i - 1] / factorials[n - i] / factorials[2 * i] * 4 ** i);
        }
        //let dc = [];
        for (let j = 0; j < dkr.length; j++) {
            // order of multiplication reduces overflow, but factorial overflows at 171
            dk[j] = {
                r: dkr[j],
                i: 0
            }
        }
    }

    //Calculates prime numbers 
    let primeFactorsTo = (max) => {
        let store = [],
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
    let random = () => {
        while (true) {
            let result = {
                r: Math.random() * 2 - 1,
                i: Math.random() * 2 - 1
            };
            if (modulussquared(result) < 1) {
                return result;
            }
        }
    }

    //Auxiliary functions

    let re = (z) => {
        return {
            r: z.r,
            i: 0
        };
    }

    let im = (z) => {
        return {
            r: z.i,
            i: 0
        };
    }

    let scale = (s, z) => {
        return {
            r: z.r * s,
            i: z.i * s
        };
    }

    let modulussquared = (z) => {
        return z.r * z.r + z.i * z.i;
    }

    let realmodulus = (z) => {
        return Math.sqrt(modulussquared(z));
    }

    let modulus = (z) => {
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

    let realarg = (z) => {
        return Math.atan2(z.i, z.r);
    }

    let arg = (z) => {
        return {
            r: realarg(z),
            i: 0
        };
    }

    //Basic arithmetic of complex numbers

    let add = (y, z) => {
        return {
            r: y.r + z.r,
            i: y.i + z.i
        };
    }

    let sub = (y, z) => {
        return {
            r: y.r - z.r,
            i: y.i - z.i
        };
    }

    let mult = (y, z) => {
        return {
            r: y.r * z.r - y.i * z.i,
            i: y.r * z.i + y.i * z.r
        };
    }

    let div = (y, z) => {
        var m2 = modulussquared(z);
        return {
            r: (y.r * z.r + y.i * z.i) / m2,
            i: (y.i * z.r - y.r * z.i) / m2
        };
    }

    let recip = (z) => {
        let m2 = modulussquared(z);
        return {
            r: z.r / m2,
            i: -z.i / m2
        };
    }

    let neg = (z) => {
        return {
            r: -z.r,
            i: -z.i
        };
    }

    let conj = (z) => {
        return {
            r: z.r,
            i: -z.i
        };
    }

    //Basic arithmetic of complex numbers ends

    //Draws a unit circle
    let disk = (z) => {
        if (realmodulus(z) > 1) {
            return NaN; //{r: -1,i: 0};
        }
        return {
            r: 1,
            i: 0
        };
    }

    //Elementary functions part 1

    let exp = (z) => {
        let er = Math.exp(z.r);
        return {
            r: er * Math.cos(z.i),
            i: er * Math.sin(z.i)
        };
    }

    let expi = (z) => {
        let er = Math.exp(-z.i);
        return {
            r: er * Math.cos(z.r),
            i: er * Math.sin(z.r)
        };
    }

    let log = (z) => {
        return {
            r: Math.log(realmodulus(z)),
            i: realarg(z)
        };
    }

    //Auxiliary real functions

    let realsinh = (x) => {
        return (-Math.exp(-x) + Math.exp(x)) / 2;
    }

    let realcosh = (x) => {
        return (Math.exp(-x) + Math.exp(x)) / 2;
    }

    let realtanh = (x) => {
        return (1 - Math.exp(-2 * x)) / (1 + Math.exp(-2 * x));
    }

    //Elementary functions part 2: Trigonometric hiperbolic functions

    let sin = (z) => {
        let er = Math.exp(z.i);
        let enr = 1 / er;
        return {
            r: (er + enr) * 0.5 * Math.sin(z.r),
            i: (er - enr) * 0.5 * Math.cos(z.r)
        };
    }

    let cos = (z) => {
        let er = Math.exp(z.i);
        let enr = 1 / er;
        return {
            r: (enr + er) * 0.5 * Math.cos(z.r),
            i: (enr - er) * 0.5 * Math.sin(z.r)
        };
    }

    let sec = (z) => {
        return recip(cos(z));
    }

    let csc = (z) => {
        return recip(sin(z));
    }

    let tan = (z) => {
        let er = Math.exp(z.i),
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

    let cot = (z) => {
        let er = Math.exp(z.i),
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

    let sinh = (z) => {
        return negitimes(sin(itimes(z)));
    }

    let cosh = (z) => {
        return cos(itimes(z));
    }

    let tanh = (z) => {
        return negitimes(tan(itimes(z)));
    }

    let coth = (z) => {
        return itimes(cot(itimes(z)));
    }

    let sech = (z) => {
        return sec(itimes(z));
    }

    let csch = (z) => {
        return itimes(csc(itimes(z)));
    }

    //Power functions
    let intpow = (y, c) => {
        if (c == 1) return y;
        if (c % 2 == 0) return square(intpow(y, c / 2));
        if (c % 3 == 0) return cube(intpow(y, c / 3));
        if (c % 5 == 0) return p5(intpow(y, c / 5));
        return mult(y, intpow(y, c - 1));
    }

    let realpow = (y, r) => {
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
        let arg = realarg(y) * r,
            modulus = Math.pow(realmodulus(y), r);
        return {
            r: modulus * Math.cos(arg),
            i: modulus * Math.sin(arg)
        };
    }

    //I think I don't need this function
    let powreal = (r, z) => {
        return exp(scale(Math.log(r * r), z));
    }

    //By definition z^c = exp(c * log(z)) or c^z = exp(z * log(c))
    //with c complex constant and z complex variable
    let pow = (y, z) => {
        //if (z.i == 0) {
        //    return realpow(y, z.r);
        //}
        //if (y.i == 0) {
        //    return powreal(y.r, z);
        //}
        return exp(mult(z, log(y)));
    }

    let floor = (z) => {
        return {
            r: Math.floor(z.r),
            i: Math.floor(z.i)
        };
    }

    let ceil = (z) => {
        return {
            r: Math.ceil(z.r),
            i: Math.ceil(z.i)
        };
    }

    let square = (z) => {
        let t = z.r * z.i;
        return {
            r: z.r * z.r - z.i * z.i,
            i: t + t
        };
    }

    let cube = (z) => {
        let r2 = z.r * z.r,
            i2 = z.i * z.i;
        return {
            r: z.r * (r2 - 3 * i2),
            i: z.i * (3 * r2 - i2)
        }
    }

    let p5 = (z) => {
        let r2 = z.r * z.r,
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

    let sqrt = (z) => {
        let a = Math.sqrt((Math.abs(z.r) + realmodulus(z)) / 2),
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

    let itimes = (z) => {
        return {
            r: -z.i,
            i: z.r
        };
    }

    let negitimes = (z) => {
        return {
            r: z.i,
            i: -z.r
        };
    }

    let oneminus = (z) => {
        return {
            r: 1 - z.r,
            i: -z.i
        };
    }

    let oneplus = (z) => {
        return {
            r: 1 + z.r,
            i: z.i
        };
    }

    let minusone = (z) => {
        return {
            r: z.r - 1,
            i: z.i
        };
    }

    //Inverse trigonometric functions

    let arcsin = (z) => {
        return negitimes(log(add(itimes(z), sqrt(oneminus(square(z))))));
    }

    let arccos = (z) => {
        return negitimes(log(add(z, itimes(sqrt(oneminus(square(z)))))));
    }

    let arctan = (z) => {
        return scale(0.5, itimes(
            sub(log(oneminus(itimes(z))), log(oneplus(itimes(z))))));
    }

    let arccot = (z) => {
        return arctan(recip(z));
    }

    let arcsec = (z) => {
        return arccos(recip(z));
    }

    let arccsc = (z) => {
        return arcsin(recip(z));
    }

    let arcsinh = (z) => {
        let opsz = oneplus(square(z));
        return log(add(z, scale(Math.sqrt(realmodulus(opsz)),
            exp({
                r: 0,
                i: realarg(opsz) / 2
            }))));
    }

    let arccosh = (z) => {
        let zplusone = {
            r: z.r + 1,
            i: z.i
        };
        let zminusone = {
            r: z.r - 1,
            i: z.i
        };
        let zpp = pow(zplusone, {
            r: 0.5,
            i: 0
        });
        let zmp = pow(zminusone, {
            r: 0.5,
            i: 0
        });
        let m = mult(zpp, zmp);
        return log(add(z, m));
    }

    let arctanh = (z) => {
        return scale(0.5, sub(log(oneplus(z)), log(oneminus(z))));
    }

    let arccoth = (z) => {
        return scale(0.5, sub(log(oneplus(z)), log(minusone(z))));
    }

    let arcsech = (z) => {
        return arccosh(div({
            r: 1,
            i: 0
        }, z));
    }

    let arccsch = (z) => {
        return negitimes(arccsc(negitimes(z)));
    }

    /*
      Binomial function
      https://en.wikipedia.org/wiki/Binomial_coefficient#Two_real_or_complex_valued_arguments
    */
    let binomial = (n, c) => {
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

    /*
      https://en.wikipedia.org/wiki/Factorial#The_gamma_and_pi_functions
    */
    let factorial = (z) => {
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

    /*
       Lanczos approximation of the Gamma function.
       https://en.wikipedia.org/wiki/Lanczos_approximation
    */
    let gamma = (z) => {
        let sqrt2pi = Math.sqrt(2 * Math.PI),
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
        let zmo = minusone(z),
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
    let sn = (z, k) => {
        if (typeof (k) == "object") {
            k = k.r;
        }
        let kp = Math.sqrt(1 - k * k),
            ju = realellipj(z.r, k),
            jv = realellipj(z.i, kp),
            denom = (1 - ju.dn * ju.dn * jv.sn * jv.sn);
        return {
            r: (ju.sn * jv.dn) / denom,
            i: (ju.cn * ju.dn * jv.sn * jv.cn) / denom
        };
    }

    let cn = (z, k) => {
        if (typeof (k) == "object") {
            k = k.r;
        }
        let kp = Math.sqrt(1 - k * k),
            ju = realellipj(z.r, k),
            jv = realellipj(z.i, kp),
            denom = (1 - ju.dn * ju.dn * jv.sn * jv.sn);
        return {
            r: (ju.cn * jv.cn) / denom,
            i: -(ju.sn * ju.dn * jv.sn * jv.dn) / denom
        };
    }

    let dn = (z, k) => {
        if (typeof (k) == "object") {
            k = k.r;
        }
        let kp = Math.sqrt(1 - k * k),
            ju = realellipj(z.r, k),
            jv = realellipj(z.i, kp),
            denom = (1 - ju.dn * ju.dn * jv.sn * jv.sn);
        return {
            r: (ju.dn * jv.cn * jv.dn) / denom,
            i: -(k * k * ju.sn * ju.cn * jv.sn) / denom
        };
    }

    let realellipj = (u, m) => {
        /* Jacobi elliptical functions, real form, expressed in Javascript. */
        /* adapted from C Cephes library, ellipj.c, by Stephen L. Moshier */
        /* http://lists.debian.org/debian-legal/2004/12/msg00295.html */
        let ai, aj, b, phi, twon, a = [],
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
     
      1. prod(expr, iters)
     
      2. mobius( expr, a, b, c, d) 

      3. psymbol(z, n>=0) 
      
      4. blaschke(z, number of multiples) 

     */

    /*
    Now some auxiliary functions to have partial sums or 
    partial multiplications and iterations
    */

    let sum = (z, fn, iters) => {
        let r = 0,
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

    let iter = (z, fn, start, iters) => {
        let result = start,
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

    let prod = (z, fn, iters) => {
        let result = fn(z, {
                r: 1,
                i: 0
            }),
            end = Math.floor(iters.r),
            n;

        if (end < 1) {
            alert("Enter an integer greater than 1");
            return null;
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

      This function is for calculating Hypergeometric functions: 
      https://en.wikipedia.org/wiki/Hypergeometric_function

      e.g. sum( psymbol(2-3i, n) * (z)^n/n!, 20)
      
    */
    let psymbol = (z, iters) => {

        let result = {
            r: 1,
            i: 0
        };
        let end = Math.floor(iters.r),
            n;
        if (end < 0) {
            alert("Enter an integer greater than or equal to 0");
            return null;
        } else if (end === 0) {
            return {
                r: 1,
                i: 0
            };
        } else {
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
    let mobius = (z, a, b, c, d) => {

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
            alert("Sorry, not valid 😟 Recall that ad − bc ≠ 0");
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
    let rationalBlaschke = (z, a) => {

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

    let blaschke = (z, iters) => {

        let result = rationalBlaschke(z, values[0]),
            end = Math.floor(iters.r),
            n;

        if (end > 100 || end < 1) {
            alert("Enter an integer between 1 and 100");
            return null;
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

    //Binet's formula 
    //https://mathworld.wolfram.com/BinetsFibonacciNumberFormula.html
    //1/5^(1/2)*((1/2+5^(1/2)/2)^z-(1/2-5^(1/2)/2)^z)

    let binet = (z) => {
        let c = 1 / Math.pow(5, 1 / 2);
        return scale(c, sub(pow(consts.phi, z), pow(consts.invphi, z)));
    }

    let joukowsky = (z, c, rd) => {
        /*
        a=1;
        r=0.23*sqrt(13*2);
        center=-0.15+0.23*i;
        z1=(z-sqrt(z^2-4))/2;
        z2=(z+sqrt(z^2-4))/2;
        z=(1-T)*z+T*if(|z1-center|>|z2-center|,z1,z2);
        z=(z-center)/r;
        if(|z|<|a|,0,(U*z+(U*a^2)/z-(i*C)/(2*pi)*log(z)))/10;
        */
        let a = {
            r: 1,
            i: 0
        };
        let ra = {
            r: rd.r, //0.23 * Math.sqrt(13 * 2),
            i: 0
        };
        let center = {
            r: c.r, //-0.15,
            i: c.i //0.23
        };

        let sq = sqrt(sub(square(z), {
            r: 4,
            i: 0
        }));
        let z1 = div(sub(z, sq), {
            r: 2,
            i: 0
        });
        let z2 = div(add(z, sq), {
            r: 2,
            i: 0
        });

        let d1 = sub(z1, center);
        let d2 = sub(z2, center);

        let za;

        if (realmodulus(d1) > realmodulus(d2)) {
            za = div(sub(z1, center), ra);
        } else {
            za = div(sub(z2, center), ra);
        }

        if (realmodulus(za) < realmodulus(a)) {
            return NaN;
        }
        return add(za, div(a, za));

    }

    let abs = (z) => {
        if (z.r === 0 && z.i === 0) return 0;

        if (Math.abs(z.r) < Math.abs(z.i))

            return Math.abs(z.i) * Math.sqrt(1 + (z.r / z.i) ** 2);

        else

            return Math.abs(z.r) * Math.sqrt(1 + (z.i / z.r) ** 2);
    }

    /*
        Riemann zeta function
        https://en.wikipedia.org/wiki/Riemann_zeta_function

        Borwein algorithm
        http://www.cecm.sfu.ca/personal/pborwein/PAPERS/P155.pdf
    */
    let zeta = (z) => {

        let n = 20;
        //let tolerance = 1e-10;
        let two = {
            r: 2,
            i: 0
        };
        let one = {
            r: 1,
            i: 0
        };
        let minusone = {
            r: -1,
            i: 0
        };

        //Not sure if I need this
        //if (z.i !== 0)
         //   n = Math.max(n, Math.ceil(Math.log(2 / abs(gamma(z)) / tolerance) / Math.log(3 + Math.sqrt(8))));

        if (z.r < 0) {
            let f1 = mult(pow(two, z), pow(consts.pi, sub(z, one)));
            let f2 = mult(sin(mult(div(consts.pi, two), z)), gamma(sub(one, z)));
            let f3 = mult(f2, zeta(sub(one, z)));
            return mult(f1, f3);

        } else {
            let s = {
                r: 0,
                i: 0
            };
            for (var l = 0; l < n; l++) {
                let kc = {
                    r: l,
                    i: 0
                }
                s = add(s, div(mult(pow((minusone), kc), sub(dk[l], dk[n])), pow(add(kc, one), z)));
            }
            return div(div(s, mult(minusone, dk[n])), sub(one, pow(two, sub(one, z))));
        }
    }

    let dirichletEta = (z) => {
        let one = {
            r: 1,
            i: 0
        };
        let two = {
            r: 2,
            i: 0
        };
        return mult(zeta(z), sub(one, pow(two, sub(one, z))));
    }


    /*
      ends new functions
     */

    /*
    The following are parsing functions for all 
    the basic arithmetic of complex numbers
    */

    let splitwords = (tok) => {
        let s = tok.text;
        let result = [];
        for (let begin = 0; begin < s.length;) {
            let found = false;
            for (let end = s.length; end > begin; --end) {
                let sub = s.substring(begin, end);
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

    let tokenize = (s) => {
        let rexp = /(\s*)(?:((?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?|\*\*|[-+()^|,*\/!]|[a-zA-Z_]+'?)|(\S.*))/g;
        let result = [];
        let match;
        while ((match = rexp.exec(s)) !== null) {
            if (match[3]) {
                return null;
            }
            if (match[2]) {
                let tok = {
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

    let parsesum = (state, inabs) => {
        let root = null;
        let op = null;
        while (true) {
            let term = parseproduct(state, inabs);
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

    let parseproduct = (state, inabs) => {
        let root = null;
        let auto = -1;
        let op = null;
        while (true) {
            let term = parseunary(state, auto >= 0, inabs);
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

    let parseunary = (state, noneg, inabs) => {
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

    let parsetightproduct = (state, inabs) => {
        let root = null;
        let auto = -1;
        let op;
        while (true) {
            let term = parsepower(state, inabs);
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

    let parsepower = (state, inabs) => {
        let term = parsesuffixed(state, inabs);
        if (term === null) return null;
        if (state.j < state.tok.length) {
            let next = state.tok[state.j];
            if (next.text == '^' || next.text == '**') {
                state.j += 1;
                let expterm = parseunary(state, inabs);
                if (expterm === null) return null;
                return compose('pow', [term, expterm]);
            }
        }
        return term;
    }

    let parsesuffixed = (state, inabs) => {
        let term = parseunit(state);
        if (term === null) return null;
        let found = true;
        while (found) {
            found = false;
            if (state.j < state.tok.length &&
                state.tok[state.j].text == '*') {
                let ismult = true;
                if (state.j + 1 >= state.tok.length) {
                    ismult = false;
                } else {
                    let peek = state.tok[state.j + 1];
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

    let parseunit = (state) => {
        if (state.j >= state.tok.length) {
            return null;
        }
        let next = state.tok[state.j];
        if (/^\d|\./.exec(next.text)) {
            state.j += 1;
            return composereal(parseFloat(next.text));
        }
        let result;
        if (/^\w/.exec(next.text)) {
            state.j += 1;
            if (state.j < state.tok.length &&
                state.tok[state.j].text == '(' &&
                funcs.hasOwnProperty(next.text)) {
                let paramcount = funcs[next.text];
                let params = [];
                state.j += 1;
                if (paramcount == 0) {
                    if (state.j >= state.tok.length || state.tok[state.j].text != ')') {
                        return null;
                    }
                    state.j += 1;
                }
                while (paramcount > 0) {
                    let param = parsesum(state, false);
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
                    let vs = {};
                    dictadd(vs, params[0].vars);
                    let funcdecl = 'function(z,n)';
                    delete vs['n'];
                    if (next.text == 'iter') {
                        funcdecl = 'function(z,zp,n)';
                        delete vs['z\''];
                    }
                    let args = ['z', funcdecl + '{return ' + params[0].expr + ';}']
                    for (let j = 1; j < params.length; ++j) {
                        dictadd(vs, params[j].vars);
                        args.push(params[j].expr);
                    }
                    return {
                        expr: next.text + '(' + args.join(',') + ')',
                        vars: vs,
                        val: null
                    };
                }
                let fname = next.text;
                if (syns.hasOwnProperty(fname)) {
                    fname = syns[fname];
                }
                return compose(fname, params);
            } else if (vars.hasOwnProperty(next.text)) {
                let vs = {};
                vs[next.text] = vars[next.text];
                return {
                    expr: vars[next.text],
                    vars: vs,
                    val: null
                };
            } else if (consts.hasOwnProperty(next.text)) {
                let vl = consts[next.text];
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

    let composereal = (r) => {
        return {
            expr: '{r:' + r + ',i:0}',
            vars: {},
            val: {
                r: r,
                i: 0
            }
        };
    }

    let compose = (fname, args) => {
        let vs = {};
        let ae = [];
        let av = [];
        let vl = null;
        let valcount = 0;
        let fn = eval(fname);
        for (let j = 0; j < args.length; ++j) {
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
            let r = compose('recip', [args[1]]);
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

    let isreal = (r, c) => {
        return c !== null && c.i == 0 && c.r == r;
    }

    let dictsize = (dict) => {
        let size = 0,
            key;
        for (key in dict)
            if (dict.hasOwnProperty(key)) ++size;
        return size;
    }

    let dictadd = (d1, d2) => {
        for (key in d2)
            if (d2.hasOwnProperty(key)) d1[key] = d2[key];
    }

    //Finally, let's run everything! :)
    return run();
}
// end of complex_expression