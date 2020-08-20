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
    document.getElementById('pZoom').value = 3;
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

function savePlot() {
  save('plotfz.png');
}

function resetValues() {
  let s = 3;//def.size;
  let sw = s * 2;
  let sh = (sw * height) / width;
  domC.origSize = new p5.Vector(sw, sh);
  domC.size = new p5.Vector(domC.origSize.x, domC.origSize.y);
  domC.pos.x = domC.origPos.x;
  domC.pos.y = domC.origPos.y;
  domC.zoom = domC.origZoom;
  let nx = map(domC.pos.x, -domC.size.x / 2, domC.size.x / 2, domC.x, domC.w);
  let ny = map(domC.pos.y, -domC.size.y / 2, domC.size.y / 2, domC.y, domC.h);
  domC.bX = nx;
  domC.bY = ny;
}