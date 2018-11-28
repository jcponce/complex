/* Written in p5.js (https://p5js.org/)
 * Under Creative Commons License
 * https://creativecommons.org/licenses/by-sa/4.0/
 * Writen by Juan Carlos Ponce Campuzano, 12-Nov-2018
 * Original code by Kato https://www.openprocessing.org/user/114431
 */

// Last update ??

var mandelbrot = new Mandelbrot();

function keyReleased() {
    if (keyCode === 80)
        mandelbrot.printDebug = !mandelbrot.printDebug;
}

function mouseWheel() {
    mandelbrot.zoomAt(mouseX, mouseY, 0.85, event.delta < 0);
}

function setup() {
    createCanvas(500, 500);
}

function draw() {
    mandelbrot.update();
    mandelbrot.draw();
    
}

// KeyCodes available at: http://keycode.info/
const KC_UP = 87;        // Move up
const KC_DOWN = 83;        // Move down
const KC_LEFT = 65;        // Move left
const KC_RIGHT = 68;    // Move right
const KC_UNZOOM = 189;    // Zoom back
const KC_ZOOM = 187;    // Zoom in
const KC_RESET = 82;    // Reset zoom level and position

function Mandelbrot() {
    this.origSize = new Vec2D(3, 3);
    this.size = new Vec2D(this.origSize.x, this.origSize.y);
    this.origPos = new Vec2D(0, 0);//Origin position
    this.pos = new Vec2D(this.origPos.x, this.origPos.y);
    this.maxIter = 100;
    this.origZoom = 1;
    this.zoom = this.origZoom;
    this.printDebug = false;
}
Mandelbrot.prototype.update = function () {
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
};
Mandelbrot.prototype.zoomAt = function(x, y, ammount, isZoomIn) {
    ammount = isZoomIn ? ammount : 1 / ammount;
    x = map(x, 0, width, this.pos.x - this.size.x / 2, this.pos.x + this.size.x / 2);
    y = map(y, 0, height, this.pos.y - this.size.y / 2, this.pos.y + this.size.y / 2);
    this.pos.x = x + (this.pos.x - x) * ammount;
    this.pos.y = y + (this.pos.y - y) * ammount;
    this.zoom *= ammount;
    this.size.x = this.origSize.x * this.zoom;
    this.size.y = this.origSize.y * this.zoom;
};
Mandelbrot.prototype.draw = function() {
    loadPixels();
    
    var cX = this.pos.x + map(mouseX, 0, width, -this.size.x / 2, this.size.x / 2);//this is for Julia
    var cY = this.pos.y + map(mouseY, 0, height, -this.size.y / 2, this.size.y / 2);//this is for Julia
    
    for (var x = 0; x < width; x++) {
        for (var y = 0; y < height; y++) {
            var sqZ = new Vec2D(0, 0);
            var z = new Vec2D(
                              this.pos.x + map(x, 0, width, -this.size.x / 2, this.size.x / 2),
                              this.pos.y + map(y, 0, height, -this.size.y / 2, this.size.y / 2)
                              );
            var c = new Vec2D(z.x, z.y);
            
            var iter = 0;
            while (iter < this.maxIter) {
                sqZ.x = z.x * z.x - z.y * z.y;
                sqZ.y = 2 * z.x * z.y;
                z.x = sqZ.x + cX;//c.x for Mandel
                z.y = sqZ.y + cY;//c.y for Mandel
                if (abs(z.x + z.y) > 16)
                    break;
                iter++;
            }
            setPixelHSV(x, y, map(iter, 0, this.maxIter, 0, 1), 0.8, iter !== this.maxIter);
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
    text("c is (" + str(round(cX*100)/100.0) + "," + str(round(cY*100)/100.0) + ")", 5, height-15);
    
    var xc = mouseX;
    var yc = mouseY;
    fill(255);
    noStroke();
    ellipse(xc, yc, 8, 8);
};

function Vec2D(x, y) {
    this.x = x;
    this.y = y;
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
    setPixelRGB(x, y, Math.round(r * 255), Math.round(g * 255), Math.round(b * 255));
}


