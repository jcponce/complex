/* Written in p5.js (https://p5js.org/)
 * Under Creative Commons License
 * https://creativecommons.org/licenses/by-sa/4.0/
 * Written by Juan Carlos Ponce Campuzano, 12-Nov-2018
 
 * Last update 17-Aug-2020
 */

let domC, s, w, h, cnv, sel;

let input = '0.926(z+7.3857e-2 z^5+4.5458e-3 z^9)';

function setup() {
  cnv = createCanvas(500, 500);
  cnv.parent('sketch-Holder');
  pixelDensity(1);

  sel = createSelect();
  sel.parent('mySelect');
  sel.option('Phase');
  sel.option('Modulus');
  sel.option('Phase/Modulus');
  sel.option('None');
  sel.selected('Modulus');

  uicontrols();
  resetPlot();
}

function draw() {
  domC.plotHSVDisc(sel.value());
  domC.update();
}

/* Auxliary functions */

function resetPlot() {
  domC = new domainColoring(input, pz.value);
}

/*//HSV
function mySelectOption() {
  let s = sel.value();
  if (s === 'Phase') {
    domC.opt = 'Phase';
  } else if (s === 'Modulus') {
    domC.opt = 'Modulus';
  } else if (s === 'Phase/Modulus') {
    domC.opt = 'Phase/Modulus';
  } else if (s === 'None') {
    domC.opt = 'None';
  }
}*/