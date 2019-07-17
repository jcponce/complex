/* Written in p5.js (https://p5js.org/)
 * Under Creative Commons License
 * https://creativecommons.org/licenses/by-sa/4.0/
 * Written by Juan Carlos Ponce Campuzano, 28-Nov-2018
 * Original code by Kato https://www.openprocessing.org/user/114431
 */

// Last update 02-Jul-2019


let julia;
let changeC;
let c;
let WIDTH = 500;
let HEIGHT = 500;
let sizePlot = false;
let prevmx = 0;
let prevmy = 0;

function setup() {
    createCanvas(WIDTH, HEIGHT);
    pixelDensity(1);//I need this for small devices
    julia = new DomainColoring();
    changeC = true;
    c = new p5.Vector(0, 0);
    frameRate(60);
    smooth();
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
    julia.update();
    julia.plot();
    console.log(changeC);
    
}

function keyReleased() {
    if (keyCode === 73)//I key
        julia.printDebug = !julia.printDebug;
    if (keyCode === 66){//B key
        sizePlot = !sizePlot;
    }
    windowResized();
}

function mouseWheel() {
    julia.zoomAt(mouseX, mouseY, 0.85, event.delta < 0);
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

class DomainColoring {
    
    constructor(){
        this.origSize = new p5.Vector(3, 3);
        this.size = new p5.Vector(this.origSize.x, this.origSize.y);
        this.origPos = new p5.Vector(0, 0);//Origin position
        this.pos = new p5.Vector(this.origPos.x, this.origPos.y);
        this.maxIter = 150;
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
            changeC = true;
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
        y = map(y, height, 0, this.pos.y - this.size.y / 2, this.pos.y + this.size.y / 2);
        this.pos.x = x + (this.pos.x - x) * ammount;
        this.pos.y = y + (this.pos.y - y) * ammount;
        this.zoom *= ammount;
        this.size.x = this.origSize.x * this.zoom;
        this.size.y = this.origSize.y * this.zoom;
    }
    
    plot(){
        
        loadPixels();
        
        let mx = constrain(mouseX, 0, width);
        let my = constrain(mouseY, 0, height);
        let cX = this.pos.x + map(mx, 0, width, -this.size.x / 2, this.size.x / 2);//this is for Julia
        let cY = this.pos.y + map(my, height, 0, -this.size.y / 2, this.size.y / 2);//this is for Julia
        
        if (changeC==true) {
            //fill(255);
            //noStroke();
            //ellipse(mx, my, 8, 8);
       
            c = new p5.Vector(cX, cY);
        }
        
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                var sqZ = new p5.Vector(0, 0);
                var z = new p5.Vector(
                                      this.pos.x + map(x, 0, width, -this.size.x / 2, this.size.x / 2),
                                      this.pos.y + map(y, height, 0, -this.size.y / 2, this.size.y / 2)
                                      );
                
                let iter = 0;
                while (iter < this.maxIter) {
                    sqZ.x = z.x * z.x - z.y * z.y;
                    sqZ.y = 2 * z.x * z.y;
                    z.x = sqZ.x + c.x;
                    z.y = sqZ.y + c.y;
                    if (abs(z.x + z.y) > 16)
                        break;
                    iter++;
                }
                setPixelHSV(x, y, map(iter, 0, this.maxIter, 0, 1), 0.8, 1);
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
        text("c is (" + str(round(c.x * 100)/100.0) + "," + str(round(c.y * 100)/100.0) + ")", 5, height-15);
        
        if(changeC){
            fill(255);
            strokeWeight(1);
            ellipse(mx, my, 8, 8);
            prevmx = mx;
            prevmy = my;
        }//else{
            //fill(255);
            //strokeWeight(3);
            //ellipse(prevmx, prevmy, 8, 8);
        //}
        
    }
    
}

function mouseClicked() {
        if (changeC) {
            changeC = false;
        } else {
            changeC = true;
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
    setPixelRGB(x, y, round(r * 55), round(g * 255), round(b * 255));
}
