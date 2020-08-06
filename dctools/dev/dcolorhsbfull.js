/* Written in p5.js (https://p5js.org/)
 * Under Creative Commons License
 * https://creativecommons.org/licenses/by-sa/4.0/
 * Written by Juan Carlos Ponce Campuzano, 12-Nov-2018
 
 * Last update 20-Nov-2019
 */

// --Control variables--
let clts = {

    lvlCurv: 'Modulus',

    funcZ: 'z',

    displayXY: false,
    size: 3,
    slidert: 1,
    slideru: 1,
    slidern: 1,
    centerX: 0,
    centerY: 0,

    Save: function () {
        save('plotfz.png');
    },

    canvasSize: 'Square'

};

//var new_expression = $('#equation-input').val();

let input;
let domC;

function setup() {
    createCanvas(470, 470);
    colorMode(HSB, 1);
    //smooth();
    pixelDensity(1);


    /*
    let cXY = gui.addFolder('Display Options');
    cXY.add(clts, 'displayXY').name("Axes").onChange(redraw);
    cXY.add(clts, 'centerX').name("Center x =").onChange(keyPressed);
    cXY.add(clts, 'centerY').name("Center y =").onChange(keyPressed);
    cXY.add(clts, 'canvasSize', ['Square', 'Landscape', 'Full-Screen'] ).name("Size: ").onChange(screenSize);
     */

    uicontrols();

    noLoop();

    //blaschke(3);
}

function draw() {

    background(255);

    //plot();
    //domainColoring( function, |Re z|, center x, center y, canvasSize text, axis boolean);
    domC = new domainColoring(input.value(), clts.size, clts.centerX, clts.centerY, clts.canvasSize, clts.displayXY);

    domC.plotter();

    //if (clts.displayXY == true) {
    //    displayGrid();
    //}
    //var z0 = trimN(new_expression);
    //var parsed = complex_expression(z0);//Define function
    //console.log();

}

// --Coloring the pixels--
// First I need to define the functions to color pixels

let funPhase = (x, y) => (PI - Math.atan2(y, -x)) / (2 * PI); // defines color hue based on phase 

let sharp = 0.39; // delay
let b = 0.655; // brightness 0 -> dark, 1 -> bright
let nMod = 2; // num of level curves mod
let nPhase = 20; // num. of level curves phase
let base = 2;

let cPhase = (x, y) => {
    let c = nPhase * funPhase(x, y);
    return sharp * (c - floor(c)) + b;
}

let cMod = (x, y) => {
    let c = nMod * log(sqrt(x * x + y * y));
    return sharp * (c - floor(c)) + b;
}

let cPhaMod = (x, y) => cPhase(x, y) * cMod(x, y);

let funColor = (x, y) => cMod(x, y);

//end coloring functions



// Auxiliary functions

function trimN(s) {
    if (s.trim) {
        return s.trim();
    }
    return s.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
}

function mySelectOption() {
    if (clts.lvlCurv == 'Phase') {
        funColor = (x, y) => cPhase(x, y);
    } else if (clts.lvlCurv == 'Modulus') {
        funColor = (x, y) => cMod(x, y);
    } else if (clts.lvlCurv == 'Phase/Modulus') {
        funColor = (x, y) => cPhaMod(x, y);
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

