/* Written in p5.js (https://p5js.org/)
 * Under Creative Commons License
 * https://creativecommons.org/licenses/by-sa/4.0/
 * Writen by Juan Carlos Ponce Campuzano, 12-Nov-2018
 * Original code by Kato https://www.openprocessing.org/user/114431
 */

// Last update ??

function Mandelbrot() {
    this.origSize = new Vec2D(3, 3);
    this.size = new Vec2D(this.origSize.x, this.origSize.y);
    this.origPos = new Vec2D(-0.7, 0);
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
                z.x = sqZ.x + c.x;
                z.y = sqZ.y + c.y;
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
        text("x: " + this.pos.x
             + "\ny: " + this.pos.y
             + "\nzoom: " + (1 / this.zoom)
             , 5, 15
             );
    }
};


