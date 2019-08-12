let drawing = false;

// --Control variables--
let clts = {
    
funcZ: 'z^2',
    
radius: 30,
  
Column: false,
  
size: 2.5,

Clear: function () {
  cleanDrawing();
},

Save: function () {
    save('plotfz.png');
},
    
};

let w, h;

var requested = {
fn: function(z) { return {r:0,i:0}; },
expr: '',
canon: '',
extent: w,
width: 0,
height: 0,
parameterized: false,
animode: null,
mode: null
};

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 1, 1, 1);
  noStroke();
  
  
  // create gui (dat.gui)
    let gui = new dat.GUI({
                          width: 210
                          });
    gui.add(clts, 'funcZ').name("f(z) =");
    gui.add(clts, 'radius', 1, 80, 0.01).name("Radius");
    gui.add(clts, 'Column');
    gui.add(clts, 'size', 1, 5).name("|Re z| <").onChange(keyPressed);
    gui.add(clts, 'Clear');
    
    gui.add(clts, 'Save').name("Save (png)");
}

let col = [];
let fcol = [];
let argcol = [];
let ells = [];

function draw() {
  clts.clean = false;
  
  let xp = mouseX;
  let yp = mouseY;
  
  w = clts.size * 2;
  h = (w * height) / width;
  readinput();
  
  let tmpx = map(xp, 0, width, -w/2, w/2);
  let tmpy = map(yp, height, 0, -h/2, h/2);
    
  let vz = {r:tmpx, i:tmpy};
  let fc = requested.fn(vz);
    
    for(let k = 0; k<200; k++){
        col[k] = {r:tmpx, i:tmpy+(k+1)/400};//createVector(vz.r, vz.i + i/200);
        fcol[k] = requested.fn(col[k]);
        argcol[k] = atan2(fcol[k].i, -fcol[k].r);
    }

  let arg = atan2(fc.i, -fc.r);
  let Color_arg = map(arg, -PI, PI, 0, 1);
  fill(Color_arg, 1, 1);
  
  if(drawing){
    ellipse(xp, yp, clts.radius*2);
  }
    push();
    for(let i = 0; i<200; i++){
        let mx = map(col[i].r, -w/2, w/2, 0, width);
        let my = map(col[i].i, -h/2, h/2, height, 0);
        ells[i] = map(argcol[i], -PI, PI, 0, 1);
        fill(ells[i], 1, 1);
        ellipse(mx, my, 1, 1);
    }
    pop();
   
  //console.log(col.length);
  
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function mousePressed() {
    if (drawing === false) {
        drawing = true;
    } else {
        drawing = false;
    }
    cursor(HAND);
}

function mouseReleased() {
    if (drawing === true) {
        drawing = false;
    } else {
        drawing = true;
    }
    cursor(ARROW);
}

function keyPressed() {
    if (keyCode === ENTER) {
        redraw();
    }
}

function cleanDrawing(){
  background(255);
}

function trimN(s) {
    if (s.trim) {
        return s.trim();
    }
    return s.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
}

function readinput() {
    reading_input = null;
    var s = trimN(clts.funcZ);
    if (s == requested.expr) return;
    var parsed = complex_expression(s);
    if (parsed !== null) {
        var animate = parsed.parameters.length > 0;
        requested.fn = parsed.fn;
        requested.expr = s;
        requested.canon = parsed.fntext;
        requested.extent = w;
        requested.parameterized = animate;
    }
}

      
