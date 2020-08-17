/* Written in p5.js (https://p5js.org/)
 * Under Creative Commons License
 * https://creativecommons.org/licenses/by-sa/4.0/
 * Written by Juan Carlos Ponce Campuzano, 12-Nov-2018
 
 * Last update 14-Aug-2020
 */

let domC, s, w, h, cnv;

let input = 'z+1/z';

function setup() {
  cnv = createCanvas(500, 500);
  cnv.parent('sketch-Holder');
  pixelDensity(1);
  uicontrols();
  resetPlot();
}

function draw() {
  domC.plotBW(sel.value());
  domC.update();
}

/* Auxliary functions */

function resetPlot() {
  domC = new domainColoring(input, pz.value, pt.value);
}

//RGB
function mySelectOption() {
  let s = sel.value();
  if (s === 'Phase') {
    domC.opt = 'Phase';
  } else if (s === 'Modulus') {
    domC.opt = 'Modulus';
  } else if (s === 'Phase/Modulus') {
    domC.opt = 'Phase/Modulus';
  } else if (s === 'Real') {
    domC.opt = 'Real';
  } else if (s === 'Imaginary') {
    domC.opt = 'Imaginary';
  } else if (s === 'Re/Im') {
    domC.opt = 'Re/Im';
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
  sel.option('Phase');
  sel.option('Modulus');
  sel.option('Phase/Modulus');
  sel.option('Real');
  sel.option('Imaginary');
  sel.option('Re/Im');
  sel.selected('Modulus');

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

