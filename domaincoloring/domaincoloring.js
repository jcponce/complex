/* Written in p5.js (https://p5js.org/)
 * Under Creative Commons License
 * https://creativecommons.org/licenses/by-sa/4.0/
 * Writen by Juan Carlos Ponce Campuzano, 19-Jul-2018
 */

// Original code by Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain
// Code for: https://youtu.be/6z7GQewK-Ks
// I just changed the iteration function and color scheme

// Last update 7-Nov-2018

let lim, button;

let realText, imgText, boxText;

let inpRe, inpIm, inpLim;


function setup() {
    createCanvas(550, 400);
    colorMode(HSB, 360, 100, 100);
    frameRate(60);
    controls();
    noLoop();
}

function draw() {
    background(255);
    
    // Establish a range of values on the complex plane
    // A different range will allow us to "zoom" in or out on the fractal
    
    // It all starts with the width, try higher or lower values
    let w = eval(inpLim.value());//4.5;
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
    
    for (let j = 0; j < height; j++) {
        // Start x
        let x1 = xmin;
        for (let i = 0; i < width; i++) {
            
            // Now we test, as we iterate z = z^2 + cm does z tend towards infinity?
            let x = x1;
            let y = y1;
            let n = 0;
            
            let re = eval(inpRe.value());//a+(a)/(a*a+b*b)+ cX; //a * a - b * b + cX;
            let im = eval(inpIm.value());//b-(b)/(a*a+b*b)+ cY;//2 * a * b + cY;
            //let twoab = 2.0 * a * b;
            
            x = re;
            y = im;
            
            // We color each pixel based on some cool function
            // Gosh, we could make fancy colors here if we wanted
            
            let h = map(atan2(-y, -x), -PI, PI, 0, 360) ;
            let b = max(map(log(5*sqrt(x * x + y * y))/log(1.5) - floor(log(5*sqrt(x * x + y * y))/log(1.5))+0.1, 0,5, 100, 0), 0);
            
            set(i, j, color(h, 100, b));
            
            x1 += dx;
        }
        y1 += dy;
    }
    updatePixels();
    //noLoop();
    
    //draw constant label
    //fill(255);
    //textAlign(LEFT, CENTER);
    //textSize(18);
    //text("Pointer is (" + str(round(cX*100)/100.0) + "," + str(round(cY*100)/100.0) + ")", 5, height-15);
    
}

function controls(){
    inpRe = createInput();
    inpIm = createInput();
    inpRe.value('x');
    inpIm.value('y');
    inpRe.style('font-size', '16px');
    inpRe.style('width', '180px');
    inpIm.style('font-size', '16px');
    inpIm.style('width', '180px');
    inpRe.position(50, height + 15);
    inpIm.position(50, height + 55);
    
    inpLim = createInput();
    inpLim.value('4.5');
    inpLim.style('font-size', '16px');
    inpLim.style('width', '60px');
    inpLim.position(305, height + 15)
    
    realText = createElement('h2', 'Re:');
    realText.position(10, height - 5);
    
    imgText = createElement('h2', 'Im:');
    imgText.position(10, height + 30);
    
    boxText = createElement('h2', 'Box:');
    boxText.position(255, height - 5);
    
    button = createButton('Update');
    button.position(inpIm.x + inpIm.width+70, imgText.y+25);
    button.style('font-size', '16px');
    button.style('cursor', 'pointer');
    button.mousePressed(redraw);
}
