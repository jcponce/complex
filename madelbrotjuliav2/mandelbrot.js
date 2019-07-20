/* Written in p5.js (https://p5js.org/)
 * Under Creative Commons License
 * https://creativecommons.org/licenses/by-sa/4.0/
 * Written by Juan Carlos Ponce Campuzano, 19-Jul-2019
 * Original code by Kato https://www.openprocessing.org/user/114431
 */

// Last update 19-Jul-2019

class MandelbrotSet {
    
    constructor(w_, s_){
        this.initial = s_;
        this.widthSet = w_;
        this.origSize = new p5.Vector(this.initial, this.initial);
        this.size = new p5.Vector(this.origSize.x, this.origSize.y);
        this.origPos = new p5.Vector(-0.7, 0);//Origin position
        this.pos = new p5.Vector(this.origPos.x, this.origPos.y);
        this.maxIter = 100;
        this.origZoom = 1;
        this.zoom = this.origZoom;
        this.printDebug = false;
        this.cX = 0;
        this.cY = 0;
    }
    
    update(){
        
        var moveSpeed = 0.1 * this.zoom;
        if ( keyIsDown(KC_UP))
            this.pos.y -= moveSpeed;
        if ( keyIsDown(KC_DOWN))
            this.pos.y += moveSpeed;
        if ( keyIsDown(KC_LEFT))
            this.pos.x -= moveSpeed;
        if ( keyIsDown(KC_RIGHT))
            this.pos.x += moveSpeed;
        if ( keyIsDown(KC_UNZOOM))
            this.zoomAt(width/2, height/2, 0.95, false);
        if ( keyIsDown(KC_ZOOM))
            this.zoomAt(width/2, height/2, 0.95, true);
        if (keyIsDown(KC_RESET))
        {
            this.size.x = this.origSize.x;
            this.size.y = this.origSize.y;
            this.pos.x = this.origPos.x;
            this.pos.y = this.origPos.y;
            this.zoom = this.origZoom;
        }
        this.maxIter = clts.iter;
        
    }
    
    zoomAt(x, y, ammount, isZoomIn){
        
        ammount = isZoomIn ? ammount : 1 / ammount;
        x = map(x, 0, this.widthSet, this.pos.x - this.size.x / 2, this.pos.x + this.size.x / 2);
        y = map(y, height, 0,  this.pos.y - this.size.y / 2, this.pos.y + this.size.y / 2);
        this.pos.x = x + (this.pos.x - x) * ammount;
        this.pos.y = y + (this.pos.y - y) * ammount;
        this.zoom *= ammount;
        this.size.x = this.origSize.x * this.zoom;
        this.size.y = this.origSize.y * this.zoom;
        
    }
    
    plot(){
        
        loadPixels();
        
        this.cX = this.pos.x + map(mouseX, 0, this.widthSet, -this.size.x / 2, this.size.x / 2);//this is for Mandelbrot
        this.cY = this.pos.y + map(mouseY, height, 0, -this.size.y / 2, this.size.y / 2);//this is for Mandelbrot
        
        for (var x = 0; x < this.widthSet; x++) {
            for (var y = 0; y < height; y++) {
                var sqZ = new p5.Vector(0, 0);
                var z = new p5.Vector(
                                      this.pos.x + map(x, 0, this.widthSet, -this.size.x / 2, this.size.x / 2),
                                      this.pos.y + map(y, height, 0, -this.size.y / 2, this.size.y / 2)
                                      );
                var c = new p5.Vector(z.x, z.y);
                
                var iter = 0;
                while (iter < this.maxIter) {
                    sqZ.x = z.x * z.x - z.y * z.y;
                    sqZ.y = 2 * z.x * z.y;
                    z.x = sqZ.x + c.x;
                    z.y = sqZ.y + c.y;
                    if ((z.x*z.x + z.y*z.y) > 35)
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
            line((width+ctlsBack)/2, 0, (width+ctlsBack)/2, height);
            line(ctlsBack, height/2, (width+ctlsBack), height/2);
            ellipse((width+ctlsBack)/2, height/2, 8, 8);
            
            fill(255);
            stroke(0);
            strokeWeight(4);
            textSize(18);
            text("x: " + str( round( this.pos.x * 1000 )/1000 )
                 + "\ny: " + str( round( this.pos.y * 1000 )/1000 )
                 + "\nzoom: " + str( round(  (1 / this.zoom) * 1000 )/1000 )
                 + "\niterations: " + str( round(  (this.maxIter) * 1000 )/1000 )
                 ,  10, 15
                 );
        }
        //draw constant label
        fill(255);
        stroke(0);
        strokeWeight(2);
        textSize(18);
        text("c= (" + str(round(this.cX*1000)/1000.0) + "," + str(round(this.cY*1000)/1000.0) + ")",  10, height-15);
        
        var xc = mouseX;
        var yc = mouseY;
        fill(255);
        stroke(0);
        var radius = 2;
        ellipse(xc, yc, radius*2, radius*2);
        
    }
    
}


