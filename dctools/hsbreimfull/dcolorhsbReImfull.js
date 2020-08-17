/* Written in p5.js (https://p5js.org/)
 * Under Creative Commons License
 * https://creativecommons.org/licenses/by-sa/4.0/
 * Written by Juan Carlos Ponce Campuzano, 12-Nov-2018
 
 * Last update 17-Aug-2020
 */

let domC, s, w, h, cnv;

let input = 'log(z)';

function setup() {
  cnv = createCanvas(500, 500);
  cnv.parent('sketch-Holder');
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
  domC = new domainColoring(input, pz.value, pt.value);
}

//HSV Re/Im
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
}
function savePlot() {
  save('plotfz.png');
}

function resetValues(){
  domC.size.x = domC.origSize.x;
  domC.size.y = domC.origSize.y;
  domC.pos.x = domC.origPos.x;
  domC.pos.y = domC.origPos.y;
  domC.zoom = domC.origZoom;
}

let sel, size, pz, pt, pu, pn;

function uicontrols() {

  sel = createSelect();
  sel.parent('mySelect');
  sel.option('Real');
  sel.option('Imaginary');
  sel.option('Re/Im');
  sel.option('Modulus');
  sel.option('All');
  sel.selected('Re/Im');

  size = createSelect();
  size.parent('mySize');
  size.option('Small');
  size.option('Big');
  size.changed(screenSize);
  
  // Zoom parameter
  pz = document.getElementById('pZoom');

  // Other parameters
  pt = document.getElementById('pt');
  pu = document.getElementById('pu');
  pn = document.getElementById('pn');

  // save and reset buttons
  document.getElementById('save').onclick = () =>{
    savePlot();
  }
  document.getElementById('reset').onclick = () =>{
    resetValues();
  }

}