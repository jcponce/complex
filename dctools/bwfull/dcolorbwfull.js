/* Written in p5.js (https://p5js.org/)
 * Under Creative Commons License
 * https://creativecommons.org/licenses/by-sa/4.0/
 * Written by Juan Carlos Ponce Campuzano, 12-Nov-2018
 */

// Last update 11-Nov-2019

// --Control variables--
let clts = {

lvlCurv: 'Modulus',
    
//funcZ: 'z+1/z',
    
//sharp = 1/3;
nContour: 10,
    
displayXY: false,
size: 2.5,
centerX: 0,
centerY: 0,

Save: function () {
    save('plotfz.png');
},

canvasSize: 'Square'
    
};

let input;

function setup() {
    createCanvas(470, 470);
    colorMode(HSB, 1);
    smooth();
    pixelDensity(1);
    
    // create gui (dat.gui)
    let gui = new dat.GUI({
                          width: 360
                          });
    //gui.add(clts, 'funcZ').name("f(z) =");
    gui.add(clts, 'lvlCurv', ['Phase', 'Modulus', 'Phase/Modulus', 'Real-component', 'Imaginary-component', 'Re/Im']).name("Mode:").onChange(mySelectOption);
   
    gui.add(clts, 'nContour', 4, 30).step(2).name("Level curves").onChange(keyPressed);
    gui.add(clts, 'size', 0.00001, 15).name("|Re z| <").onChange(keyPressed);
    gui.add(clts, 'Save').name("Save (png)");
    
    gui.add(clts, 'displayXY').name("Axes").onChange(redraw);
    gui.add(clts, 'centerX').name("Center x =").onChange(keyPressed);
    gui.add(clts, 'centerY').name("Center y =").onChange(keyPressed);
    gui.add(clts, 'canvasSize', ['Square', 'Landscape', 'Full-Screen'] ).name("Size: ").onChange(screenSize);
    gui.close();
    
    /*
    let cXY = gui.addFolder('Display Options');
    cXY.add(clts, 'displayXY').name("Axes").onChange(redraw);
    cXY.add(clts, 'centerX').name("Center x =").onChange(keyPressed);
    cXY.add(clts, 'centerY').name("Center y =").onChange(keyPressed);
    cXY.add(clts, 'canvasSize', ['Square', 'Landscape', 'Full-Screen'] ).name("Size: ").onChange(screenSize);
     */
    
    input = createInput('z+1/z');
    //input.size(200, 20);
    input.addClass('body');
    input.addClass('container');
    input.addClass('full-width');
    input.addClass('dark-translucent');
    input.addClass('input-control');
    //input.addClass('equation-input');
    input.attribute('placeholder', 'Input complex expression, e.g. 1/(z^2 + iz)^2 - log(z)');
    input.style('color: #ffffff');

    noLoop();
}

function draw() {
    
    background(255);
    
    plot();
    
    if (clts.displayXY == true) {
        displayGrid();
    }
    
}

// --Coloring the pixels--
// First I need to define the functions to color each pixel

let funPhase = (x, y) => (PI - atan2(y, -x)) / (2 * PI);



function funRe(x,y){
    realComp = x;
    let bwRe;
    if((( round(clts.nContour/5) * realComp - floor(round(clts.nContour/5) * realComp) ))<0.5){
        bwRe = 1;
    }else {
        bwRe = -1;
    }
    return bwRe;
}

function funIm(x,y){
    imComp = y;
    let bwIm;
    if((( round(clts.nContour/5) * imComp - floor(round(clts.nContour/5) * imComp) ))<0.5){
        bwIm = 1;
    }else {
        bwIm = -1;
    }
    return bwIm;
}


function sat(x, y) {
    let satAux =  log(sqrt(x * x + y * y)) / log(2);
    let bw;
    if((( round(clts.nContour/7) * satAux - floor(round(clts.nContour/7) * satAux) ))<0.5){
        bw = 1;
    }else {
        bw = -1;
    }
    return bw;
}

function val(x, y) {
    let valAux = round(clts.nContour) * funPhase(x,y);
    let bwval;
    if((( valAux - floor( valAux) ))<0.5){
        bwval = 1;
    }else {
        bwval = -1;
    }
    return bwval;
}

let funColor = (x, y) => sat(x,y);


// Now we color the pixels

let w, h, posRe, posIm, xr, yr;

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
    let y = ymin;
    
    //let z = trimN(clts.funcZ);
    let z = trimN(input.value());
    let parsed = complex_expression(z);
    
    for (let j = 0; j < height; j++) {
        // Start x
        let x = xmin;
        for (let i = 0; i < width; i++) {
            
            //let x = xtemp;
            //let y = -ytemp; //Here we need minus since the y-axis in canvas is upside down
            
            let vz = {r:x, i:-y};
            
            let w = parsed.fn(vz);
            
            let xv = w.r;
            let yv = w.i;
            
            if(xv<0.5){
                xr = xv;
                xr = 1;
            }else{
                xr = -1;
            }
            if(yv<0.5){
                yr = yv;
                yr = 1;
            }else{
                yr = -1;
            }
            
            // We color each pixel based on some cool function
            // Gosh, we could make fancy colors here if we wanted
            
            let h = funColor(xv,yv);
            
            //let b = sat(x, y);
            set(i, j, color(1, 0, h));
            
            x += dx;
        }
        y += dy;
    }
    
    updatePixels();
}



//--This function displays the grid for reference--

function displayGrid() {
    stroke(1, 1, 1);
    strokeWeight(2);
    //textSize(18);
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
    
   
    line(0, height / 2, width, height / 2); //x-axis
    line(width / 2, 0, width / 2, height); //y-axis
    // Draw tick marks twice per step, and draw the halfway marks smaller.
    let txtsize = map(clts.size, 0, 15, 14, 8);
    textSize(txtsize);
    let txtStroke = map(clts.size, 0, 15, 3, 0.5);
    strokeWeight(txtStroke);
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
                let setPX = map(i, 0, width / 2, 0, w / 2) +  clts.centerX;
                let setNX = -(map(i, 0, width / 2, 0, w / 2) -  clts.centerX);
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
        funColor = (x, y) => val(x,y);
    } else if (clts.lvlCurv == 'Modulus') {
        funColor = (x, y) => sat(x, y);
    } else if (clts.lvlCurv == 'Phase/Modulus') {
        funColor = (x, y) => val(x, y) * sat(x, y);
    } else if (clts.lvlCurv == 'Real-component') {
      funColor = (x, y) => funRe(x,y);
    }else if (clts.lvlCurv == 'Imaginary-component') {
        funColor = (x, y) => funIm(x,y);
    }else if (clts.lvlCurv == 'Re/Im') {
        funColor = (x, y) => funRe(x,y)*funIm(x,y);
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
