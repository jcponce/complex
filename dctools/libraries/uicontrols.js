/* Written in p5.js (https://p5js.org/)
 * Under Creative Commons License
 * https://creativecommons.org/licenses/by-sa/4.0/
 * Written by Juan Carlos Ponce Campuzano, 12-Nov-2018
 
 * Last update 12-Aug-2020
 */

let pz, pt, pu, pn;

let size = false;

function uicontrols() {

  // Zoom parameter
  pz = document.getElementById('pZoom');

  // Other parameters
  pt = document.getElementById('pt');
  pu = document.getElementById('pu');
  pn = document.getElementById('pn');

  // save and reset buttons
  document.getElementById('save').onclick = () => {
    savePlot();
  }
  document.getElementById('reset').onclick = () => {
    resetValues();
  }
  document.getElementById('resize').onclick = () => {
    if (size) {
      size = false;
      resizeCanvas(500, 500);
    } else {
      size = true;
      resizeCanvas(700, 700);
    }
    //screenSize();
    resetPlot();
  }

}