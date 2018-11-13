/* Written in p5.js (https://p5js.org/)
 * Under Creative Commons License
 * https://creativecommons.org/licenses/by-sa/4.0/
 * Writen by Juan Carlos Ponce Campuzano, 12-Nov-2018
 */

// Last update ??

let clts = {

title: 'RGB Scheme',

lvlCurv: 'Phase',
    
funcRe: 'x',
funcIm: 'y',
    
displayXY: false,
size: 5,
centerX: 0,
centerY: 0,

Save: function () {
    save('myCanvas.png');
},
    
};

let lim, button, buttonSave;

let realText, imgText, boxText, optText, centerText;

let inpRe, inpIm, inpLim, inpCx, inpCy;

var funColor = (x, y) => 1 / 3 * (18 * (PI - atan2(y, -x)) / (2 * PI) - floor(18 * (PI - atan2(y, -x)) / (2 * PI))) + 0.7;

function setup() {
    createCanvas(470, 470);
    colorMode(RGB, 1);
    
    // create gui (dat.gui)
    let gui = new dat.GUI({
                          width: 289
                          });
    gui.add(clts, 'title').name("Color mode:");
    gui.add(clts, 'lvlCurv', ['Phase', 'Modulus', 'Phase/Modulus', 'None']).name("Level Curves:").onChange(mySelectOption);
    gui.add(clts, 'funcRe').name("Re(x, y) =").onChange(redraw);
    gui.add(clts, 'funcIm').name("Im(x, y) =").onChange(redraw);
    gui.add(clts, 'size').name("Size =").onChange(redraw);
    
    let cXY = gui.addFolder('Reference');
    cXY.add(clts, 'displayXY').name("Axes").onChange(redraw);
    cXY.add(clts, 'centerX').name("Center x =").onChange(redraw);
    cXY.add(clts, 'centerY').name("Center y =").onChange(redraw);
    
    gui.add(clts, 'Save').name("Save (png)");
    
    noLoop();
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
    let w = clts.size;
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
            
            let re = eval(clts.funcRe);
            let im = eval(clts.funcIm);
            
            x = re;
            y = im;
            
            // We color each pixel based on some cool function
            // Gosh, we could make fancy colors here if we wanted
            
            let h = (PI - atan2(y, -x)) / (2 * PI);//argument: 0 to 2pi??
            
            let b = funColor(x, y);
            set(i, j, color(h, b, 1));
            
            x1 += dx;
        }
        y1 += dy;
    }
    
    updatePixels();
}

function displayGrid() {
    stroke(0.2);
    strokeWeight(1.5);
    line(0, height / 2, width, height / 2); //x-axis
    line(width / 2, 0, width / 2, height); //y-axis
    textSize(16);
    fill(0.2);
    text('(' + clts.centerX + ',' + clts.centerY + ')', width / 2 + 2, height / 2 + 15);
    text('Im', width / 2 + 2, height / 2 - 210);
    text('Re', width / 2 + 210, height / 2 + 15);
    // Draw tick marks twice per step, and draw the halfway marks smaller.
    
    for (let j = 0; j <= height/2; j += height / clts.size) {
        for (let i = 0; i <= width/2; i += width / clts.size) {
            line(width / 2 - 4, height/2 - j, width / 2 + 4, height/2 - j);//yAxis positive ticks
            line(width / 2 - 4, height/2 + j, width / 2 + 4, height/2 + j);//yAxis negative ticks
            line(width / 2 + i, height/2 - 4, width/2 + i, height/2 + 4);//xAxis positive ticks
            line(width / 2 - i, height/2 - 4, width/2 - i, height/2 + 4);//xAxis negative ticks
        }
    }
    
}

function saveImg() {
    save('myCanvas.jpg');
}

function sat(x, y) {
    return 1 / 5 * log(5 * sqrt(x * x + y * y)) / log(2) - 1 / 5 * floor(log(5 * sqrt(x * x + y * y)) / log(2)) + 0.85;
}

function val(x, y) {
    return 1 / 3 * (18 * (PI - atan2(y, -x)) / (2 * PI) - floor(18 * (PI - atan2(y, -x)) / (2 * PI))) + 0.8;
}

function mySelectOption() {
    if (clts.lvlCurv == 'Phase') {
        funColor = (x, y) => val(x, y);
    } else if (clts.lvlCurv == 'Modulus') {
        funColor = (x, y) => sat(x, y);
    } else if (clts.lvlCurv == 'Phase/Modulus') {
        funColor = (x, y) => val(x, y) * sat(x, y);
    } else if (clts.lvlCurv == 'None') {
        funColor = (x, y) => 1;
    }
    redraw();
}
