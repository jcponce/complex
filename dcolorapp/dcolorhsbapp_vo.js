/* Written in p5.js (https://p5js.org/)
 * Under Creative Commons License
 * https://creativecommons.org/licenses/by-sa/4.0/
 * Writen by Juan Carlos Ponce Campuzano, 12-Nov-2018
 */

// Last update ??

let lim, button, buttonSave;

let realText, imgText, boxText, optText, centerText;

let inpRe, inpIm, inpLim, inpCx, inpCy;

let funColor = (x , y) => 1 / 3 *(18*(PI - atan2(y,-x)) / (2*PI) - floor(18*(PI - atan2(y,-x)) / (2*PI))) + 0.7;

function setup() {
    createCanvas(470, 470);
    colorMode(HSB, 1);
    controls();
    noLoop();
}

function draw() {
    background(255);
    
    // Establish a range of values on the complex plane
    // A different range will allow us to "zoom" in or out on the fractal
    
    // It all starts with the width, try higher or lower values
    let w = eval(inpLim.value());
    let h = (w * height) / width;
    
    // Start at negative half the width and height
    let xmin = -w / 2 + eval(inpCx.value());
    let ymin = -h / 2 - eval(inpCy.value());
    
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
            let y = -y1;//Here we need minus since the y-axis in canvas is upside down
            
            let re = eval(inpRe.value());
            let im = eval(inpIm.value());
            
            x = re;
            y = im;
            
            // We color each pixel based on some cool function
            // Gosh, we could make fancy colors here if we wanted
            
            let h = (PI - atan2(y, -x))/(2*PI);
            
            let b = funColor(x, y);
            set(i, j, color(h, 1, b));
            
            x1 += dx;
        }
        y1 += dy;
    }
    
    updatePixels();
    
}

function saveImg(){
    save('myCanvas.jpg');
}

function sat(x, y) {
    return 1/5 * log( 5 * sqrt( x * x + y * y )) / log(1.5) - 1/5 * floor( log( 5 * sqrt( x * x + y * y )) / log(1.5)) + 0.85;
}

function val(x, y) {
    return 1 / 3 * (18 * (PI - atan2(y,-x)) / (2*PI) - floor(18*(PI - atan2(y,-x)) / (2*PI))) + 0.7;
}

function mySelectEvent() {
    if( colorFn.value() == 'Phase' ) {
        funColor = (x , y) => 1 / 3 *(18*(PI - atan2(y,-x)) / (2*PI) - floor(18*(PI - atan2(y,-x)) / (2*PI))) + 0.7;
    } else if( colorFn.value() == 'Modulus' ) {
        funColor = (x,y) => 1/5 * log(5 * sqrt(x * x + y * y))/log(1.3) - 1/5 * floor(log(5 * sqrt(x * x + y * y))/log(1.3)) + 0.75;
    } else if( colorFn.value() == 'Phase/Modulus' ) {
        funColor = (x , y) => val(x,y) * sat(x, y);
    } else if( colorFn.value() == 'None' ) {
        funColor = (x,y) => 1;
    }
    redraw();
}
