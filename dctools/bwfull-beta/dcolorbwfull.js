/* Written in p5.js (https://p5js.org/)
 * Under Creative Commons License
 * https://creativecommons.org/licenses/by-sa/4.0/
 * Written by Juan Carlos Ponce Campuzano, 12-Nov-2018
 */

// Last update 21-Nov-2019

let domC, s, w, h, input;

let def = {
  opt: 'Modulus',
  size: 6,
  slidert: 0,
  slideru: 0,
  slidern: 1,
  Save: function () {
    save('plotfz.png');
  },
  canvasSize: 'Small'
};

function setup() {
  createCanvas(470, 470);
  pixelDensity(1);
  uicontrols();
  resetPlot();
}

function draw() {
  domC.plotBW(def.opt);
  domC.update();
}

/* Auxliary functions */

function resetPlot() {
  domC = new domainColoring(input.value(), def.size, def.slidert);
}

function mouseWheel() {
  if (domC.x <= mouseX && mouseX <= domC.w && domC.y <= mouseY && mouseY <= domC.h)
    domC.zoomAt(mouseX, mouseY, 0.85, event.delta < 0);
}

function keyReleased() {
  if (keyCode === 81) //Q key
    domC.printDebug = !domC.printDebug;
}

function mousePressed() {
  domC.pressedPlot();
}

function mouseReleased() {
  domC.releasedPlot();
}

function touchStarted() {
  domC.pressedPlot();
}

function touchEnded() {
  domC.releasedPlot();
}

//RGB
function mySelectOption() {
  if (def.opt === 'Phase') {
    domC.opt = 'Phase';
  } else if (def.opt === 'Modulus') {
    domC.opt = 'Modulus';
  } else if (def.opt === 'Phase/Modulus') {
    domC.opt = 'Phase/Modulus';
  } else if (def.opt === 'Real') {
    domC.opt = 'Real';
  } else if (def.opt === 'Imaginary') {
    domC.opt = 'Imaginary';
  } else if (def.opt === 'Re/Im') {
    domC.opt = 'Re/Im';
  }
}

function keyPressed() {
  if (keyCode === ENTER) {
    domC.func = domC.verifyFunction(complex_expression(input.value(), def.slidert, def.slideru, def.slidern));
  }
}

function resetPlotDim() {
  w = def.size;
  h = (w * height) / width;
  s = new p5.Vector(w, h);
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