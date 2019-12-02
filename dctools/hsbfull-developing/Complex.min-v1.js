function complex_expression(s){var consts={i:{r:0,i:1},pi:{r:Math.PI,i:0},e:{r:Math.E,i:0}},vars={m:"m",n:"n",t:"t",r:"r",s:"s",u:"u",z:"z","z'":"zp"},funcs={random:0,re:1,im:1,modulus:1,arg:1,recip:1,neg:1,conj:1,disk:1,floor:1,ceil:1,square:1,cube:1,sqrt:1,exp:1,log:1,sin:1,cos:1,tan:1,cot:1,sec:1,csc:1,sinh:1,cosh:1,tanh:1,coth:1,sech:1,csch:1,asin:1,acos:1,atan:1,arcsin:1,arccos:1,arctan:1,arccot:1,arcsec:1,arccsc:1,arcsinh:1,arccosh:1,arctanh:1,arccoth:1,arcsech:1,arccsch:1,gamma:1,pow:2,binomial:2,sn:2,cn:2,dn:2,sum:2,multIter:2,iter:3},syns={asin:"arcsin",acos:"arccos",atan:"arctan"},params=[{name:"t",defn:"{r:par,i:0}",caption:function(r){return"t = "+r.toFixed(3)}},{name:"u",defn:"{r:Math.cos(Math.PI*2*par),i:Math.sin(Math.PI*2*par)}",caption:function(r){var t=Math.sin(2*Math.PI*r)+3e-16;return"u = "+(Math.cos(2*Math.PI*r)+3e-16).toFixed(2)+(t>=0?" + ":" - ")+Math.abs(t).toFixed(2)+"i"}},{name:"n",defn:"{r:Math.floor(par*par*59 + 1.5),i:0}",caption:function(r){return"n = "+Math.floor(r*r*59+1.5)}},{name:"s",defn:"{r:Math.sin(Math.PI*2*par),i:0}",caption:function(r){return"s = "+(Math.sin(2*Math.PI*r)+3e-16).toFixed(3)}},{name:"r",defn:"{r:0.5-Math.cos(Math.PI*2*par)/2,i:0}",caption:function(r){return"r = "+(.5-Math.cos(2*Math.PI*r)/2+3e-16).toFixed(3)}}],loops={iter:1,sum:1,multIter:1},symbols={},factorials=[];function run(){dictadd(symbols,consts),dictadd(symbols,vars),dictadd(symbols,funcs),init_constants();var state={tok:tokenize(s),j:0};if(null===state.tok)return null;var result=parsesum(state,!1);if(null===result||state.j<state.tok.length)return null;var parameters=[];if(result.vars.hasOwnProperty("z'"))return null;var fntext="(function(z,par){";result.vars.hasOwnProperty("m")&&(defns+="var m = expi(z); ");for(var j=0;j<params.length;++j)result.vars.hasOwnProperty(params[j].name)&&(params[j].defn&&(fntext+="var "+params[j].name+"="+params[j].defn+";"),parameters.push({name:params[j].name,caption:params[j].caption}));return fntext+="return "+result.expr+";})",{fn:eval(fntext),fntext:fntext,parameters:parameters}}function init_constants(){factorials.push(1);for(var r=0;r<160;++r)factorials.push(factorials[factorials.length-1]*factorials.length)}function random(){for(;;){var r={r:2*Math.random()-1,i:2*Math.random()-1};if(modulussquared(r)<1)return r}}function re(r){return{r:r.r,i:0}}function im(r){return{r:r.i,i:0}}function scale(r,t){return{r:t.r*r,i:t.i*r}}function modulussquared(r){return r.r*r.r+r.i*r.i}function realmodulus(r){return Math.sqrt(modulussquared(r))}function modulus(r){return 0==r.i?{r:Math.abs(r.r),i:0}:{r:realmodulus(r),i:0}}function realarg(r){return Math.atan2(r.i,r.r)}function arg(r){return{r:realarg(r),i:0}}function add(r,t){return{r:r.r+t.r,i:r.i+t.i}}function sub(r,t){return{r:r.r-t.r,i:r.i-t.i}}function mult(r,t){return{r:r.r*t.r-r.i*t.i,i:r.r*t.i+r.i*t.r}}function div(r,t){var n=modulussquared(t);return{r:(r.r*t.r+r.i*t.i)/n,i:(r.i*t.r-r.r*t.i)/n}}function recip(r){var t=modulussquared(r);return{r:r.r/t,i:-r.i/t}}function neg(r){return{r:-r.r,i:-r.i}}function conj(r){return{r:r.r,i:-r.i}}function disk(r){return realmodulus(r)>1?{r:0,i:0}:{r:1,i:0}}function exp(r){var t=Math.exp(r.r);return{r:t*Math.cos(r.i),i:t*Math.sin(r.i)}}function expi(r){var t=Math.exp(-r.i);return{r:t*Math.cos(r.r),i:t*Math.sin(r.r)}}function log(r){return{r:Math.log(realmodulus(r)),i:realarg(r)}}function realsinh(r){return(-Math.exp(-r)+Math.exp(r))/2}function realcosh(r){return(Math.exp(-r)+Math.exp(r))/2}function realtanh(r){return(1-Math.exp(-2*r))/(1+Math.exp(-2*r))}function sin(r){var t=Math.exp(r.i),n=1/t;return{r:.5*(t+n)*Math.sin(r.r),i:.5*(t-n)*Math.cos(r.r)}}function cos(r){var t=Math.exp(r.i),n=1/t;return{r:.5*(n+t)*Math.cos(r.r),i:.5*(n-t)*Math.sin(r.r)}}function sec(r){return recip(cos(r))}function csc(r){return recip(sin(r))}function tan(r){var t=Math.exp(r.i),n=1/t,e=t+n,a=t-n,i=Math.sin(r.r),s=Math.cos(r.r);return div({r:e*i,i:a*s},{r:e*s,i:-a*i})}function cot(r){var t=Math.exp(r.i),n=1/t,e=t+n,a=t-n,i=Math.sin(r.r),s=Math.cos(r.r);return div({r:e*s,i:-a*i},{r:e*i,i:a*s})}function sinh(r){return negitimes(sin(itimes(r)))}function cosh(r){return cos(itimes(r))}function tanh(r){return negitimes(tan(itimes(r)))}function coth(r){return itimes(cot(itimes(r)))}function sech(r){return sec(itimes(r))}function csch(r){return itimes(csc(itimes(r)))}function intpow(r,t){return 1==t?r:t%2==0?square(intpow(r,t/2)):t%3==0?cube(intpow(r,t/3)):t%5==0?p5(intpow(r,t/5)):mult(r,intpow(r,t-1))}function realpow(r,t){if(t==Math.floor(t)){if(t>0&&t<=64)return intpow(r,t);if(t<0&&t>=-64)return recip(intpow(r,-t));if(0==t)return{r:1,i:0}}var n=realarg(r)*t,e=Math.pow(realmodulus(r),t);return{r:e*Math.cos(n),i:e*Math.sin(n)}}function powreal(r,t){return exp(scale(Math.log(r),t))}function pow(r,t){return 0==t.i?realpow(r,t.r):0==r.i?powreal(r.r,t):exp(mult(log(r),t))}function floor(r){return{r:Math.floor(r.r),i:Math.floor(r.i)}}function ceil(r){return{r:Math.ceil(r.r),i:Math.ceil(r.i)}}function square(r){var t=r.r*r.i;return{r:r.r*r.r-r.i*r.i,i:t+t}}function cube(r){var t=r.r*r.r,n=r.i*r.i;return{r:r.r*(t-3*n),i:r.i*(3*t-n)}}function p5(r){var t=r.r*r.r,n=r.i*r.i,e=t*n,a=e+e,i=t*t,s=n*n;return{r:r.r*(i+5*(s-a)),i:r.i*(s+5*(i-a))}}function sqrt(r){var t=Math.sqrt((Math.abs(r.r)+realmodulus(r))/2),n=r.i/t/2;return r.r<0?r.i<0?{r:-n,i:-t}:{r:n,i:t}:{r:t,i:n}}function itimes(r){return{r:-r.i,i:r.r}}function negitimes(r){return{r:r.i,i:-r.r}}function oneminus(r){return{r:1-r.r,i:-r.i}}function oneplus(r){return{r:1+r.r,i:r.i}}function minusone(r){return{r:r.r-1,i:r.i}}function arcsin(r){return negitimes(log(add(itimes(r),sqrt(oneminus(square(r))))))}function arccos(r){return negitimes(log(add(r,itimes(sqrt(oneminus(square(r)))))))}function arctan(r){return scale(.5,itimes(sub(log(oneminus(itimes(r))),log(oneplus(itimes(r))))))}function arccot(r){return arctan(recip(r))}function arcsec(r){return arccos(recip(r))}function arccsc(r){return arcsin(recip(r))}function arcsinh(r){var t=oneplus(square(r));return log(add(r,scale(Math.sqrt(realmodulus(t)),exp({r:0,i:realarg(t)/2}))))}function arccosh(r){var t=minusone(square(r));return log(add(r,scale(Math.sqrt(realmodulus(t)),exp({r:0,i:realarg(t)/2}))))}function arctanh(r){return scale(.5,sub(log(oneplus(r)),log(oneminus(r))))}function arccoth(r){return scale(.5,sub(log(oneplus(r)),log(minusone(r))))}function arcsech(r){return negitimes(arcsec(r))}function arccsch(r){return negitimes(arccsc(negitimes(r)))}function binomial(r,t){if(0==r.i&&r.r==Math.floor(r.r)&&r.r>=0&&0==t.i&&t.r==Math.floor(t.r)&&t.r>=0&&t.r<=r.r){if(r.r<21)return{r:factorials[r.r]/factorials[t.r]/factorials[r.r-t.r],i:0};var n,e=Math.min(t.r,r.r-t.r),a=r.r,i=1;for(n=1;n<=e;++n)i=i*(a-(e-n))/n;return{r:i,i:0}}return div(gamma(oneplus(r)),mult(gamma(oneplus(t)),gamma(oneplus(sub(r,t)))))}function factorial(r){return 0==r.i&&r.r==Math.floor(r.r)&&r.r>=0&&r.r<factorials.length?{r:factorials[r.r],i:0}:gamma(oneplus(r))}function gamma(r){var t=Math.sqrt(2*Math.PI),n=[.9999999999998099,676.5203681218851,-1259.1392167224028,771.3234287776531,-176.6150291621406,12.507343278686905,-.13857109526572012,9984369578019572e-21,1.5056327351493116e-7];if(r.r<.5)return scale(Math.PI,recip(mult(sin(scale(Math.PI,r)),gamma(oneminus(r)))));var e,a,i=minusone(r),s={r:n[0],i:0};for(e=1;e<9;++e)s=add(s,scale(n[e],recip({r:i.r+e,i:i.i})));return scale(t,mult(mult(pow(a={r:i.r+7+.5,i:i.i},{r:i.r+.5,i:i.i}),exp(neg(a))),s))}function sn(r,t){"object"==typeof t&&(t=t.r);var n=Math.sqrt(1-t*t),e=realellipj(r.r,t),a=realellipj(r.i,n),i=1-e.dn*e.dn*a.sn*a.sn;return{r:e.sn*a.dn/i,i:e.cn*e.dn*a.sn*a.cn/i}}function cn(r,t){"object"==typeof t&&(t=t.r);var n=Math.sqrt(1-t*t),e=realellipj(r.r,t),a=realellipj(r.i,n),i=1-e.dn*e.dn*a.sn*a.sn;return{r:e.cn*a.cn/i,i:-e.sn*e.dn*a.sn*a.dn/i}}function dn(r,t){"object"==typeof t&&(t=t.r);var n=Math.sqrt(1-t*t),e=realellipj(r.r,t),a=realellipj(r.i,n),i=1-e.dn*e.dn*a.sn*a.sn;return{r:e.dn*a.cn*a.dn/i,i:-t*t*e.sn*e.cn*a.sn/i}}function sum(r,t,n){var e,a,i=0,s=0,u=Math.floor(n.r);for(e=0;e<u;++e)i+=(a=t(r,{r:e,i:0})).r,s+=a.i;return{r:i,i:s}}function multIter(r,t,n){var e,a=t(r,{r:0,i:0}),i=Math.floor(n.r);for(e=1;e<i;++e)a=mult(a,t(r,{r:e,i:0}));return a}function iter(r,t,n,e){var a,i=n,s=Math.floor(e.r);for(a=0;a<s;++a)i=t(r,i,{r:a,i:0});return i}function realellipj(r,n){var e,a,i,s,u,o,c=[],l=[];if(n<0||n>1)return{sn:NaN,cn:NaN,ph:NaN,dn:NaN};if(n<1e-9)return t=Math.sin(r),i=Math.cos(r),e=.25*n*(r-t*i),{sn:t-e*i,cn:i+e*t,ph:r-e,dn:1-.5*n*t*t};if(n>=.9999999999)return e=.25*(1-n),i=realcosh(r),t=realtanh(r),s=1/i,a=e*t*s,u=i*realsinh(r),{sn:t+e*(u-r)/(i*i),ph:2*Math.atan(Math.exp(r))-Math.PI/2+e*(u-r)/i,cn:s-a*(u-r),dn:s+a*(u+r)};for(c[0]=1,i=Math.sqrt(1-n),l[0]=Math.sqrt(n),u=1,o=0;Math.abs(l[o]/c[o])>2.22045e-16&&o<8;)e=c[o],l[++o]=(e-i)/2,t=Math.sqrt(e*i),c[o]=(e+i)/2,i=t,u*=2;s=u*c[o]*r;do{t=l[o]*Math.sin(s)/c[o],i=s,s=(Math.asin(t)+s)/2}while(--o);return t=Math.cos(s),{sn:Math.sin(s),cn:t,dn:t/Math.cos(s-i),ph:s}}function splitwords(r){for(var t=r.text,n=[],e=0;e<t.length;){for(var a=!1,i=t.length;i>e;--i){var s=t.substring(e,i);if(symbols.hasOwnProperty(s)){n.push({spaced:0==e&&r.spaced,text:s}),e=i,a=!0;break}}if(!a){n.push({spaced:0==e&&r.spaced,text:t.substring(e)});break}}return n}function tokenize(r){for(var t,n=/(\s*)(?:((?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?|\*\*|[-+()^|,*\/!]|[a-zA-Z_]+'?)|(\S.*))/g,e=[];null!==(t=n.exec(r));){if(t[3])return null;if(t[2]){var a={spaced:t[1]&&t[1].length>0,text:t[2]};/^\w/.exec(a.text)?e.push.apply(e,splitwords(a)):e.push(a)}}return e}function parsesum(r,t){for(var n=null,e=null;;){var a=parseproduct(r,t);if(null===a)return null;if(n=null===n?a:compose(e,[n,a]),r.j<r.tok.length){var i=r.tok[r.j];if("+"==i.text||"-"==i.text){e="+"==i.text?"add":"sub",r.j+=1;continue}}break}return n}function parseproduct(r,t){for(var n=null,e=-1,a=null;;){var i=parseunary(r,e>=0,t);if(null===i)return r.j==e?n:null;if(n=null===n?i:compose(a,[n,i]),r.j<r.tok.length){var s=r.tok[r.j];if("*"==s.text||"/"==s.text){a="*"==s.text?"mult":"div",r.j+=1,e=-1;continue}if(!t||"|"!=s.text){a="mult",e=r.j;continue}}break}return n}function parseunary(r,t,n){if(r.j<r.tok.length){var e=r.tok[r.j];if(!t&&"-"==e.text){r.j+=1;var a=parseunary(r,n);return null===a?null:compose("neg",[a])}}return parsetightproduct(r,n)}function parsetightproduct(r,t){for(var n=null,e=-1;;){var a=parsepower(r,t);if(null===a)return r.j==e?n:null;if(n=null===n?a:compose("mult",[n,a]),r.j<r.tok.length){var i=r.tok[r.j];if(/^[\w\d\.]/.exec(i.text)&&!i.spaced){e=r.j;continue}}break}return n}function parsepower(r,t){var n=parsesuffixed(r,t);if(null===n)return null;if(r.j<r.tok.length){var e=r.tok[r.j];if("^"==e.text||"**"==e.text){r.j+=1;var a=parseunary(r,t);return null===a?null:compose("pow",[n,a])}}return n}function parsesuffixed(r,t){var n=parseunit(r);if(null===n)return null;for(var e=!0;e;){if(e=!1,r.j<r.tok.length&&"*"==r.tok[r.j].text){var a=!0;if(r.j+1>=r.tok.length)a=!1;else{var i=r.tok[r.j+1];(")"==i.text||"*"==i.text||"/"==i.text||"+"==i.text||"-"==i.text||"^"==i.text||t&&"|"==i.text)&&(a=!1)}a||(r.j+=1,n=compose("conj",[n]),e=!0)}r.j<r.tok.length&&"!"==r.tok[r.j].text&&(r.j+=1,n=compose("factorial",[n]),e=!0)}return n}function parseunit(r){if(r.j>=r.tok.length)return null;var t,n=r.tok[r.j];if(/^\d|\./.exec(n.text))return r.j+=1,composereal(parseFloat(n.text));if(/^\w/.exec(n.text)){if(r.j+=1,r.j<r.tok.length&&"("==r.tok[r.j].text&&funcs.hasOwnProperty(n.text)){var e=funcs[n.text],a=[];if(r.j+=1,0==e){if(r.j>=r.tok.length||")"!=r.tok[r.j].text)return null;r.j+=1}for(;e>0;){var i=parsesum(r,!1);if(null==i)return null;if(a.push(i),e-=1,r.j>=r.tok.length||r.tok[r.j].text!=(e?",":")")){if(!(loops.hasOwnProperty(n.text)&&r.j<r.tok.length&&")"==r.tok[r.j].text))return null;for(;e>1;)a.push(composereal(0)),e-=1;a.push({expr:"n",vars:{n:"n"},val:null}),e-=1}r.j+=1}if(loops.hasOwnProperty(n.text)){dictadd(l={},a[0].vars);var s="function(z,n)";delete l.n,"iter"==n.text&&(s="function(z,zp,n)",delete l["z'"]);for(var u=["z",s+"{return "+a[0].expr+";}"],o=1;o<a.length;++o)dictadd(l,a[o].vars),u.push(a[o].expr);return{expr:n.text+"("+u.join(",")+")",vars:l,val:null}}var c=n.text;return syns.hasOwnProperty(c)&&(c=syns[c]),compose(c,a)}var l;if(vars.hasOwnProperty(n.text))return(l={})[n.text]=vars[n.text],{expr:vars[n.text],vars:l,val:null};if(consts.hasOwnProperty(n.text)){var f=consts[n.text];return{expr:"{r:"+f.r+",i:"+f.i+"}",vars:{},val:f}}}return"("==n.text||"|"==n.text?(r.j+=1,t=parsesum(r,"|"==n.text),r.j>=r.tok.length||r.tok[r.j].text!=("|"==n.text?"|":")")?null:(r.j+=1,"|"==n.text?compose("modulus",[t]):t)):null}function composereal(r){return{expr:"{r:"+r+",i:0}",vars:{},val:{r:r,i:0}}}function compose(fname,args){for(var vs={},ae=[],av=[],vl=null,valcount=0,fn=eval(fname),j=0;j<args.length;++j)dictadd(vs,args[j].vars),ae.push(args[j].expr),av.push(args[j].val),null!==args[j].val&&++valcount;if(0==dictsize(vs)&&valcount==args.length&&args.length>0)return vl=fn.apply(null,av),{expr:"{r:"+vl.r+",i:"+vl.i+"}",vars:vs,val:vl};if((fn===mult||fn===div)&&isreal(1,av[1]))return args[0];if(fn===mult&&null!==av[0]&&0==av[0].i)return isreal(1,av[0])?args[1]:{expr:"scale("+av[0].r+","+ae[1]+")",vars:vs,val:null};if(fn===div&&null!==av[1]&&0==av[1].i&&0!=av[1].r)return isreal(1,av[1])?args[1]:{expr:"scale("+1/av[1].r+","+ae[0]+")",vars:vs,val:null};if(fn===div&&null!==av[0]&&0==av[0].i){var r=compose("recip",[args[1]]);return isreal(1,av[0])?r:{expr:"scale("+av[0].r+","+r.expr+")",vars:vs,val:null}}if(fn===pow){if(isreal(-1,av[1]))return compose("recip",[args[0]]);if(isreal(0,av[1]))return composereal(1);if(isreal(.5,av[1]))return compose("sqrt",[args[0]]);if(isreal(1,av[1]))return args[0];if(isreal(2,av[1]))return compose("square",[args[0]]);if(isreal(3,av[1]))return compose("cube",[args[0]]);if(isreal(4,av[1]))return compose("square",[compose("square",[args[0]])]);if(isreal(5,av[1]))return compose("p5",[args[0]]);if(isreal(6,av[1]))return compose("square",[compose("cube",[args[0]])]);if(isreal(Math.E,av[0]))return compose("exp",[args[1]])}return{expr:fname+"("+ae.join(",")+")",vars:vs,val:null}}function isreal(r,t){return null!==t&&0==t.i&&t.r==r}function dictsize(r){var t,n=0;for(t in r)r.hasOwnProperty(t)&&++n;return n}function dictadd(r,t){for(key in t)t.hasOwnProperty(key)&&(r[key]=t[key])}return run()}
