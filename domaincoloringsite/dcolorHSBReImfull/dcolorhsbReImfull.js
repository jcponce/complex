/* Written in p5.js (https://p5js.org/)
 * Under Creative Commons License
 * https://creativecommons.org/licenses/by-sa/4.0/
 * Written by Juan Carlos Ponce Campuzano, 12-Nov-2018
 */

// Last update 18-Feb-2019

// --Control variables--
let clts = {

title: 'HSB Scheme',

lvlCurv: 'Re/Im',
phaseOption: '[0, 2pi)',
    
funcZ: 'z.pow(2)',
    
displayXY: false,
size: 2.5,
centerX: 0,
centerY: 0,

Update: function () {
    redraw();
},

Save: function () {
    save('plotfz.png');
},

sizePlot: false,
    
};

let w, h, posRe, posIm;

var funPhase = (x, y) => (PI - atan2(y, -x)) / (2 * PI);

var sat = (x, y) => (abs( 3*sin( 2* PI * (log(sqrt( x*x + y*y ))/log(2) - floor( log(sqrt(x*x + y*y ))/log(2))  ))));

var val = (x, y) => sqrt(sqrt(abs( sin(3 * PI * y) * sin(3 * PI * x) )));

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
    cXY.add(clts, 'phaseOption', ['[0, 2pi)', '(-pi, pi]'] ).name("Arg(z): ").onChange(myPhaseOption);
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
    w = clts.size * 2;
    h = (w * height) / width;
    
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
            
            let h = funPhase(x, y);
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
    
    stroke(0);
    strokeWeight(2);
    line(0, height / 2, width, height / 2); //x-axis
    line(width / 2, 0, width / 2, height); //y-axis
    textSize(12);
    fill(1);
    text('(' + clts.centerX + ',' + clts.centerY + ')', width / 2 + 2, height / 2 + 15);
    
    //position Tags for Re and Im
    if(clts.sizePlot == true){
        posRe = 320;
        posIm = -240;
    } else{
        posRe = 210;
        posIm = -210;
    }
    text('Im', width / 2 + 2 - 25, height / 2 + posIm);
    text('Re', width / 2 + posRe, height / 2 - 10);
    
    // Draw tick marks twice per step, and draw the halfway marks smaller.
    textSize(14);
    for (let j = 0; j <= height/2; j += height / ((clts.size * 2 * height) / width)) {
        for (let i = 0; i <= width/2; i += width / (clts.size * 2)) {
            stroke(0, 0, 0.6);
            line(width / 2 - 4, height/2 - j, width / 2 + 4, height/2 - j);//yAxis positive ticks
            line(width / 2 - 4, height/2 + j, width / 2 + 4, height/2 + j);//yAxis negative ticks
            line(width / 2 + i, height/2 - 4, width/2 + i, height/2 + 4);//xAxis positive ticks
            line(width / 2 - i, height/2 - 4, width/2 - i, height/2 + 4);//xAxis negative ticks
            stroke(0);
            fill(0, 0, 0.9);
            //var nX = Math.abs(clts.centerX);
            //var decimalsX = nX - Math.floor(nX);
            //var nY = Math.abs(clts.centerY);
            //var decimalsY = nY - Math.floor(nY);
            if(j>0){
                let setPY = map(j, 0, height/2, 0, h/2) + clts.centerY;
                let setNY = -(map(j, 0, height/2, 0, h/2) - clts.centerY);
                //let setPY = map(j, 0, height/2, 0, h/2) + clts.centerY;
                //let setNY = -map(j, 0, height/2, 0, h/2) + clts.centerY;
                //let setPY = map(j, 0, height/2, 0, w/2) + clts.centerY;
                //let setNY = -(map(j, 0, height/2, 0, w/2) - clts.centerY);
                text('' + str(round(setPY * 10)/10.0), width / 2 - 4+9, height/2 - j + 3);//Y-Positive
                text('' + str(round(setNY * 10)/10.0), width / 2 - 4+9, height/2 + j + 3);//Y-Negative
            }//str(round(c.x * 100)/100.0)
            if(i>0){
                let setPX = map(i, 0, width/2, 0, w/2) + clts.centerX;
                let setNX = -(map(i, 0, width/2, 0, w/2) - clts.centerX);
                text('' + str(round(setPX * 10)/10.0), width / 2 + i, height/2 - 4 + 18);//X-Positive
                text('' + str(round(setNX * 10)/10.0), width / 2 - i, height/2 - 4 + 18);//X-Negative
            }
        }
    }
    
}

//z.pow(0).div(z.pow(0).sub(z.pow(2)).sqrt())
function mySelectOption() {
    if (clts.lvlCurv == 'Real') {
        funColorS = (x, y) => 1;
        funColorV = (x, y) => sqrt(sqrt(abs( sin(3 * PI * x) )));
    } else if (clts.lvlCurv == 'Imaginary') {
        funColorS = (x, y) => 1;
        funColorV = (x, y) => sqrt(sqrt(abs( sin(3 * PI * y) )));
    } else if (clts.lvlCurv == 'Re/Im') {
        funColorS = (x, y) => 1;
        funColorV = (x, y) => sqrt(sqrt(abs( sin(3 * PI * y) * sin(3 * PI * x) )));
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

function myPhaseOption() {
    if (clts.phaseOption == '[0, 2pi)') {
        funPhase = (x, y) => (PI - atan2(y, -x)) / (2 * PI);
    } else if (clts.phaseOption == '(-pi, pi]') {
        funPhase = (x, y) => (PI + atan2(y, x)) / (2 * PI);
    }
    redraw();
}
