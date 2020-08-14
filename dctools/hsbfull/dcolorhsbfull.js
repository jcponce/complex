/* Written in p5.js (https://p5js.org/)
 * Under Creative Commons License
 * https://creativecommons.org/licenses/by-sa/4.0/
 * Written by Juan Carlos Ponce Campuzano, 12-Nov-2018
 
 * Last update 12-Aug-2020
 */

let domC, s, w, h, input;

function setup() {
  createCanvas(470, 470);
  pixelDensity(1);
  uicontrols();
  resetPlot();
}

function draw() {
  domC.plotHSV(def.opt);
  domC.update();
}

/* Auxliary functions */

function resetPlot() {
  domC = new domainColoring(input.value(), def.size, def.slidert);
}

//HSV
function mySelectOption() {
  if (def.opt === 'Phase') {
    domC.opt = 'Phase';
  } else if (def.opt === 'Modulus') {
    domC.opt = 'Modulus';
  } else if (def.opt === 'Phase/Modulus') {
    domC.opt = 'Phase/Modulus';
  } else if (def.opt === 'None') {
    domC.opt = 'None';
  }
}

// create gui (dat.gui)
let def = {
  opt: 'Modulus',
  size: 6,
  slidert: 0,
  slideru: 0,
  slidern: 1,
  Reset: function(){
    domC.size.x = domC.origSize.x;
    domC.size.y = domC.origSize.y;
    domC.pos.x = domC.origPos.x;
    domC.pos.y = domC.origPos.y;
    domC.zoom = domC.origZoom;
  },
  Save: function () {
    save('plotfz.png');
  },
  canvasSize: 'Small'
};

function uicontrols() {
  let gui = new dat.GUI({
    width: 360
  });
  gui.add(def, 'opt', ['Phase', 'Modulus', 'Phase/Modulus', 'None']).name("Level Curves:").onChange(mySelectOption);
  
  gui.add(def, 'size', 0.000001, 30, 0.000001).name("Zoom In/Out").onChange(resetPlotDim);

  gui.add(def, 'canvasSize', ['Small', 'Big']).name("Window: ").onChange(screenSize);

  let par = gui.addFolder('Parameters');
  par.add(def, 'slidert', 0, 1, 0.01).name("t =").onChange(resetParameters);
  par.add(def, 'slideru', 0, 2 * Math.PI, 0.01).name("u = exp(i⋅s); s =").onChange(resetParameters);
  par.add(def, 'slidern', 0, 30, 1).name("n =").onChange(resetParameters);

  gui.add(def, 'Reset');
  gui.add(def, 'Save').name("Save (png)");


  input = createInput('(z-1)/(z^2+z+1)');

  input.id('myfunc');
  //input.changed(resetPlot);
  input.changed(keyPressed);
  input.addClass('body');
  input.addClass('container');
  input.addClass('full-width');
  input.addClass('dark-translucent');
  input.addClass('input-control');
  //input.addClass('equation-input');
  input.attribute('placeholder', 'Input complex expression, e.g. 1 / (z^2 + i)^2 - log(z)');
  input.style('color: #ffffff');

}