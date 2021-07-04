/* 

 Written in p5.js (https://p5js.org/)
 Under Creative Commons License
 https://creativecommons.org/licenses/by-sa/4.0/
 Written by Juan Carlos Ponce Campuzano, 12-Sep-2020
 https://jcponce.github.io/

*/

let drawing = false;
let points = [];
let pointsEnd = [];

let fn = $("#equation-input").val(); //'z^2';
let opt = 'Cartesian';
let s, parsed;

let cnv;

let u = 0.0;
let scl = 2;
let rad = 2.5;
let stepRad = 10;
let transform = false;

let xPos, yPos, w, h, sw, sh, 
    origSize, size, origPos, pos, 
    origZoom, zoom, bX, bY;
let sizing = false;

function setup() {
  cnv = createCanvas(500, 500);
  cnv.parent('sketch-Holder');
  setInitVals();
  setInput();
}

function draw() {
  background(0);

  cursor(HAND);

  if (transform) {
    if (u < 1.0) {
      u += 0.01;
    }
  } else {
    if (u > 0.0) {
      u -= 0.01;
    }
  }

  rainbowPoints();
  freeDrawing();
  backgroundPlot();
  grid();
  //console.log(u);

}

function rainbowPoints(){
  push();
  fill(0)
  noStroke();
  rect(xPos, yPos, w - xPos, h - yPos);
  colorMode(HSB, 1, 1, 1);
  if (opt == 'Cartesian') {
    for (let x = xPos; x < w + xPos / 2; x = x + (w - 1 * xPos) / 30) {
      for (let y = yPos; y < h + yPos / 2; y = y + (h - 1 * yPos) / 30) {
        noStroke();
        let zx = map(x, xPos, w, -size.x / 2, size.x / 2);
        let zy = map(y, yPos, h, -size.y / 2, size.y / 2)
        let colorz = map(atan2(zy, zx), -PI, PI, 0, 1);
        fill(colorz, 1, 1);
        let p = {
          x: x,
          y: y
        };
        p = cmap({
          x: x,
          y: y
        });
        noStroke();
        ellipse(p.x, p.y, 2 * rad);
      }
    }
  } else if (opt == 'Polar') {
    for (let r = stepRad; r < w / scl * 0.5; r += stepRad) {
      for (let a = -PI + 0.01; a <= PI; a += 0.09) {
        noStroke();
        let rnew = map(r, 0, w / scl * 0.5, 0, scl);
        let pcolorz = map(atan2(rnew * sin(a), -rnew * cos(a)), -PI, PI, 0, 1);
        fill(pcolorz, 1, 1);
        let p = {
          x: xPos / 2 + w / 2 + r * cos(a),
          y: yPos / 2 + h / 2 + r * sin(a)
        };
        p = cmap({
          x: p.x,
          y: p.y
        });
        noStroke();
        ellipse(p.x, p.y, 2 * rad);
      }
    }
  }
  pop();
}

function freeDrawing(){
  push();
  noFill();
  beginShape();
  for (let i = 1; i < points.length; i++) {
    let pos = points[i];
    let ppos = pointsEnd[i];
    pos = cmap(pos);
    ppos = cmap(ppos);
    stroke(255);
    strokeWeight(2);
    fill(255)
    line(pos.x, pos.y, ppos.x, ppos.y);
    //ellipse(pos.x, pos.y, 4)
    //ellipse(ppos.x, ppos.y, 4)
  }
  endShape();
  pop();
}

let check;

function setInput() {
  s = trimN(fn);

  let k = complex_expression(s);
  if (k != null || k === undefined) {
    parsed = complex_expression(s);
    check = false;
  } else {
    parsed = complex_expression(trimN('0'))
    check = true;
  }

  document.getElementById('transform').onclick = () => {
    transform = true;
  }

  document.getElementById('back').onclick = () => {
    transform = false;
  }

  document.getElementById('screen').onclick = () => {
    sizing = !sizing;
    sizeCanvas();
  }

  document.getElementById('cartesian').onclick = () => {
    opt = 'Cartesian';
  }

  document.getElementById('polar').onclick = () => {
    opt = 'Polar';
  }

  document.getElementById('none').onclick = () => {
    opt = 'None';
  }

  document.getElementById('delete').onclick = () => {
    emptyArrays();
  }

}

function setInitVals() {
  // I need to adjust dimensions in case the canvas is not a square
  xPos = 40;
  yPos = 40;
  w = width - xPos;
  h = height - yPos;
  sw = scl * 2;
  sh = (sw * height) / width;

  // Ok now let gets ready with main variables
  origSize = new p5.Vector(sw, sh);
  size = new p5.Vector(origSize.x, origSize.y);
  origPos = new p5.Vector(0, 0); //Origin position
  pos = new p5.Vector(origPos.x, origPos.y);
  origZoom = 1;
  zoom = origZoom;

  // I need this to drag and move around the plot
  let nx = map(pos.x, -size.x / 2, size.x / 2, xPos, w);
  let ny = map(pos.y, -size.y / 2, size.y / 2, yPos, h);
  bX = nx;
  bY = ny;
}

function sizeCanvas() {
  if (sizing) {
    resizeCanvas(windowWidth - 50, windowHeight - 150);
    scl = TWO_PI;
    emptyArrays();
    rad = 2;
    stepRad = 5;
    console.log(windowWidth - 50, windowHeight - 150);
  } else {
    resizeCanvas(500, 500);
    scl = 2;
    emptyArrays();
    rad = 2.5;
    stepRad = 10;
  }
  setInitVals();
}

function emptyArrays() {
  points = [];
  pointsEnd = [];
}

// White background with message
function backgroundPlot() {

  push();
  fill(255);
  noStroke();
  //rect(0, 0, width, height);

  beginShape();
  vertex(0, 0);
  vertex(width, 0);
  vertex(width, height);
  vertex(0, height);
  vertex(xPos, h);
  vertex(w, h);
  vertex(w, yPos);
  vertex(xPos, yPos);
  vertex(xPos, h);
  vertex(0, height);
  vertex(0, 0);
  endShape(CLOSE);

  noFill();
  stroke(100);
  strokeWeight(0.5);
  //rect(xPos, yPos, w - xPos, h - yPos);
  pop();

  cursor(ARROW);
}


function grid() {
  // Real axis label
  push();
  fill(0);
  stroke(0)
  strokeWeight(0.5);
  textSize(16);
  textAlign(LEFT);
  text('Re', w + 10, h);
  pop();


  // Imaginary axis label
  push();
  fill(0);
  stroke(0)
  strokeWeight(0.5);
  textSize(16);
  textAlign(RIGHT);
  text('Im', xPos, yPos - 19);
  pop();

  // Zoom and Mouse position labels
  if (width > 350 && height > 350) {
    push();

    // Zoom label
    fill(0);
    stroke(0);
    noStroke();
    textSize(18);
    textAlign(LEFT);
    let zv = round((1 / zoom) * 1000) / 1000,
      zpx = xPos + 10,
      zpy = yPos - 10,
      zMax = 1000000,
      zMin = 0.00001;
    /*//Maybe I need this part :)
    if (zMin <= zv && zv <= zMax)
      text('Zoom: ' + str(zv), zpx, zpy);
    if (zv < zMin)
      text('Zoom: → 0', zpx, zpy);
    if (zv > zMax) text('Zoom: → ∞', zpx, zpy);
    */

    // Mouse label
    let cX, cY;
    cX = pos.x + map(mouseX, xPos, w, -size.x / 2, size.x / 2); //this is for reference
    cY = pos.y + map(mouseY, h, yPos, -size.y / 2, size.y / 2); //this is for reference


    if (xPos < mouseX && mouseX < w && yPos < mouseY && mouseY < h) {
      let mz = {
        r: cX,
        i: cY
      };
      let mw = parsed.fn(mz);
      text('Mouse z: (' + str(round(cX * 100) / 100) + ',' + str(round(cY * 100) / 100) + ')', zpx, zpy);
      let c1 = round(mw.r * 100) / 100;
      let c2 = round(mw.i * 100) / 100;
      let mod = Math.pow(c1 * c1 + c2 * c2, 1 / 2);
      if (mod < 100000) {
        text('f(z): (' + str(round(mw.r * 100) / 100) + ',' + str(round(mw.i * 100) / 100) + ')', w / 2 + 50, zpy);
      } else {
        text('f(z): → ∞', w / 2 + 50, zpy);
      }
      if (!transform)
        cursor('crosshair');
      else cursor('no-drop');
      //noFill();
      //stroke(0);
      //strokeWeight(1);
      //ellipse(mouseX, mouseY, 15);
    }
    pop();
  }

  // Points of reference on the grid and number labels
  push();
  let n = 4;
  let dec = 100;
  let lim1 = 0.006;
  let lim2 = 0.003;
  let lim3 = 0.001;
  let lim4 = 0.0001;
  let txtSize, txtWeight;

  if (lim2 <= 1 / zoom && 1 / zoom < lim1) {
    txtWeight = 0.5;
    txtSize = 12;
  } else if (lim3 <= 1 / zoom && 1 / zoom < lim2) {
    txtWeight = 0.4;
    txtSize = 10;
  } else if (lim4 <= 1 / zoom && 1 / zoom < lim3) {
    txtWeight = 0.3;
    txtSize = 9;
  } else if (1 / zoom < lim4) {
    txtWeight = 0.1;
    txtSize = 7;
  } else {
    txtWeight = 0.5;
    txtSize = 13;
  }

  textSize(txtSize);
  for (let i = xPos; i < w + xPos; i = i + (w - 1 * xPos) / n) {
    let vx = map(i, xPos, w, -size.x / 2, size.x / 2);
    fill(0);
    stroke(0)
    strokeWeight(txtWeight);
    textAlign(CENTER);
    text('' + str(round((pos.x + vx) * dec) / dec), i, h + 20);
    fill(0);
    noStroke();
    ellipse(i, h, 2.5);

  }

  for (let j = yPos; j <= h + yPos; j = j + (h - 1 * yPos) / n) {
    let vy = map(j, h, yPos, -size.y / 2, size.y / 2);
    fill(0);
    stroke(0)
    strokeWeight(txtWeight);
    textAlign(RIGHT);
    text('' + str(round((pos.y + vy) * dec) / dec), xPos - 2, j - 3);
    fill(0);
    noStroke();
    ellipse(xPos, j, 2.5);

  }
  pop();

  if (check) {
    push();
    fill(250);
    rect(0, 0, width, height);
    fill(0);
    textSize(width / 100 * 6);
    textAlign(CENTER);
    text('Something went wrong 😟! \n Please, check your input!', width / 2, height / 2);
    pop();
  }

}

function mousePressed() {
  drawing = true;
}

function mouseDragged() {
  if (xPos < mouseX && mouseX < w && yPos < mouseY && mouseY < h && drawing && -0.1 <= u && u <= 0.1) {
    //let cx = constrain(mouseX, xPos, w);
    //let cy = constrain(mouseY, yPos, h);

    points.push(createVector(mouseX, mouseY));
    pointsEnd.push(createVector(pmouseX, pmouseY));
  }
}

function mouseReleased() {
  drawing = false;
}

/* Dragging plot functions */
function pressedPlot() {
  if (0 < mouseX && mouseX < width &&
    0 < mouseY && mouseY < height) {
    dragging = true;
    offsetX = bX - mouseX;
    offsetY = bY - mouseY;
  }
}

function releasedPlot() {
  // Quit dragging
  dragging = false;
  //console.log(this.dragging);
}

function cmap(p) {
  let z = {
    r: map(p.x, xPos, w, -size.x / 2, size.x / 2),
    i: map(p.y, h, yPos, -size.y / 2, size.y / 2)
  };

  //setInput();

  let fz = parsed.fn(z); //wfun(z);
  let v = {
    x: map(fz.r * u + (1 - u) * z.r, -size.x / 2, size.x / 2, xPos, w),
    y: map(fz.i * u + (1 - u) * z.i, -size.y / 2, size.y / 2, h, yPos)
  };
  return {
    x: v.x,
    y: v.y
  };
}

function keyTyped() {
  switch (key) {
    case 't':
      transform = !transform;
      break;
    case 'c':
      points = [];
      break;
  }
}

function transformButton() {
  transform = !transform;
}

function trimN(s) {
  if (s.trim) {
    return s.trim();
  }
  return s.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
}

function update_expression() {
  let new_expression = $("#equation-input").val();
  fn = new_expression;
  console.log(new_expression);
}

// Get things started.
$('#equation-input').change(update_expression);
$('#equation-input').change(setInput);
$(update_expression);