/* Written in p5.js (https://p5js.org/)
 * Under Creative Commons License
 * https://creativecommons.org/licenses/by-sa/4.0/
 * Written by Juan Carlos Ponce Campuzano, 12-Nov-2018
 */

// Last update 12-Aug-2020

let fn = 'z^6+'; //Change this function
let domC, s;

let input;

let def = {
  opt: 'Modulus',

  displayXY: false,
  size: 3,
  slidert: 0,
  slideru: 0,
  slidern: 1,

  Save: function() {
    save('plotfz.png');
  },

  canvasSize: 'Small'

};

let w, h;

let sc;

let pX, pY, scw, sch;

function setup() {
  createCanvas(470, 470);

  pixelDensity(1);

  uicontrols();

  resetPlot();

  //noLoop();
}

function resetPlot() {


  pX = 40;
  pY = 40;

  scw = width - 1 * pX;
  sch = height - 1 * pY

  sc = createGraphics(scw, sch);

  w = def.size;
  h = (w * height) / width;
  s = new p5.Vector(-w, h);

  domC = new domainColoring(input.value(), s, def.slidert);

}

function draw() {
  domC.plotRGB(def.opt);
  domC.update();
}


function mouseWheel() {
  if (domC.x <= mouseX && mouseX <= domC.w && domC.y <= mouseY && mouseY <= domC.h)
    domC.zoomAt(mouseX, mouseY, 0.85, event.delta < 0);
}

function keyReleased() {
  if (keyCode === 81) //Q key
    domC.printDebug = !domC.printDebug;
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
  // resetPlot();
}



function keyPressed() {
  if (keyCode === ENTER) {
    //resetPlot();

    domC.func = domC.verifyFunction(complex_expression(input.value(), def.slidert, def.slideru, def.slidern));

    //redraw();
  }



}

function resetPlotDim() {
  w = def.size;
  h = (w * height) / width;
  s = new p5.Vector(-w, h);
  domC.origSize = s;
  domC.size = new p5.Vector(domC.origSize.x, domC.origSize.y);


}

function resetParameters() {
  domC.func = domC.verifyFunction(complex_expression(input.value(), def.slidert, def.slideru, def.slidern));
}

function screenSize() {
  if (def.canvasSize === 'Small') {
    resizeCanvas(500, 500);
  } else if (def.canvasSize === 'Big') {
    resizeCanvas(700, 700);

  }
  resetPlot();

}
