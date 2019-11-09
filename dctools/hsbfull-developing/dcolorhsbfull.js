/* Written in p5.js (https://p5js.org/)
 * Under Creative Commons License
 * https://creativecommons.org/licenses/by-sa/4.0/
 * Written by Juan Carlos Ponce Campuzano, 12-Nov-2018
 
 * Last update 07-Nov-2019
 */

// --Control variables--
let clts = {

lvlCurv: 'Modulus',
    
funcZ: 'z',
    
displayXY: false,
size: 2.5,
centerX: 0,
centerY: 0,

Save: function () {
    save('plotfz.png');
},
    
canvasSize: 'Square'
    
};

//var new_expression = $('#equation-input').val();

let input;

function setup() {
    createCanvas(1024, 1024);
    colorMode(HSB, 1);
    smooth();
    pixelDensity(1);
    
    // create gui (dat.gui)
    let gui = new dat.GUI({
                          width: 360
                          });
    //gui.add(clts, 'funcZ').name("f(z) =");
    gui.add(clts, 'lvlCurv', ['Phase', 'Modulus', 'Phase/Modulus', 'None']).name("Level Curves:").onChange(mySelectOption);
    gui.add(clts, 'size', 0.00001, 15).name("|Re z| <").onChange(keyPressed);
    gui.add(clts, 'Save').name("Save (png)");
    
    gui.add(clts, 'displayXY').name("Axes").onChange(redraw);
    gui.add(clts, 'centerX').name("Center x =").onChange(keyPressed);
    gui.add(clts, 'centerY').name("Center y =").onChange(keyPressed);
    gui.add(clts, 'canvasSize', ['Square', 'Landscape', 'Full-Screen'] ).name("Size: ").onChange(screenSize);
    
    /*
    let cXY = gui.addFolder('Display Options');
    cXY.add(clts, 'displayXY').name("Axes").onChange(redraw);
    cXY.add(clts, 'centerX').name("Center x =").onChange(keyPressed);
    cXY.add(clts, 'centerY').name("Center y =").onChange(keyPressed);
    cXY.add(clts, 'canvasSize', ['Square', 'Landscape', 'Full-Screen'] ).name("Size: ").onChange(screenSize);
     */
    
    input = createInput('(z-1)/(z^2+z+1)');
    //input.size(200, 20);
    input.addClass('body');
    input.addClass('container');
    input.addClass('full-width');
    input.addClass('dark-translucent');
    input.addClass('input-control');
    //input.addClass('equation-input');
    input.attribute('placeholder', 'Input complex expression, e.g. 1 / (z^2 + i)^2 - log(z)');
    input.style('color: #ffffff');
    
    noLoop();
}

function draw() {
    
    background(255);
    
    plot();
    
    if (clts.displayXY == true) {
        displayGrid();
    }
    //var z0 = trimN(new_expression);
    //var parsed = complex_expression(z0);//Define function
    //console.log();
    
}

// --Coloring the pixels--
// First I need to define the functions to color pixels

let funPhase = (x, y) => (PI - atan2(y, -x)) / (2 * PI);

let sharp = 1/3;
let nContour = 16;

let funColor = (x, y) => sharp * ( log(sqrt(x * x + y * y)) / log(1.6) - floor(log(sqrt(x * x + y * y)) / log(1.6)) ) + 0.7;//sharp * (nContour * (PI - atan2(y, -x)) / (2 * PI) -  floor(nContour * (PI - atan2(y, -x)) / (2 * PI))) + 0.7;

function sat(x, y) {
    let satAux =  log(sqrt(x * x + y * y)) / log(1.6);
    return sharp * ( satAux - floor(satAux) ) + 0.7;
}

function val(x, y) {
    let valAux = nContour * funPhase(x,y);
    return sharp * ( valAux - floor( valAux) ) + 0.7;
}//end coloring functions


// Now we color the pixels

let w, h, posRe, posIm;

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
    let ytemp = ymin;
    
    //let z = trimN(clts.funcZ);
    let z = trimN(input.value());
    let parsed = complex_expression(z);//Define function
    
    for (let j = 0; j < height; j++) {
        // Start x
        let xtemp = xmin;
        for (let i = 0; i < width; i++) {
            
            let x = xtemp;
            let y = -ytemp; //Here we need minus since the y-axis in canvas is upside down
            
            let vz = {r:x, i:y};
            
            let w = parsed.fn(vz);//Evaluate function
            
            x = w.r;
            y = w.i;
            
            // We color each pixel based on some cool function
            // Gosh, we could make fancy colors here if we wanted
            
            let h = funPhase(x, y);
            
            let b = funColor(x, y);
            set(i, j, color(h, 1, b));
            
            xtemp += dx;
        }
        ytemp += dy;
    }
    
    updatePixels();
}


//--This function displays the axes for reference--

function displayGrid() {
    stroke(0);
    strokeWeight(2);
    line(0, height / 2, width, height / 2); //x-axis
    line(width / 2, 0, width / 2, height); //y-axis
    textSize(14);
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
    let txtsize = map(size, 0, 15, 14, 8);
    let txtStroke = map(size, 0, 15, 2, 0.5);
    strokeWeight(txtStroke);
    textSize(txtsize);
    let r = 3;
    for (let j = 0; j <= height/2; j += height / ((clts.size * 2 * height) / width)) {
        for (let i = 0; i <= width/2; i += width / (clts.size * 2)) {
            ellipse(width / 2 - i, height / 2, r, r); //negative x
            ellipse(width / 2, height / 2 - j, r, r); //positive y
            ellipse(width / 2 + i, height / 2, r, r); //positive x
            ellipse(width / 2, height / 2 + j, r, r); //negative y
        
            let sr = 4
            if (j > 0) {
                let setPY = map(j, 0, height / 2, 0, h / 2) + clts.centerY;
                let setNY = -(map(j, 0, height / 2, 0, h / 2) - clts.centerY);
                text('' + str(round(setPY * 10) / 10.0), width / 2 - sr + 9, height / 2 - j + 3); //Y-Positive
                text('' + str(round(setNY * 10) / 10.0), width / 2 - sr + 9, height / 2 + j + 3); //Y-Negative
            }
            
            if (i > 0) {
                let setPX = map(i, 0, width / 2, 0, w / 2) + clts.centerX;
                let setNX = -(map(i, 0, width / 2, 0, w / 2) - clts.centerX);
                text('' + str(round(setPX * 10) / 10.0), width / 2 + i, height / 2 - sr + 18); //X-Positive
                text('' + str(round(setNX * 10) / 10.0), width / 2 - i, height / 2 - sr + 18); //X-Negative
            }
            
        }
    }
    
}

// Auxiliary functions

function trimN(s) {
    if (s.trim) {
        return s.trim();
    }
    return s.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
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

function screenSize() {
    if (clts.canvasSize == 'Square') {
        resizeCanvas(470, 470);
    } else if (clts.canvasSize == 'Landscape') {
        resizeCanvas(750, 550);
    } else if (clts.canvasSize == 'Full-Screen') {
        resizeCanvas(windowWidth, windowHeight);
    }
}

function keyPressed() {
    if (keyCode === ENTER) {
        redraw();
    }
}
