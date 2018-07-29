/* Written in p5.js (https://p5js.org/)
 * Under Creative Commons License
 * https://creativecommons.org/licenses/by-sa/4.0/
 * Writen by Juan Carlos Ponce Campuzano, 19-Jul-2018
 */

let lim, button;

let realText, imgText, boxText;

let inpRe, inpIm, inpLim;

function setup() {
    createCanvas(400, 400);
    colorMode(HSB, 360, 100, 100);
    background(0);
    controls();
    noLoop();
    
}

function draw() {
    
    loadPixels();
    
    for (let xp = 0; xp < width; xp++) {
        for (let yp = 0; yp < height; yp++) {
            let x, y;
            lim = inpLim.value();
            x = map(xp, 0, width, -lim, lim);
            y = map(yp, height, 0, -lim, lim);
            
            let z = new p5.Vector(0,0);
            
            let nextz = new p5.Vector();
            
            nextz.x = eval(inpRe.value());
            nextz.y = eval(inpIm.value());
            
            z = new p5.Vector(z.x + nextz.x, z.y + nextz.y);
            
            let h = map(atan2(-z.y, -z.x), -PI, PI, 0, 360) ;
            let b = max(map(log(5*sqrt(z.x*z.x + z.y*z.y))/log(1.5) - floor(log(5*sqrt(z.x*z.x + z.y*z.y))/log(1.5))+0.1, 0,5, 100, 0), 0);
            
            set(xp, yp, color(h, 100, b));
        }
    }
    updatePixels();
}

function controls(){
    inpRe = createInput();
    inpIm = createInput();
    inpRe.value('x');
    inpIm.value('y');
    inpRe.style('font-size', '16px');
    inpRe.style('width', '150px');
    inpIm.style('font-size', '16px');
    inpIm.style('width', '150px');
    inpRe.position(50, 410);
    inpIm.position(50, 450);
    
    inpLim = createInput();
    inpLim.value('2.5');
    inpLim.style('font-size', '16px');
    inpLim.style('width', '60px');
    inpLim.position(305, 410)
    
    realText = createElement('h2', 'Re:');
    realText.position(10, 390);
    
    imgText = createElement('h2', 'Im:');
    imgText.position(10, 430);
    
    boxText = createElement('h2', 'Box:');
    boxText.position(255, 390);
    
    button = createButton('Update');
    button.position(inpIm.x + inpIm.width+70, imgText.y+25);
    button.style('font-size', '16px');
    button.style('cursor', 'pointer');
    button.mousePressed(redraw);
}
