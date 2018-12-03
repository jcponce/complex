/* Written in p5.js (https://p5js.org/)
 * Under Creative Commons License
 * https://creativecommons.org/licenses/by-sa/4.0/
 * Writen by Juan Carlos Ponce Campuzano, 28-Nov-2018
 * Original code by Kato https://www.openprocessing.org/user/114431
 */

// Last update ??

var julia = new Julia();
var changeC;
var c;

function keyReleased() {
    if (keyCode === 80)//P key
        julia.printDebug = !julia.printDebug;
}

function mouseWheel() {
    julia.zoomAt(mouseX, mouseY, 0.85, event.delta < 0);
}

let WIDTH = 500;
let HEIGHT = 500;

function setup() {
    createCanvas(WIDTH, HEIGHT);
    pixelDensity(1);//I need this for small devices
    changeC = true;
    c = new p5.Vector(0, 0);
    frameRate(60);
    
}

function windowResized() {
    resizeCanvas(500, 500);
}

function draw() {
    julia.update();
    julia.draw();
    console.log(changeC);
    
}

// KeyCodes available at: http://keycode.info/
const KC_UP = 87;        // Move up W
const KC_DOWN = 83;        // Move down S
const KC_LEFT = 65;        // Move left A
const KC_RIGHT = 68;    // Move right D
const KC_UNZOOM = 189;    // Zoom back -
const KC_ZOOM = 187;    // Zoom in +
const KC_RESET = 82;    // Reset zoom level and position R

function Julia() {
    this.origSize = new p5.Vector(3, 3);
    this.size = new p5.Vector(this.origSize.x, this.origSize.y);
    this.origPos = new p5.Vector(0, 0);//Origin position
    this.pos = new p5.Vector(this.origPos.x, this.origPos.y);
    this.maxIter = 130;
    this.origZoom = 1;
    this.zoom = this.origZoom;
    this.printDebug = false;
}
Julia.prototype.update = function () {
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
};
Julia.prototype.zoomAt = function(x, y, ammount, isZoomIn) {
    ammount = isZoomIn ? ammount : 1 / ammount;
    x = map(x, 0, width, this.pos.x - this.size.x / 2, this.pos.x + this.size.x / 2);
    y = map(y, height, 0, this.pos.y - this.size.y / 2, this.pos.y + this.size.y / 2);
    this.pos.x = x + (this.pos.x - x) * ammount;
    this.pos.y = y + (this.pos.y - y) * ammount;
    this.zoom *= ammount;
    this.size.x = this.origSize.x * this.zoom;
    this.size.y = this.origSize.y * this.zoom;
};
Julia.prototype.draw = function() {
    loadPixels();
    
    let mx = mouseX;
    let my = mouseY;
    let cX = this.pos.x + map(mx, 0, width, -this.size.x / 2, this.size.x / 2);//this is for Julia
    let cY = this.pos.y + map(my, height, 0, -this.size.y / 2, this.size.y / 2);//this is for Julia
    
    if (!changeC) {
        fill(255);
        noStroke();
        ellipse(mx, my, 8, 8);
    }else{
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
        fill(255, 255, 255, 255);
        text("x: " + str( round( this.pos.x * 100 )/100 )
             + "\ny: " + str( round( this.pos.y * 100 )/100 )
             + "\nzoom: " + str( round(  (1 / this.zoom) * 100 )/100 )
             , 5, 15
             );
    }
    //draw constant label
    fill(255);
    stroke(255);
    strokeWeight(1);
    textSize(13);
    text("c is (" + str(round(c.x * 100)/100.0) + "," + str(round(c.y * 100)/100.0) + ")", 5, height-15);
    
    
    fill(255);
    noStroke();
    ellipse(mx, my, 8, 8);
};

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
