let phasePortrait;
let changeC;
let c;
let WIDTH = 510;
let HEIGHT = 510;
let f = (z) => z.pow(2);
let sizePlot = false;

let prevmx = 0;
let prevmy = 0;

// --Control variables dat.gui--
let clts = {
    
title: 'HSB Scheme',
//phaseOption: '[0, 2pi)',
    
lvlCurv: 'Phase',
    
funcZ: 'z^2',

ZoomIn: '+',
ZoomOut: '-',

    
//displayXY: false,
//size: 2.5,
//centerX: 0,
//centerY: 0,
    
//Update: function () {
//    redraw();
//},
    
Save: function () {
    save('plotfz.png');
},
};
//end controls dat.gui

function setup() {
    createCanvas(WIDTH, HEIGHT);
    pixelDensity(1);//I need this for small devices
    phasePortrait = new DomainColoring();
    changeC = true;
    c = new p5.Vector(0, 0);
    //frameRate(60);
    smooth();
    
    // create gui (dat.gui)
    let gui = new dat.GUI({
                          width: 301
                          });
    gui.add(clts, 'title').name("Color mode:");
    //gui.add(clts, 'lvlCurv', ['Phase', 'Modulus', 'Phase/Modulus', 'None']).name("Level Curves:").onChange(mySelectOption);
    gui.add(clts, 'funcZ').name("f(z) =");
    //gui.add(clts, 'size', 0.00001, 15).name("|Re z| <");
    //gui.add(clts, 'Update').name("Update values");
    
    gui.add(clts, 'Save').name("Save (png)");
    
    //let cXY = gui.addFolder('Control Keys');
    //cXY.add(clts, 'ZoomIn');
    //cXY.add(clts, 'ZoomOut');
    //cXY.add(clts, 'phaseOption', ['[0, 2pi)', '(-pi, pi]'] ).name("Arg(z): ").onChange(myPhaseOption);
    //cXY.add(clts, 'displayXY').name("Axes").onChange(redraw);
    //cXY.add(clts, 'centerX').name("Center x =").onChange(keyPressed);
    //cXY.add(clts, 'centerY').name("Center y =").onChange(keyPressed);
    //cXY.add(clts, 'sizePlot').name("Landscape").onChange(windowResized);
    noLoop();
}

//function windowResized() {
//    resizeCanvas(510, 510);
//}

function draw() {
    cursor(HAND);
    phasePortrait.update();
    phasePortrait.plot();
    //console.log(sizePlot);
    
}

function keyReleased() {
    if (keyCode === 191)//P key
        phasePortrait.printDebug = !phasePortrait.printDebug;
        redraw();
    if (keyCode === 70){//F key
        sizePlot = !sizePlot;
        redraw();
    }
    windowResized();
}


//function mouseWheel() {
//    phasePortrait.zoomAt(mouseX, mouseY, 0.85, event.delta < 0);
//}

// KeyCodes available at: http://keycode.info/
const KC_UP = 38;        // Move up W
const KC_DOWN = 40;        // Move down S
const KC_LEFT = 37;        // Move left A
const KC_RIGHT = 39;    // Move right D
const KC_UNZOOM = 189;    // Zoom back -
const KC_ZOOM = 187;    // Zoom in +
const KC_RESET = 82;    // Reset zoom level and position R
const KC_FULLSCREEN = 70; //Full screen

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
        if (keyIsDown(KC_UP)){
            this.pos.y -= moveSpeed;
            //redraw();
            
        }
        if (keyIsDown(KC_DOWN)){
            this.pos.y += moveSpeed;
            //redraw();
            
        }
        if (keyIsDown(KC_LEFT)){
            this.pos.x -= moveSpeed;
            //redraw();
            
        }
        if (keyIsDown(KC_RIGHT)){
            this.pos.x += moveSpeed;
            //redraw();
            
        }
        if (keyIsDown(KC_UNZOOM)){
            this.zoomAt(mouseX, mouseY, 0.95, false);
            //redraw();
            
        }
        if (keyIsDown(KC_ZOOM)){
            this.zoomAt(mouseX, mouseY, 0.95, true);
            //redraw();
            
        }
        if (keyIsDown(KC_RESET))
        {
            this.size.x = this.origSize.x;
            this.size.y = this.origSize.y;
            this.pos.x = this.origPos.x;
            this.pos.y = this.origPos.y;
            this.zoom = this.origZoom;
            changeC = true;
            //redraw();
        }
        
    }//end update
    
    zoomAt(x, y, ammount, isZoomIn){
        
        ammount = isZoomIn ? ammount : 1 / ammount;
        x = map(x, 0, width, this.pos.x - this.size.x / 2, this.pos.x + this.size.x / 2);
        y = map(y, height, 0, this.pos.y - this.size.y / 2, this.pos.y + this.size.y / 2);
        this.pos.x = x + (this.pos.x - x) * ammount;
        this.pos.y = y + (this.pos.y - y) * ammount;
        this.zoom *= ammount;
        this.size.x = this.origSize.x * this.zoom;
        this.size.y = this.origSize.y * this.zoom;
    }//end zoomAt
    
    plot(){
        
        loadPixels();
        
        let mx = constrain(mouseX, 0, width);
        let my = constrain(mouseY, 0, height);
        
        let cX = this.pos.x + map(mx, 0, width, -this.size.x / 2, this.size.x / 2);//this is for Julia
        let cY = this.pos.y + map(my, height, 0, -this.size.y / 2, this.size.y / 2);//this is for Julia
        
        //c = new p5.Vector(cX, cY);
        if (!changeC) {
        //    fill(255);
        //    noStroke();
            //ellipse(mx, my, 8, 8);
        }else{
           c = new p5.Vector(cX, cY);
        }
        
        let z = trimN(clts.funcZ);
        let parsed = complex_expression(z);
        
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                //var sqZ = new p5.Vector(0, 0);
                //var zc = new p5.Vector(
                                      //this.pos.x + map(x, 0, width, -this.size.x / 2, this.size.x / 2),
                                      //this.pos.y + map(y, height, 0, -this.size.y / 2, this.size.y / 2)
                                      //);
                //let z = Complex({re: zc.x, im: zc.y})
                let vz = {
                    r:this.pos.x + map(x, 0, width, -this.size.x / 2, this.size.x / 2),
                    i:this.pos.y + map(y, height, 0, -this.size.y / 2, this.size.y / 2)
                };
                
                let w = parsed.fn(vz);//eval(clts.funcZ);
                //let iter = 0;
                //while (iter < this.maxIter) {
                    //sqZ.x = z.x;
                    //sqZ.y = z.y;
                    vz.x = w.r;
                    vz.y = w.i;
                //    if (abs(z.x + z.y) > 16)
                //        break;
                //    iter++;
                //}
                setPixelHSV(x, y, map(atan2(-vz.y, -vz.x), -PI, PI, 0, 1), 1, 1);
            }
        }
        updatePixels();
        if (this.printDebug) {
            //Frame reference
            fill(0);
            stroke(0);
            strokeWeight(2);
            line(width/2, 0, width/2, height);
            line(0, height/2, width, height/2);
            ellipse(width/2, height/2, 8, 8);
            
            //text info
            fill(255);
            stroke(0);
            strokeWeight(4);
            textSize(18);
            text("x: " + str( round( this.pos.x * 100 )/100 )
                 + "\ny: " + str( round( this.pos.y * 100 )/100 )
                 + "\nzoom: " + str( round(  (1 / this.zoom) * 100 )/100 )
                 , 5, 15
                 );
        }
        //draw constant label
        fill(255);
        stroke(0);
        strokeWeight(3);
        textSize(16);
        text("(" + str(round(c.x * 100)/100.0) + "," + str(round(c.y * 100)/100.0) + ")", 5, height-15);
        
        if(changeC){
            fill(255);
            strokeWeight(1);
            ellipse(mx, my, 8, 8);
            prevmx = mx;
            prevmy = my;
        }else{
            fill(255);
            ellipse(prevmx, prevmy, 8, 8);
        }
        
        
    }//end plot
    
    
    
}

function trimN(s) {
    if (s.trim) {
        return s.trim();
    }
    return s.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
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
    setPixelRGB(x, y, round(r * 255), round(g * 255), round(b * 255));
}



function windowResized() {
    if(sizePlot== true){
        resizeCanvas(700, 700);
    } else{
        resizeCanvas(510, 510);
    }
}
