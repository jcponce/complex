/* Written in p5.js (https://p5js.org/)
 * Under Creative Commons License
 * https://creativecommons.org/licenses/by-sa/4.0/
 * Written by Juan Carlos Ponce Campuzano, 12-Nov-2018
 */

// Last update 03-Jul-2019

// --Control variables--
let clts = {

  lvlCurv: 'Re/Im',

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

  uiControls();

  noLoop();
}

function draw() {

  background(255);

  //domainColoring( function, |Re z|, center x, center y, canvasSize text, axis boolean);
  domC = new domainColoring(input.value(), clts.size, clts.centerX, clts.centerY, clts.canvasSize, clts.displayXY);

  domC.plotter();

}

// --Coloring the pixels--
// First I need to define the functions to color pixels

var funPhase = (x, y) => (PI - atan2(y, -x)) / (2 * PI);

var sat = (x, y) => {
  let c = log(sqrt(x * x + y * y)) / log(2);
  return (abs(3 * sin(2 * PI * (c - floor(c)))));
}

var val = (x, y) => {
  let c = abs(sin(3 * PI * y) * sin(3 * PI * x))
  return sqrt(sqrt(c));
}

var SatVal = (x, y) => {
  let c = 1 - sat(x, y) - val(x, y);
  return 0.5 * ((1 - sat(x, y)) + val(x, y) + sqrt( c * c + 0.01));
}

var funColorS = (x, y) => 1;

var funColorB = (x, y) => val(x, y);
//end coloring functions

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

    //let z = trimN(clts.funcZ);
    let z = trimN(this.fn);
    
    //Erro message
    let parsed, ck;
        try {
            parsed = complex_expression(z);//Define function
            ck = parsed.fn;
        } catch (err) {
            alert('Something went wrong 😟! Please, check your input!');
        }

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
        let s = funColorS(w.r, w.i);
        let b = funColorB(w.r, w.i);
        set(i, j, color(h, s, b));

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
    stroke(1);
    strokeWeight(2);
    line(0, height / 2, width, height / 2); //x-axis
    line(width / 2, 0, width / 2, height); //y-axis

    stroke(0);
    let w = this.size;
    let h = (w * height) / width;

    let txtsize;
    let txtStroke;

    if (this.canvasSize == 'Square' && w >= 1) {
      txtsize = 17;
      txtStroke = 2;
    } else if (this.canvasSize == 'Square' && w < 1) {
      txtsize = 13;
      txtStroke = 2;
    } else if (this.canvasSize == 'Landscape') {
      txtsize = 18;
      txtStroke = 3;
    } else if (this.canvasSize == 'Full-Screen') {
      txtsize = 20;
      txtStroke = 3;
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
function uiControls() {

  // create gui (dat.gui)
  let gui = new dat.GUI({
    width: 360
  });
  //gui.add(clts, 'funcZ').name("f(z) =");
  gui.add(clts, 'lvlCurv', ['Real', 'Imaginary', 'Re/Im', 'Modulus', 'All', 'None']).name("Level Curves:").onChange(mySelectOption);
  gui.add(clts, 'size', 0.00001, 15).name("|Re z| <").onChange(keyPressed);

  let par = gui.addFolder('Parameters');
    par.add(clts, 'slidert', 0, 1, 0.01).name("t =").onChange(keyPressed);
    par.add(clts, 'slideru', 0, 2*Math.PI, 0.01).name("u: exp(i⋅s), s =").onChange(keyPressed);
    par.add(clts, 'slidern', 0, 30, 1).name("Int: n =").onChange(keyPressed);

  gui.add(clts, 'Save').name("Save (png)");

  gui.add(clts, 'displayXY').name("Axes").onChange(redraw);
  gui.add(clts, 'centerX').name("Center x =").onChange(keyPressed);
  gui.add(clts, 'centerY').name("Center y =").onChange(keyPressed);
  gui.add(clts, 'canvasSize', ['Square', 'Landscape', 'Full-Screen']).name("Size: ").onChange(screenSize);
  gui.close();

  input = createInput('log(z)');
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

//z.pow(0).div(z.pow(0).sub(z.pow(2)).sqrt())
function mySelectOption() {
  if (clts.lvlCurv == 'Real') {
    funColorS = (x, y) => 1;
    funColorB = (x, y) => sqrt(sqrt(abs(sin(3 * PI * x))));
  } else if (clts.lvlCurv == 'Imaginary') {
    funColorS = (x, y) => 1;
    funColorB = (x, y) => sqrt(sqrt(abs(sin(3 * PI * y))));
  } else if (clts.lvlCurv == 'Re/Im') {
    funColorS = (x, y) => 1;
    funColorB = (x, y) => sqrt(sqrt(abs(sin(3 * PI * y) * sin(3 * PI * x))));
  } else if (clts.lvlCurv == 'Modulus') {
    funColorS = (x, y) => sat(x, y);
    funColorB = (x, y) => 1;
  } else if (clts.lvlCurv == 'All') {
    funColorS = (x, y) => sat(x, y);
    funColorB = (x, y) => SatVal(x, y);
  } else if (clts.lvlCurv == 'None') {
    funColorS = (x, y) => 1;
    funColorB = (x, y) => 1;
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
