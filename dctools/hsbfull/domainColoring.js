/* Written in p5.js (https://p5js.org/)
 * Under Creative Commons License
 * https://creativecommons.org/licenses/by-sa/4.0/
 * Written by Juan Carlos Ponce Campuzano, 12-Nov-2018
 
 * Last update 20-Nov-2019
 */

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