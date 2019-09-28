let fun = '1/z^5';

function setup() {
  createCanvas(320, 320);
  colorMode(HSB, 1, 1, 1);
  //frameRate(60);
  pixelDensity(1);
  //noCursor();
  //noLoop(); 
  //console.log(dim.im);
	
}

function draw() {
  background(255);
    cursor(HAND);

  // Establish a range of values on the complex plane
  // A different range will allow us to "zoom" in or out on the fractal

  // It all starts with the width, try higher or lower values
  let w = 4;
  let h = (w * height) / width;

  // Start at negative half the width and height
  let xmin = -w / 2;
  let ymin = -h / 2;

  // Make sure we can write to the pixels[] array.
  // Only need to do this once since we don't do any other drawing.
  loadPixels();

  // Maximum number of iterations for each point on the complex plane
  //let maxiterations = 100;

  // x goes from xmin to xmax
  let xmax = xmin + w;
  // y goes from ymin to ymax
  let ymax = ymin + h;

  // Calculate amount we increment x,y for each pixel
  let dx = (xmax - xmin) / (width);
  let dy = (ymax - ymin) / (height);

  // Start y
  let y1 = ymin;

  let cX = map(mouseX, 0, width, xmin, xmax);
  let cY = map(mouseY, height, 0, ymin, ymax);
  
  let funColor = (x , y) => 1/5*log(5*sqrt(x * x + y * y))/log(2) - 1/5* floor(log(5*sqrt(x * x + y * y))/log(2))+0.75;
    
    let z = trimN(fun);
    let parsed = complex_expression(z);

  for (let j = 0; j < height; j++) {
    // Start x
    let x1 = xmin;
    for (let i = 0; i < width; i++) {

      // Now we test, as we iterate z = z^2 + cm does z tend towards infinity?
      let x = x1;
      let y = -y1;
      
      let z = {
		  	r: x,
		  	i: y
	    };
        
	    //let v = {
		  //	x: w.re,
		  //	y: w.im,
	    //};
        let vz = {r:x, i:y};
        
        let we = parsed.fn(vz);//Evaluate function
        
        x = we.r+cX;
        y = we.i+cY;


      // We color each pixel based on something
      // Gosh, we could make fancy colors here if we wanted
      let h = (PI-atan2(y, -x))/(2*PI);
      
      let b = funColor(x, y);
      set(i, j, color(h, 1, b));

      x1 += dx;
    }
    y1 += dy;
  }
  updatePixels();
  //noLoop();
  
    push()
  //draw constant label
  fill(255);
  stroke(0);
  strokeWeight(1);
  textAlign(LEFT, CENTER);
  textSize(17);
  stroke(0,0, 0);
  text("c = (" + str(round(cX*100)/100.0) + "," + str(round(cY*100)/100.0) + ")", 5, height-15);
    pop();

  //draw pointer for constant
  fill(0, 0, 100);
  stroke(0,0, 0);
  ellipse(mouseX, mouseY, 9);
}

function trimN(s) {
    if (s.trim) {
        return s.trim();
    }
    return s.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
}
