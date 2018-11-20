/* Written in p5.js (https://p5js.org/)
 * Under Creative Commons License
 * https://creativecommons.org/licenses/by-sa/4.0/
 * Writen by Juan Carlos Ponce Campuzano, 12-Nov-2018
 */

// Last update ??

let clts = {

title: 'HSB Scheme',

lvlCurv: 'Re/Im',
    
funcZ: 'z.pow(2)',
    
displayXY: false,
size: 2.5,
centerX: 0,
centerY: 0,

Update: function () {
    redraw();
},

Save: function () {
    save('myCanvas.png');
},

sizePlot: false,
    
};

let lim, button, buttonSave;

let realText, imgText, boxText, optText, centerText;

let inpRe, inpIm, inpLim, inpCx, inpCy;

var sat = (x, y) => (abs( 3*sin( 2* PI * (log(sqrt( x*x + y*y ))/log(2) - floor( log(sqrt(x*x + y*y ))/log(2))  ))));

var val = (x, y) => sqrt(sqrt(abs( sin(4 * PI * y) * sin(4 * PI * x) )));

var bothSatVal = (x, y) => 0.5 * ((1 - sat(x,y)) + val(x,y) + sqrt((1 - sat(x,y) - val(x,y)) * (1 - sat(x,y) - val(x,y)) + 0.01));

var funColorS = (x, y) => 1;

var funColorV = (x, y) => val(x, y);

function setup() {
    createCanvas(470, 470);
    colorMode(HSB, 1);
    
    // create gui (dat.gui)
    let gui = new dat.GUI({
                          width: 300
                          });
    gui.add(clts, 'title').name("Color mode:");
    gui.add(clts, 'lvlCurv', ['Real', 'Imaginary', 'Re/Im', 'Modulus', 'All', 'None']).name("Level Curves:").onChange(mySelectOption);
    gui.add(clts, 'funcZ').name("f(z) =");
    gui.add(clts, 'size', 0.00001, 100).name("|Re z| <");
    gui.add(clts, 'Update').name("Update vals");
    
    let cXY = gui.addFolder('Display Options');
    cXY.add(clts, 'displayXY').name("Axes").onChange(redraw);
    cXY.add(clts, 'centerX').name("Center x =").onChange(keyPressed);
    cXY.add(clts, 'centerY').name("Center y =").onChange(keyPressed);
    cXY.add(clts, 'sizePlot').name("Landscape").onChange(windowResized);
    
    gui.add(clts, 'Save').name("Save (png)");
    
    noLoop();
}

function windowResized() {
    if(clts.sizePlot == true){
        resizeCanvas(750, 550);
    } else{
        resizeCanvas(470, 470);
    }
}

function keyPressed() {
    if (keyCode === ENTER) {
        redraw();
    }
}

function draw() {
    
    background(255);
    
    plot();
    
    if (clts.displayXY == true) {
        displayGrid();
    }
    
}


function plot() {
    // Establish a range of values on the complex plane
    // A different range will allow us to "zoom" in or out on the fractal
    
    // It all starts with the width, try higher or lower values
    let w = clts.size * 2;
    let h = (w * height) / width;
    
    // Start at negative half the width and height
    let xmin = -w / 2 + clts.centerX;
    let ymin = -h / 2 - clts.centerY;
    
    // Make sure we can write to the pixels[] array.
    // Only need to do this once since we don't do any other drawing.
    loadPixels();
    
    // x goes from xmin to xmax
    let xmax = xmin + w;
    // y goes from ymin to ymax
    let ymax = ymin + h;
    
    // Calculate amount we increment x,y for each pixel
    let dx = (xmax - xmin) / (width);
    let dy = (ymax - ymin) / (height);
    
    let cX = map(mouseX, 0, width, xmin, xmax);
    let cY = map(mouseY, height, 0, ymin, ymax);
    
    // Start y
    let y1 = ymin;
    
    for (let j = 0; j < height; j++) {
        // Start x
        let x1 = xmin;
        for (let i = 0; i < width; i++) {
            
            let x = x1;
            let y = -y1; //Here we need minus since the y-axis in canvas is upside down
            
            let z = new Complex({ re: x, im: y });
            
            let w = eval(clts.funcZ);
            
            x = w.re;
            y = w.im;
            
            // We color each pixel based on some cool function
            // Gosh, we could make fancy colors here if we wanted
            
            let h = (PI - atan2(y, -x)) / (2 * PI);
            let s = funColorS(x, y);
            let b = funColorV(x, y);
            set(i, j, color(h, s, b));
            
            x1 += dx;
        }
        y1 += dy;
    }
    
    updatePixels();
}

function displayGrid() {
    
    if(clts.lvlCurv == 'Modulus' || clts.lvlCurv == 'None'){
        stroke(0);
    } else {
        stroke(1);
    }
    
    strokeWeight(1.5);
    line(0, height / 2, width, height / 2); //x-axis
    line(width / 2, 0, width / 2, height); //y-axis
    
    for (let j = 0; j <= height/2; j += height / ((clts.size * 2 * height) / width)) {
        for (let i = 0; i <= width/2; i += width / (clts.size * 2)) {
            line(width / 2 - 4, height/2 - j, width / 2 + 4, height/2 - j);//yAxis positive ticks
            line(width / 2 - 4, height/2 + j, width / 2 + 4, height/2 + j);//yAxis negative ticks
            line(width / 2 + i, height/2 - 4, width/2 + i, height/2 + 4);//xAxis positive ticks
            line(width / 2 - i, height/2 - 4, width/2 - i, height/2 + 4);//xAxis negative ticks
        }
    }
    
    textSize(16);
    stroke(0);
    fill(1);
    text('(' + clts.centerX + ',' + clts.centerY + ')', width / 2 + 2, height / 2 + 15);
    text('Im', width / 2 + 2, height / 2 - 210);
    text('Re', width / 2 + 210, height / 2 + 15);
    // Draw tick marks twice per step, and draw the halfway marks smaller.
    
    
    
}

function saveImg() {
    save('myCanvas.jpg');
}
//z.pow(0).div(z.pow(0).sub(z.pow(2)).sqrt())
function mySelectOption() {
    if (clts.lvlCurv == 'Real') {
        funColorS = (x, y) => 1;
        funColorV = (x, y) => sqrt(sqrt(abs( sin(4 * PI * x) )));
    } else if (clts.lvlCurv == 'Imaginary') {
        funColorS = (x, y) => 1;
        funColorV = (x, y) => sqrt(sqrt(abs( sin(4 * PI * y) )));
    } else if (clts.lvlCurv == 'Re/Im') {
        funColorS = (x, y) => 1;
        funColorV = (x, y) => sqrt(sqrt(abs( sin(4 * PI * y) * sin(4 * PI * x) )));
    } else if (clts.lvlCurv == 'Modulus') {
        funColorS = (x, y) => sat(x, y);
        funColorV = (x, y) => 1;
    }else if (clts.lvlCurv == 'All') {
        funColorS = (x, y) => sat(x, y);
        funColorV = (x, y) => bothSatVal(x, y);
    } else if (clts.lvlCurv == 'None') {
        funColorS = (x, y) => 1;
        funColorV = (x, y) => 1;
    }
    redraw();
}

