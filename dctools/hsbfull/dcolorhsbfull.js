/* Written in p5.js (https://p5js.org/)
 * Under Creative Commons License
 * https://creativecommons.org/licenses/by-sa/4.0/
 * Written by Juan Carlos Ponce Campuzano, 12-Nov-2018
 
 * Last update 21-Nov-2019
 */

// --Control variables--
let clts = {

  lvlCurv: 'Modulus',

  displayXY: false,
  size: 2.5,
  slidert: 1,
  slideru: 1,
  slidern: 1,
  centerX: 0,
  centerY: 0,

  Save: function() {
    save('plotfz.png');
  },

  canvasSize: 'Square'

};

let input, domC;

function setup() {
  createCanvas(470, 470);
  colorMode(HSB, 1);
  smooth();
  pixelDensity(1);
  noLoop();

  uiControls();
  
}

function draw() {

  background(255);

  //domainColoring( function, |Re z|, center x, center y, canvasSize text, axis boolean);
  domC = new domainColoring(input.value(), clts.size, clts.centerX, clts.centerY, clts.canvasSize, clts.displayXY);

  domC.plotter();

}

// --Coloring the pixels--
// First I need to define the functions to color pixels

let funPhase = (x, y) => (PI - Math.atan2(y, -x)) / (2 * PI); // defines color hue based on phase 

let sharp = 0.39; // delay
let b = 0.655; // brightness 0 -> dark, 1 -> bright
let nMod = 2; // num of level curves mod
let nPhase = 20; // num. of level curves phase
let base = 2;

let cPhase = (x, y) => {
    let c = nPhase * funPhase(x,y);
    return sharp * ( c - floor(c) ) + b;
}

let cMod = (x, y) => {
    let c = nMod * log(sqrt(x * x + y * y));
    return sharp * ( c - floor(c) ) + b;
}

let cPhaMod = (x, y) => cPhase(x, y) * cMod(x, y);

let funColor = (x, y) => cMod(x, y);

//ends coloring functions

//Class for domain coloring
class domainColoring {

  constructor(fn, size, cX, cY, canvasSize, axis) {
    this.fn = fn;
    this.size = size;
    this.cX = cX;
    this.cY = cY;
    this.canvasSize = canvasSize;
    this.axis = axis;
  }

  plotter() {

    let z = trimN(this.fn);
    let parsed = complex_expression(z); //Define function

    // Establish a range of values on the complex plane

    // It all starts with the width, try higher or lower values
    let w = this.size * 2;
    let h = (w * height) / width;

    // Start at negative half the width and height
    let xmin = -w / 2 + this.cX;
    let ymin = -h / 2 - this.cY;

    // Make sure we can write to the pixels[] array.
    // Only need to do this once since we don't do any other drawing.
    loadPixels();

    // x goes from xmin to xmax
    let xmax = xmin + w;
    // y goes from ymin to ymax
    let ymax = ymin + h;

    // Calculate amount we increment x,y for each pixel
    let dx = (xmax - xmin) / (width);
    let dy = (ymax - ymin) / (height);

    // Start y
    let y = ymin;
    for (let j = 0; j < height; j++) {
      // Start x
      let x = xmin;
      for (let i = 0; i < width; i++) {

        let vz = {
          r: x,
          i: -y
        }; //Here we need minus since the y-axis in canvas is upside down

        let w = parsed.fn(vz); //Evaluate function

        // We color each pixel based on some cool function
        // Gosh, we could make fancy colors here if we wanted

        let h = funPhase(w.r, w.i);
        let b = funColor(w.r, w.i);
        set(i, j, color(h, 1, b));

        x += dx;
      }
      y += dy;
    }

    updatePixels();

    if (this.axis == true) {
      this.grid();
    }

  } //ends plot

  grid() {
    stroke(0);
    strokeWeight(2);
    line(0, height / 2, width, height / 2); //x-axis
    line(width / 2, 0, width / 2, height); //y-axis


    let w = this.size;
    let h = (w * height) / width;

    let txtsize;
    let txtStroke;

    if (this.canvasSize == 'Square' && w >= 1) {
      txtsize = 17;
      txtStroke = 3;
    } else if (this.canvasSize == 'Square' && w < 1) {
      txtsize = 13;
      txtStroke = 3;
    } else if (this.canvasSize == 'Landscape') {
      txtsize = 18;
      txtStroke = 4;
    } else if (this.canvasSize == 'Full-Screen') {
      txtsize = 20;
      txtStroke = 4;
    }

    strokeWeight(txtStroke);
    textSize(txtsize);

    fill(1);
    text('(' + this.cX + ',' + this.cY + ')', width / 2 + 2, height / 2 + 15);

    let valxPos, valxNeg, valyPos, valyNeg, dec;

    if (1 <= w) {
      dec = 100.0;
    } else if (0.01 <= w && w < 1) {
      dec = 1000.0;
    } else if (0.001 <= w && w < 0.01) {
      dec = 10000.0;
    }
    if (0.0001 <= w && w < 0.001) {
      dec = 100000.0;
    } else if (0.00001 <= w && w < 0.0001) {
      dec = 1000000.0;
    }
    let r = 5; //radius
    let sr = 4 //position of numbers


    for (let i = w / 4; i <= w; i += w / 4) {

      valxPos = map(i, 0, w, width / 2, width);
      valxNeg = map(i, 0, w, width / 2, 0);
      ellipse(valxPos, height / 2, r, r); //pos x
      ellipse(valxNeg, height / 2, r, r); //neg x
      text('' + str(round((i + this.cX) * dec) / dec), valxPos, height / 2 - sr + 19); //X-Positive
      text('' + str(round((this.cX - i) * dec) / dec), valxNeg, height / 2 - sr + 19); //X-negative

    }

    for (let j = h / 4; j <= h; j += h / 4) {

      valyPos = map(j, 0, h, height / 2, 0);
      valyNeg = map(j, 0, h, height / 2, height);
      ellipse(width / 2, valyPos, r, r); //pos y
      ellipse(width / 2, valyNeg, r, r); //neg y
      text('' + str(round((j + this.cY) * dec) / dec) + 'i', width / 2 - sr + 9, valyPos); //Y-Positive
      text('' + str(round((this.cY - j) * dec) / dec) + 'i', width / 2 - sr + 9, valyNeg); //Y-negative

    }


  } //ends grid

}

// Auxiliary functions

function uiControls(){
  
  // create gui (dat.gui)
  let gui = new dat.GUI({
    width: 360
  });
  gui.add(clts, 'lvlCurv', ['Phase', 'Modulus', 'Phase/Modulus', 'None']).name("Level Curves:").onChange(mySelectOption);
  gui.add(clts, 'size', 0.00001, 15).name("|Re z| <").onChange(keyPressed);

  let par = gui.addFolder('Parameters');
    par.add(clts, 'slidert', 0, 1, 0.01).name("t =").onChange(keyPressed);
    par.add(clts, 'slideru', 0, 2*Math.PI, 0.01).name("exp(iu): u =").onChange(keyPressed);
    par.add(clts, 'slidern', 0, 60, 1).name("Int: n =").onChange(keyPressed);


  gui.add(clts, 'Save').name("Save (png)");

  gui.add(clts, 'displayXY').name("Axes").onChange(redraw);
  gui.add(clts, 'centerX').name("Center x =").onChange(keyPressed);
  gui.add(clts, 'centerY').name("Center y =").onChange(keyPressed);
  gui.add(clts, 'canvasSize', ['Square', 'Landscape', 'Full-Screen']).name("Size: ").onChange(screenSize);
  gui.close();

  input = createInput('(z-1)/(z^2+z+1)');
  //input.size(200, 20);
  input.addClass('body');
  input.addClass('container');
  input.addClass('full-width');
  input.addClass('dark-translucent');
  input.addClass('input-control');
  //input.addClass('equation-input');
  input.attribute('placeholder', 'Input complex expression, e.g. 1/(z^2 + iz)^2 - log(z)');
  input.style('color: #ffffff');
           
}

function trimN(s) {
  if (s.trim) {
    return s.trim();
  }
  return s.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
}

function mySelectOption() {
  if (clts.lvlCurv == 'Phase') {
      funColor = (x, y) => cPhase(x, y);
  } else if (clts.lvlCurv == 'Modulus') {
      funColor = (x, y) => cMod(x, y);
  } else if (clts.lvlCurv == 'Phase/Modulus') {
      funColor = (x, y) => cPhaMod(x, y);
  } else if (clts.lvlCurv == 'None') {
      funColor = (x, y) => 1;
  }
  redraw();
}

function screenSize() {
  if (clts.canvasSize == 'Square') {
    resizeCanvas(470, 470);
  } else if (clts.canvasSize == 'Landscape') {
    resizeCanvas(750, 550);
  } else if (clts.canvasSize == 'Full-Screen') {
    resizeCanvas(windowWidth, windowHeight);
  }
}

function keyPressed() {
  if (keyCode === ENTER) {
    redraw();
  }
}
