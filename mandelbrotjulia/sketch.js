/*
 Written by Juan Carlos Ponce Campuzano
 05-March-2019
 https://jcponce.github.io/
 
 The Julia and Mandelbrot classes are based upon Daniel Shiffman
 from his Coding Challenge #21 and #22:
 https://thecodingtrain.com/CodingChallenges/021-mandelbrot-p5.html
 https://thecodingtrain.com/CodingChallenges/022-juliaset.html

*/

let mandelSet;

let widthMandel = 2.7;
let centerX = -0.7;
let sizeGraph = 400;

let juliaSet;

let mx = 1;
let my = 1;
let easing = 0.9;
let radius = 4;
let edge = 0;
let inner = edge + radius;

// --Controls--
let clts = {
title: 'Mandelbrot-Julia Sets',
inst: 'Double click',
iter: 100,
Save: function () {
    save('fractal.png');
},
User: false,
Cx: 0,
Cy: 0,
};

let change;
let prevmx = 0;
let prevmy = 0;

let cX, cY;

function setup() {
  createCanvas(800, 400);

  noStroke();
  ellipseMode(RADIUS);
  rectMode(CORNERS);

  pixelDensity(1);
  frameRate(60);
  smooth();
    
  // create gui (dat.gui)
  let gui = new dat.GUI({
                          width: 295
                          });
  gui.close();
  //gui.add(clts, 'title').name("Title:");
  //gui.add(clts, 'inst').name("Fixed point:");
  gui.add(clts, 'iter', 3, 150).step(1).name("Iterations:");
  gui.add(clts, 'Save').name("Save (png)");
  
  let folder = gui.addFolder('Input options');

  folder.add(clts, 'User').name("Set c:");
  folder.add(clts, 'Cx').min(-6).max(6).step(0.001).name("Re(c):");
  folder.add(clts, 'Cy').min(-6).max(6).step(0.001).name("Im(c):");
  
    
    changeC = false;

}

function draw() {
    
  cursor(HAND);
    
  mandelSet = new Mandelbrot(clts.iter, widthMandel, sizeGraph);

  juliaSet = new Julia(clts.iter, 3, sizeGraph);

  mandelSet.show();
  juliaSet.show();
    
  if(!clts.User){//User
    
  if (!changeC) {
      if (abs(mouseX - mx) > 0.1) {
          mx = mx + (mouseX - mx) * easing;
      }
      if (abs(mouseY - my) > 0.1) {
          my = my + (mouseY - my) * easing;
      }

      mx = constrain(mx, inner, (width - inner) / 2);
      my = constrain(my, inner, height - inner);

      fill(255);
      ellipse(mx, my, radius, radius);
  } else {
      fill(233, 2, 1)
      prevmx = mx;
      prevmy = my;
      ellipse(prevmx, prevmy, radius, radius);
}
    }//User
    
}

function doubleClicked(){
    if(changeC){
        changeC = false;
    } else {
        changeC = true;
    }
    
}

//Auxiliary functions
function setPixelRGB(x, y, r, g, b) {
  let pixelID = (x + y * width) * 4;
  pixels[pixelID + 0] = r;
  pixels[pixelID + 1] = g;
  pixels[pixelID + 2] = b;
  pixels[pixelID + 3] = 255;
}

function setPixelHSV(x, y, h, s, v) {
  let r, g, b, i, f, p, q, t;
  i = Math.floor(h * 6);
  f = h * 6 - i;
  p = v * (1 - s);
  q = v * (1 - f * s);
  t = v * (1 - (1 - f) * s);
  switch (i % 6) {
    case 0:
      r = v, g = t, b = p;
      break;
    case 1:
      r = q, g = v, b = p;
      break;
    case 2:
      r = p, g = v, b = t;
      break;
    case 3:
      r = p, g = q, b = v;
      break;
    case 4:
      r = t, g = p, b = v;
      break;
    case 5:
      r = v, g = p, b = q;
      break;
  }

  setPixelRGB(x, y, round(r * 65), round(g * 255), round(b * 255));
}
