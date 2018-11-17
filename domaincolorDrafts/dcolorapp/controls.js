/* Written in p5.js (https://p5js.org/)
 * Under Creative Commons License
 * https://creativecommons.org/licenses/by-sa/4.0/
 * Writen by Juan Carlos Ponce Campuzano, 12-Nov-2018
 */

// Last update ??

function controls(){
    
    //Inputs real and imaginary components
    
    inpRe = createInput();
    inpIm = createInput();
    inpRe.value('x');
    inpIm.value('y');
    inpRe.style('font-size', '16px');
    inpRe.style('width', '180px');
    inpIm.style('font-size', '16px');
    inpIm.style('width', '180px');
    inpRe.position(100, height/2-10);
    inpIm.position(inpRe.x, inpRe.y+50);
    
    realText = createElement('h2', 'Re:');
    realText.position(inpRe.x-55, inpRe.y-20);
    realText.style('color', 'white');
    
    imgText = createElement('h2', 'Im:');
    imgText.position(inpRe.x-55, inpRe.y+30);
    imgText.style('color', 'white');
    
    //Input for plotting on set |Re(x)|<=2 and |Im(z)|<=2
    
    //Input
    inpLim = createInput();
    inpLim.value('4');
    inpLim.style('font-size', '16px');
    inpLim.style('width', '40px');
    inpLim.position(inpRe.x, inpRe.y+100)
    
    //text
    boxText = createElement('h3', 'Set:');
    boxText.position(inpRe.x-55, inpRe.y+85);
    boxText.style('color', 'white');
    
    //Define the Center
    inpCx = createInput();
    inpCx.value('0');
    inpCx.style('font-size', '16px');
    inpCx.style('width', '35px');
    inpCx.position(inpRe.x+143, inpRe.y+100)
    
    inpCy = createInput();
    inpCy.value('0');
    inpCy.style('font-size', '16px');
    inpCy.style('width', '35px');
    inpCy.position(inpRe.x+181, inpRe.y+100);
    
    centerText = createElement('h3', 'Center:');
    centerText.position(inpRe.x+60, inpRe.y+85);
    centerText.style('color', 'white');
    
    //Button for updating the plot with new values
    button = createButton('Update');
    button.position(inpRe.x+40, inpRe.y+150);
    button.style('font-size', '16px');
    button.style('cursor', 'pointer');
    button.mousePressed(redraw);
    
    //Save an image of canvas
    buttonSave = createButton('Save');
    buttonSave.position(inpRe.x+50, inpRe.y+200);
    buttonSave.style('font-size', '16px');
    buttonSave.style('cursor', 'pointer');
    buttonSave.mousePressed(saveImg);
    
    //Selection options for level curves
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


