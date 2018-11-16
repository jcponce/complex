//let fun = (z) => z.sin();
//let fun = (z) => z.pow(-1);
//let fun = (z) => z.pow(-2).sin();
//let fun = (z) => z.atan();
//let fun = (z) => z.log();
//let fun = (z) => z.pow(1);
//let fun = (z) => z.add("-1").div(z.add(z.pow(2).add(1)));
//let fun = (z) => z.add("1").div(z);
//let fun = (z) => (z.add(1)).div(z.add(-1));//??
//let fun = (z) => z.add("i");
//let fun = (z) => z;
//let fun = (z) => z.pow("0.66+i");
//let fun = (z) => z.pow(2).sub(1).mul(z.sub("2+i").pow(2)).div(z.pow(2).add("2+i"));
//let fun = (z) => z.pow(2).mul(-1).add(1).exp().add(-1);
//let fun = (z) => z.atan();
//let fun = (z) => z.mul("i").inverse().pow(17).sub(z.mul("i").inverse()).div(z.mul("i").inverse().add(-1));
let fun = (z) => z.pow(5).inverse();
//let fun = (z) => z.sin().div(z.pow(0).sub(z.pow(3).cos()));
//let fun = (z) => z.div(z.exp().sub(1));
//let fun = (z) => z.pow(18).div(z.pow(0).sub(z.pow(18)));
//let fun = (z) => z.pow(1).div(z.pow(0).sub(z.pow(1))).add(z.pow(2).div(z.pow(0).sub(z.pow(2)))).add(z.pow(3).div(z.pow(0).sub(z.pow(3)))).add(z.pow(4).div(z.pow(0).sub(z.pow(4)))).add(z.pow(5).div(z.pow(0).sub(z.pow(5)))).add(z.pow(6).div(z.pow(0).sub(z.pow(6)))).add(z.pow(7).div(z.pow(0).sub(z.pow(7)))).add(z.pow(8).div(z.pow(0).sub(z.pow(8)))).add(z.pow(9).div(z.pow(0).sub(z.pow(9)))).add(z.pow(10).div(z.pow(0).sub(z.pow(10)))).add(z.pow(11).div(z.pow(0).sub(z.pow(11)))).add(z.pow(12).div(z.pow(0).sub(z.pow(12)))).add(z.pow(13).div(z.pow(0).sub(z.pow(13))));

function setup() {
  createCanvas(350, 350);
  colorMode(HSB, 1, 1, 1);
  frameRate(60);
	unit = new Complex(1,1);
	unitr = new Complex(1,0);
	dim = new Complex(width, height);
  //noLoop(); 
  //console.log(dim.im);
	
}

function draw() {
  background(255);

  // Establish a range of values on the complex plane
  // A different range will allow us to "zoom" in or out on the fractal

  // It all starts with the width, try higher or lower values
  let w = 2.5;
  let h = (w * height) / width;

  // Start at negative half the width and height
  let xmin = -w / 2;
  let ymin = -h / 2;

  // Make sure we can write to the pixels[] array.
  // Only need to do this once since we don't do any other drawing.
  loadPixels();

  // Maximum number of iterations for each point on the complex plane
  let maxiterations = 100;

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
  
  let funColor = (x , y) => 1/5*log(5*sqrt(x * x + y * y))/log(1.5) - 1/5* floor(log(5*sqrt(x * x + y * y))/log(1.5))+0.75;

  for (let j = 0; j < height; j++) {
    // Start x
    let x1 = xmin;
    for (let i = 0; i < width; i++) {

      // Now we test, as we iterate z = z^2 + cm does z tend towards infinity?
      let x = x1;
      let y = -y1;
      
      let z = new Complex({
		  	re: x, 
		  	im: y
	    });
			let w = fun(z);
	    //let v = {
		  //	x: w.re,
		  //	y: w.im,
	    //};
      let Real = w.re; //a * a - b * b + cX;
      let Ima = w.im;//2 * a * b + cY;
      //let twoab = 2.0 * a * b;

      x = Real+cX;
      y = Ima+cY;

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
  
  //draw constant label
  fill(255);
  textAlign(LEFT, CENTER);
  textSize(16);
  text("c is (" + str(round(cX*100)/100.0) + "," + str(round(cY*100)/100.0) + ")", 5, height-15);

  //draw pointer for constant
  fill(0, 0, 100);
  noStroke();
  ellipse(mouseX, mouseY, 6);
}