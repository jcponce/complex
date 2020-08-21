/* Written in p5.js (https://p5js.org/)
 * Under Creative Commons License
 * https://creativecommons.org/licenses/by-sa/4.0/
 * Written by Juan Carlos Ponce Campuzano, 12-Nov-2018
 
 * Last update 17-Aug-2020
 */

let domC, s, w, h, cnv, sel;

let input = 'log(z)';

function setup() {
  cnv = createCanvas(500, 500);
  cnv.parent('sketch-Holder');

  sel = createSelect();
  sel.parent('mySelect');
  sel.option('Real');
  sel.option('Imaginary');
  sel.option('Re/Im');
  sel.option('Modulus');
  sel.option('All');
  sel.selected('Re/Im');

  pixelDensity(1);
  uicontrols();
  resetPlot();
}

function draw() {
  domC.plotHSVReIm(sel.value());
  domC.update();
}

/* Auxliary functions */

function resetPlot() {
  domC = new domainColoring(input, 3);
}

/*//HSV Re/Im
function mySelectOption() {
  let s = sel.value();
  if (s === 'Real') {
    domC.opt = 'Real';
  } else if (s === 'Imaginary') {
    domC.opt = 'Imaginary';
  } else if (s === 'Re/Im') {
    domC.opt = 'Re/Im';
  } else if (s === 'Modulus') {
    domC.opt = 'Modulus';
  } else if (s === 'All') {
    domC.opt = 'All';
  }
}*/