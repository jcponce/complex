/* Written in p5.js (https://p5js.org/)
 * Under Creative Commons License
 * https://creativecommons.org/licenses/by-sa/4.0/
 * Written by Juan Carlos Ponce Campuzano, 12-Nov-2018
 
 * Last update 20-Nov-2019
 */

// create gui (dat.gui)
function uicontrols() {
    let gui = new dat.GUI({
        width: 360
    });
    //gui.add(clts, 'funcZ').name("f(z) =");
    gui.add(clts, 'lvlCurv', ['Phase', 'Modulus', 'Phase/Modulus', 'None']).name("Level Curves:").onChange(mySelectOption);
    gui.add(clts, 'size', 0.00001, 15).name("|Re z| <").onChange(keyPressed);

    let par = gui.addFolder('Parameters');
    par.add(clts, 'slidert', 0, 1, 0.01).name("t =").onChange(keyPressed);
    par.add(clts, 'slideru', 0, 2 * Math.PI, 0.01).name("u: exp(i⋅s), s =").onChange(keyPressed);
    par.add(clts, 'slidern', 0, 30, 1).name("Int: n =").onChange(keyPressed);


    gui.add(clts, 'Save').name("Save (png)");

    gui.add(clts, 'displayXY').name("Axes").onChange(redraw);
    gui.add(clts, 'centerX').name("Center x =").onChange(keyPressed);
    gui.add(clts, 'centerY').name("Center y =").onChange(keyPressed);
    gui.add(clts, 'canvasSize', ['Square', 'Landscape', 'Full-Screen']).name("Size: ").onChange(screenSize);

    //input = createInput('prod(e^((z+(e^(2*pi*i/5))^n )/(z-(e^(2*pi*i/5))^n)), 5)');
    //input = createInput('rationalBlaschke(z, i/2, 3)');
    //input = createInput('z^(2/3+i)');
    input = createInput('joukowsky(z, -0.15+0.23*i, 1.17)');
    //input = createInput('zeta(z)');
     //input = createInput('(disk(z)blaschke(z, 40))^2');
    //input = createInput('(disk(z)blaschke(z))^2');
    //input = createInput('mobius(z, 2+i, -i, i, 1/2-2/3i)');
    //input.size(200, 20);
    input.addClass('body');
    input.addClass('container');
    input.addClass('full-width');
    input.addClass('dark-translucent');
    input.addClass('input-control');
    //input.addClass('equation-input');
    input.attribute('placeholder', 'Input complex expression, e.g. 1 / (z^2 + i)^2 - log(z)');
    input.style('color: #ffffff');

}