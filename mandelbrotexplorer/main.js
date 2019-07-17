/* Written in p5.js (https://p5js.org/)
 * Under Creative Commons License
 * https://creativecommons.org/licenses/by-sa/4.0/
 * Written by Juan Carlos Ponce Campuzano, 28-Nov-2018
 * Original code by Kato https://www.openprocessing.org/user/114431
 */

// Last update 02-Jul-2019

let mandelbrot;

let WIDTH = 500;
let HEIGHT = 500;
let sizePlot = false;

function setup() {
    createCanvas(WIDTH, HEIGHT);
     mandelbrot = new Mandelbrot();
    pixelDensity(1);//I need this for small devices
}

function windowResized() {
    if(sizePlot== true){
        resizeCanvas(700, 700);
    } else{
        resizeCanvas(500, 500);
    }
}

function draw() {
    cursor(HAND);
    mandelbrot.update();
    mandelbrot.plot();
    
    console.log(mandelbrot.maxIter);
    
}

function keyReleased() {
    if (keyCode === 73)//I key
        mandelbrot.printDebug = !mandelbrot.printDebug;
    if (keyCode === 66){//B key
        sizePlot = !sizePlot;
    }
    windowResized();
}

function mouseWheel() {
    mandelbrot.zoomAt(mouseX, mouseY, 0.85, event.delta < 0);
}


// KeyCodes available at: http://keycode.info/
const KC_UP = 38;        // Move up W
const KC_DOWN = 40;        // Move down S
const KC_LEFT = 37;        // Move left A
const KC_RIGHT = 39;    // Move right D
const KC_UNZOOM = 189;    // Zoom back -
const KC_ZOOM = 187;    // Zoom in +
const KC_RESET = 82;    // Reset zoom level and position R
const KC_ITERPLUS = 190;    // More Iterations >
const KC_ITERMINUS = 188;    // Less Iteration <

class Mandelbrot {
    
    constructor(){
    this.origSize = new p5.Vector(3, 3);
    this.size = new p5.Vector(this.origSize.x, this.origSize.y);
    this.origPos = new p5.Vector(-0.7, 0);//Origin position
    this.pos = new p5.Vector(this.origPos.x, this.origPos.y);
    this.maxIter = 180;
    this.origZoom = 1;
    this.zoom = this.origZoom;
    this.printDebug = false;
    }
    
    update(){
        
        var moveSpeed = 0.1 * this.zoom;
        if (keyIsDown(KC_UP))
            this.pos.y -= moveSpeed;
        if (keyIsDown(KC_DOWN))
            this.pos.y += moveSpeed;
        if (keyIsDown(KC_LEFT))
            this.pos.x -= moveSpeed;
        if (keyIsDown(KC_RIGHT))
            this.pos.x += moveSpeed;
        if (keyIsDown(KC_UNZOOM))
            this.zoomAt(mouseX, mouseY, 0.95, false);
        if (keyIsDown(KC_ZOOM))
            this.zoomAt(mouseX, mouseY, 0.95, true);
        if (keyIsDown(KC_RESET))
        {
            this.size.x = this.origSize.x;
            this.size.y = this.origSize.y;
            this.pos.x = this.origPos.x;
            this.pos.y = this.origPos.y;
            this.zoom = this.origZoom;
        }
        const iteration = 5;
        if(keyIsDown(KC_ITERPLUS)){
            if(this.maxIter <=250){
                this.maxIter += iteration;
            }else this.maxIter = 300;
        }
        if(keyIsDown(KC_ITERMINUS)){
            if(this.maxIter > 0){
                this.maxIter -= iteration;
            }else this.maxIter = 0;
        }
        
    }
    
    zoomAt(x, y, ammount, isZoomIn){
        
        ammount = isZoomIn ? ammount : 1 / ammount;
        x = map(x, 0, width, this.pos.x - this.size.x / 2, this.pos.x + this.size.x / 2);
        y = map(y, height, 0,  this.pos.y - this.size.y / 2, this.pos.y + this.size.y / 2);
        this.pos.x = x + (this.pos.x - x) * ammount;
        this.pos.y = y + (this.pos.y - y) * ammount;
        this.zoom *= ammount;
        this.size.x = this.origSize.x * this.zoom;
        this.size.y = this.origSize.y * this.zoom;
        
    }
    
    plot(){
        
        loadPixels();
        
        var cX = this.pos.x + map(mouseX, 0, width, -this.size.x / 2, this.size.x / 2);//this is for Mandelbrot
        var cY = this.pos.y + map(mouseY, height, 0, -this.size.y / 2, this.size.y / 2);//this is for Mandelbrot
        
        for (var x = 0; x < width; x++) {
            for (var y = 0; y < height; y++) {
                var sqZ = new p5.Vector(0, 0);
                var z = new p5.Vector(
                                      this.pos.x + map(x, 0, width, -this.size.x / 2, this.size.x / 2),
                                      this.pos.y + map(y, height, 0, -this.size.y / 2, this.size.y / 2)
                                      );
                var c = new p5.Vector(z.x, z.y);
                
                var iter = 0;
                while (iter < this.maxIter) {
                    sqZ.x = z.x * z.x - z.y * z.y;
                    sqZ.y = 2 * z.x * z.y;
                    z.x = sqZ.x + c.x;
                    z.y = sqZ.y + c.y;
                    if (abs(z.x + z.y) > 16)
                        break;
                    iter++;
                }
                setPixelHSV(x, y, map(iter, 0, this.maxIter, 0, 1), 1, iter !== this.maxIter);
            }
        }
        updatePixels();
        if (this.printDebug) {
            //Frame reference
            
            stroke(220);
            strokeWeight(2);
            line(width/2, 0, width/2, height);
            line(0, height/2, width, height/2);
            ellipse(width/2, height/2, 8, 8);
            
            fill(255);
            stroke(0);
            strokeWeight(4);
            textSize(18);
            text("x: " + str( round( this.pos.x * 100 )/100 )
                 + "\ny: " + str( round( this.pos.y * 100 )/100 )
                 + "\nzoom: " + str( round(  (1 / this.zoom) * 100 )/100 )
                 + "\niterations: " + str( round(  (this.maxIter) * 100 )/100 )
                 , 5, 15
                 );
        }
        //draw constant label
        fill(255);
        stroke(0);
        strokeWeight(1.5);
        textSize(16);
        text("Mouse: (" + str(round(cX*100)/100.0) + "," + str(round(cY*100)/100.0) + ")", 5, height-15);
        
        var xc = mouseX;
        var yc = mouseY;
        fill(255);
        noStroke();
        ellipse(xc, yc, 8, 8);
        
    }
    
}




function setPixelRGB(x, y, r, g, b) {
    var pixelID = (x + y * width) * 4;
    pixels[pixelID + 0] = r;
    pixels[pixelID + 1] = g;
    pixels[pixelID + 2] = b;
    pixels[pixelID + 3] = 255;
}

function setPixelHSV(x, y, h, s, v) {
    var r, g, b, i, f, p, q, t;
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    setPixelRGB(x, y, Math.round(r * 1), Math.round(g * 255), Math.round(b * 255));
}
