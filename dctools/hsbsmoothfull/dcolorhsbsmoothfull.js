/* Written in p5.js (https://p5js.org/)
 * Under Creative Commons License
 * https://creativecommons.org/licenses/by-sa/4.0/
 * Written by Juan Carlos Ponce Campuzano, 12-Nov-2018
 
 * Last update 17-Aug-2020
 */

let domC, s, w, h, cnv;

let input = 'z^4+z+1';

function setup() {
  cnv = createCanvas(500, 500);
  cnv.parent('sketch-Holder');
  pixelDensity(1);

  //sel = createSelect();
  //sel.parent('mySelect');
  //sel.option('Phase');
  //sel.option('Modulus');
  //sel.option('Phase/Modulus');
  //sel.option('None');
  //sel.selected('Modulus');

  uicontrols();
  resetPlot();
}

function draw() {
  domC.plotHSVG();
  domC.update();
}

/* Auxliary functions */

function resetPlot() {
  domC = new domainColoring(input, pz.value, pt.value);
}

//HSV gradien not needed
/*
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
}
*/