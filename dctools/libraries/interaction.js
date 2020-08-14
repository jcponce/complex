/* Written in p5.js (https://p5js.org/)
 * Under Creative Commons License
 * https://creativecommons.org/licenses/by-sa/4.0/
 * Written by Juan Carlos Ponce Campuzano, 12-Nov-2018
 
 * Last update 12-Aug-2020
 */

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

function keyPressed() {
  if (keyCode === ENTER) {
    domC.func = domC.verifyFunction(complex_expression(input.value(), def.slidert, def.slideru, def.slidern));
  }
}

function resetPlotDim() {
  s = def.size;
  domC.origSize = new p5.Vector(s, s);
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