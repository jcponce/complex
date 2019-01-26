// Choose a complex mapping. Examples: z^2 => z.pow(2), 1/z => z.pow(-1), e^z => Complex.E.pow(z), sqrt(z) => z.sqrt()
//[mouse]:draw, [t]:transform, [s]:show coords(none, rect, polar), [c]:clear lines,
let fun = (z) => z.pow(-1);
let scale = 2;

let points = [];
let transform = false;
let coord = 1;
let wfun = (z) => fun(z).mul(u).add(z.mul(1.0-u));
let u = 0.0;

function setup() {
	createCanvas(windowHeight, windowHeight);
	unit = new Complex(1,1);
	unitr = new Complex(1,0);
	dim = new Complex(width, height);
	stroke(255);
}

function draw() {
	background(30);
	if(transform) {
		if(u < 1.0){
		  u += 0.01;
		}
	} else {
		if(u > 0.0){
		  u -= 0.01;
		}
	}
	if(coord==1){
		for(let x=0; x<width; x += 20){
			for(let y=0; y<height; y += 20){
				noStroke();
				fill(x/width*255,y/height*255,0);
				let p = {x: x, y: y};
				p = cmap({x: x, y: y});
				ellipse(p.x, p.y, 5, 5);
			}
		}
	} else if(coord==2){
		for(let r=0; r<0.5*height; r += 20){
			for(let a=0; a<TAU; a += 0.1){
				noStroke();
				fill(2*r/height*255,a/TAU*255,0);
				let p = {x: width/2+r*cos(a), y: height/2+r*sin(a)};
				p = cmap({x: p.x, y: p.y});
				ellipse(p.x, p.y, 5, 5);
			}
		}
	}
	if(mouseIsPressed){
		//points.push({x: mouseX, y: mouseY});
        points.push(createVector(mouseX, mouseY));
	}
	for(let i=1; i<points.length; i++){
		let ppos = points[i-1];
		let pos = points[i];
		ppos = cmap(ppos);
		pos = cmap(pos);
		stroke(255);
		line(ppos.x, ppos.y, pos.x, pos.y);
	}
}

function keyTyped(){
	switch (key){
		case 't':
			transform = !transform;
		  break;
		case 's':
			coord = (coord+1)%3;
			break;
		case 'c':
			points = [];
			break;
	}
}

function cmap(p){
	let z = new Complex({
		re: map(p.x, 0, width, -scale, scale), 
		im: map(p.y, 0, height, -scale, scale)
	});
	let w = wfun(z);
	let v = {
		x: map(w.re, -scale, scale, 0, width),
		y: map(w.im, -scale, scale, 0, height)
	};
	return {x: v.x, y: v.y};
}
