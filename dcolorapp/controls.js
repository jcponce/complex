/* Written in p5.js (https://p5js.org/)
 * Under Creative Commons License
 * https://creativecommons.org/licenses/by-sa/4.0/
 * Writen by Juan Carlos Ponce Campuzano, 12-Nov-2018
 */

// Last update ??

function controls(){
    
    inpRe = createInput();
    inpIm = createInput();
    inpRe.value('x');
    inpIm.value('y');
    inpRe.style('font-size', '16px');
    inpRe.style('width', '180px');
    inpIm.style('font-size', '16px');
    inpIm.style('width', '180px');
    inpRe.position(120, height/2+20);
    inpIm.position(inpRe.x, inpRe.y+50);
    
    inpLim = createInput();
    inpLim.value('4');
    inpLim.style('font-size', '16px');
    inpLim.style('width', '60px');
    inpLim.position(inpRe.x+10, inpRe.y+100)
    
    realText = createElement('h2', 'Re:');
    realText.position(inpRe.x-55, inpRe.y-20);
    realText.style('color', 'white');
    
    imgText = createElement('h2', 'Im:');
    imgText.position(inpRe.x-55, inpRe.y+30);
    imgText.style('color', 'white');
    
    boxText = createElement('h2', 'Set:');
    boxText.position(inpRe.x-55, inpRe.y+80);
    boxText.style('color', 'white');
    
    button = createButton('Update');
    button.position(inpRe.x+100, inpRe.y+100);
    button.style('font-size', '16px');
    button.style('cursor', 'pointer');
    button.mousePressed(redraw);
    
    buttonSave = createButton('Save');
    buttonSave.position(inpRe.x+60, inpRe.y+160);
    buttonSave.style('font-size', '16px');
    buttonSave.style('cursor', 'pointer');
    buttonSave.mousePressed(saveImg);
    
    optText = createElement('h3', 'Level curves:');
    optText.position(inpRe.x-55, inpRe.y-90);
    optText.style('color', 'white');
    
    colorFn = createSelect();
    colorFn.position(inpRe.x+90, inpRe.y-72);
    colorFn.option('Phase');
    colorFn.option('Modulus');
    colorFn.option('Phase/Modulus');
    colorFn.option('None');
    colorFn.changed(mySelectEvent);
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
