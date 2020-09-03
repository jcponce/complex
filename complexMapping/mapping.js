// Choose a complex mapping. Examples: z^2 => z.pow(2), 1/z => z.pow(-1), e^z => Complex.E.pow(z), sqrt(z) => z.sqrt()
//[mouse]:draw, [t]:transform, [s]:show coords(none, rect, polar), [c]:clear lines,
let fun = (z) => z.pow(2); //z.pow(-1);
let scale = 2;

let points = [];
let transform = false;
let coord = 1;
let wfun = (z) => fun(z).mul(u).add(z.mul(1.0 - u));
let u = 0.0;
let rad = 3;

let sel;
let system;

let stepXY = 20;

let expr = 'z/|z|';
var reading_input = null;
let inp, button, buttonClear, checkbox;
let drawing = false;


var requested = {
    fn: function (z) {
        return {
            r: 0,
            i: 0
        };
    },
    expr: '',
    canon: '',
    extent: 2,
    width: 0,
    height: 0,
    parameterized: false,
    animode: null,
    mode: null
};

function setup() {
    createCanvas(450, 450);
    colorMode(HSB, 1, 1, 1);
    //unit = new Complex(1,1);
    //unitr = new Complex(1,0);
    //dim = new Complex(width, height);
    //stroke(255);

    /*
    sel = createSelect();
    sel.position(10, 460);
    sel.option('z^2');
    sel.option('1/z');
    sel.option('z/|z|');
    sel.option('z+1/z');
    sel.option('sqrt(z)');
    sel.option('log(z)');
    sel.option('exp(z)');
    sel.option('sin(z)');
    sel.option('(i+z)/(i-z)');
    sel.style('font-size', '18')
    sel.changed(myFunctionEvent);
     */
    inp = createInput('z^2');
    inp.position(10, 460);
    inp.style('width:110px');

    button = createButton('Transform');
    button.position(inp.x + 120, inp.y);
    button.mousePressed(transformButton);

    checkbox = createCheckbox('Draw', false);
    checkbox.position(inp.x + 210, inp.y);
    checkbox.changed(myCheckedEvent);

    buttonClear = createButton('Press C to clear');
    buttonClear.position(inp.x + 210, inp.y + 20);
    //buttonClear.mousePressed(myButtonClear);

    system = createSelect();
    system.position(inp.x + 335, inp.y);
    system.option('Cartesian');
    system.option('Polar');
    system.option('None');
    system.style('font-size', '18')
    system.changed(mySystemEvent);


    //inp.input(myInputEvent)
}

function myCheckedEvent() {
    drawing = !drawing; //redraw();
    if (drawing == false) {
        points = [];
    }
}

function myButtonClear() {
    points = [];
}

/*
function myFunctionEvent(){
    
    if (sel.value() == 'z^2') {
        scale = 2;
        stepXY = 20;
        fun = (z) => z.pow(2);
    } else if (sel.value() == '1/z') {
        scale = 2;
        stepXY = 25;
        fun = (z) => z.inverse();
    } else if (sel.value() == 'z/|z|') {
        scale = 2;
        stepXY = 25;
        fun = (z) => z.div(z.abs());
    } else if (sel.value() == 'z+1/z') {
        scale = 2;
        stepXY = 25;
        fun = (z) => z.pow(1).add(z.inverse());
    }else if (sel.value() == 'sqrt(z)') {
        scale = 2;
        stepXY = 25;
        fun = (z) => z.pow(0.5);
    } else if (sel.value() == 'log(z)') {
        scale = PI;
        stepXY = 25;
        fun = (z) => z.log();
    } else if (sel.value() == 'exp(z)') {
        scale = PI/2;
        stepXY = 25;
        fun = (z) => z.exp();
    } else if (sel.value() == 'sin(z)') {
        scale = PI/2;
        stepXY = 25;
        fun = (z) => z.sin();
    } else if (sel.value() == '(i+z)/(i-z)') {
        scale = 1;
        stepXY = 25;
        fun = (z) => z.mul('1').add('i').div(z.mul(-1).add('i'));//z.mul(-1).add(1).div(z.add(1)).log();
    }
    //u = 0.0;
    points = [];
    redraw();
    
}
 */

function mySystemEvent() {

    if (system.value() == 'Cartesian') {
        coord = 1;
    } else if (system.value() == 'Polar') {
        coord = 2;
    } else if (system.value() == 'None') {
        coord = 3;
    }


}

function draw() {
    background(0.1);

    cursor(HAND);

    if (transform) {
        if (u < 1.0) {
            u += 0.01;
        }
    } else {
        if (u > 0.0) {
            u -= 0.01;
        }
    }
    if (coord == 1) {
        for (let x = 10; x < width; x += stepXY) {
            for (let y = 10; y < height; y += stepXY) {
                noStroke();
                let zx = map(x, 20, width, -scale, scale);
                let zy = map(y, 20, height, -scale, scale)
                let colorz = map(atan2(zy, -zx), -PI, PI, 0, 1);
                fill(colorz, 1, 1);
                let p = {
                    x: x,
                    y: y
                };
                p = cmap({
                    x: x,
                    y: y
                });
                noStroke();
                ellipse(p.x, p.y, 2 * rad);
            }
        }
    } else if (coord == 2) {
        for (let r = 20; r < 0.5 * height; r += 20) {
            for (let a = -PI + 0.01; a <= PI; a += 0.09) {
                noStroke();
                let rnew = map(r, 0, 0.5 * height, 0, 2);
                let pcolorz = map(atan2(rnew * sin(a), -rnew * cos(a)), -PI, PI, 0, 1);
                fill(pcolorz, 1, 1);
                let p = {
                    x: width / 2 + r * cos(a),
                    y: height / 2 + r * sin(a)
                };
                p = cmap({
                    x: p.x,
                    y: p.y
                });
                noStroke();
                ellipse(p.x, p.y, 2 * rad);
            }
        }
    }
    if (drawing == true) {
        if (mouseIsPressed && u <= 0) {
            //points.push({x: mouseX, y: mouseY});
            let cx = constrain(mouseX, 0, width);
            let cy = constrain(mouseY, 0, height);
            points.push(createVector(cx, cy));
        }
    }

    for (let i = 1; i < points.length; i++) {
        let ppos = points[i - 1];
        let pos = points[i];
        ppos = cmap(ppos);
        pos = cmap(pos);
        stroke(1, 0, 1);
        strokeWeight(2);
        line(ppos.x, ppos.y, pos.x, pos.y);
    }


    //fill(1);
    //textSize(18);
    //stroke(0);
    //strokeWeight(1);
    //text('T: Apply', 20, 30);

}

function mousePressed() {
    if (value === 0) {
        value = 255;
    } else {
        value = 0;
    }
}

function transformButton() {
    transform = !transform;
}

function keyTyped() {
    switch (key) {
        case 't':
            transform = !transform;
            break;
        case 'c':
            points = [];
            break;
    }
}

function readinput() {
    reading_input = null;
    var s = trimN(inp.value());
    if (s == requested.expr) return;
    var parsed = complex_expression(s);
    if (parsed !== null) {
        var animate = parsed.parameters.length > 0;
        requested.fn = parsed.fn;
        requested.expr = s;
        requested.canon = parsed.fntext;
        requested.extent = 2;
        requested.parameterized = animate;
        //requested.caption = animate ? parsed.parameters[0].caption : null;
        //ebi('timecontrol').style.display = animate ? 'inline-table' : 'none';
        //if (!animate) {
        //  cancelplay();
        //}

        //sethash();
        //redraw();
    }
}

function cmap(p) {
    let z = {
        r: map(p.x, 0, width, -scale, scale),
        i: map(p.y, 0, height, -scale, scale)
    };
    readinput();

    //let zt = trimN(inp.value());
    //let parsed = complex_expression(zt);//Define function

    let w = requested.fn(z); //wfun(z);
    let v = {
        x: map(w.r * u + (1 - u) * z.r, -scale, scale, 0, width),
        y: map(w.i * u + (1 - u) * z.i, -scale, scale, 0, height)
    };
    return {
        x: v.x,
        y: v.y
    };
}

function trimN(s) {
    if (s.trim) {
        return s.trim();
    }
    return s.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
}