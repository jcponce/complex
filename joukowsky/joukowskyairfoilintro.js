/*
A cool dynamic version of velocity fields. Flow around a circle with velocity U and circulation C.
First a translation and scalling is applied to the circle C_0 with center z=0+0*i and radius |z|=1.
This is done using the map T(z)=-0.15_0.23*i + r_0*z, with r_0=0.23*sqrt(13*2) and i^2=-1.
Thus C_0 is mapped to the circle C_1 with center z1=-0.15+i*0.23 and radius r_0.
Finally the Joukowsky mapping J(z)=z+1/z is applied. Thus the circle C_1 is mapped to the Arfoil
This is known as The Joukowski Airfoil.
*/

//Warning: The code is pretty messy but I will be back later to improve it. :)

/*
Feel free to do whatever with this code.
If you do use it, I'd love to see what you did.
Send me a note at  j.ponce@uq.edu.au
 */

//http://creativecommons.org/licenses/by-nc/4.0/


/*
 Last updated 28 Jan 2019
 */

let numMax = 500;
let t = 0;
let h = 0.01;
let particles = [];

let a = 1;//radius

//vector field variables
let xmax = 6;
let xmin = -6;
let ymax = 4;
let ymin = -4;
let sc = 0.15;
let xstep = 0.5;
let ystep = 0.5;

let WIDTH = 700;
let HEIGHT = 400;
let frameHeight = HEIGHT/100-2;

let currentParticle = 0;

let fshow = false;
let tshow = true;
let starting = true;

let buttonTrace;

//let sliderU;// Speed
let U = 0.25;
//let sliderC;//Circulation
let C = 0;
//let sliderT;//Tranformation using homotopy
let transf;

let rd=0.23*2*2.54950975679639241501;//radius

function setup() {
    createCanvas(WIDTH, HEIGHT);
    //controls();
    resetSketch();
    transf = 0;
}

function resetSketch() {
    
    //seting up particles
    for (var i=0; i<numMax; i++) {
        var valX = random(-5, 5);
        var valY = random(-3, 3);
        
        particles[i] = new Particle(valX, valY, t, h);
        
    }
    //tshow = false;
    
}

function draw() {
    cursor(HAND);
    
    //This is for drawing the trace of particles
    if(tshow==true){
        fill(255,8);
    } else{
        fill(255,100);
    }
    
    stroke(255);
    strokeWeight(0.5);
    rect(0,0,width,height);
    
    translate(width/2, height/2);//we need the origin at the center
    
    
    t += h;
    
    if (starting==true) {
        for (let i=particles.length-1; i>=0; i-=1) {
            let p = particles[i];
            p.update();
            p.display();
            if ( p.x > 4 ||  p.y > 4 || p.x < -5 ||  p.y < -4 || pow(pow(p.x, 2)+pow(p.y, 2), 1/2)<a ) {
                particles.splice(i,1);
                currentParticle--;
                particles.push(new Particle(random(-4.5, -4),random(-frameHeight, frameHeight),t,h) );
            }
        }
    }
    
    //This draws the circle to be transformed
    fill(0);
    stroke(0);
    strokeWeight(1);
    strokeJoin(ROUND);
    beginShape();
    for(let i = 0; i <= 2*PI; i+=PI/50){
        let xc = cos(i);
        let yc = sin(i);
        vertex(100*(xc*(1-transf) + JkTransX(xc,yc)*transf), -100*(yc*(1-transf)+JkTransY(xc,yc)*transf));
    }
    endShape(CLOSE)
    
    transf +=0.003;
    if(transf > 1){
        transf =1.0;
    }
    
}

function mousePressed() {
    if (mouseIsPressed) {
    if (mouseButton === LEFT) {
        if(tshow==false) {
            tshow = true;
        }else{
            tshow = false;
        }
    }
    if (mouseButton === RIGHT) {
      transf =0.0;
    }
    }
    
}

let P = (t, x, y) => 4.9*(   (2 * a*a * U * y*y)/((x*x+ y*y)*(x*x+ y*y)) + U*(1 - (a*a)/(x*x + y*y)) - (C*y)/(2*PI*(x*x + y*y)) );//Change this function
let Q = (t, x, y) =>  4.9*( -(2*a*a * U * x * y)/((x*x+ y*y)*(x*x+ y*y)) + (C * x)/(2*PI*(x*x + y*y)) );//Change this function

//This part defines the components of the Joukowsky transformation
let JkTransX = (x,y) => rd*x-0.15 + (rd*x-0.15)/((rd*x-0.15)*(rd*x-0.15)+(rd*y+0.23)*(rd*y+0.23));


let JkTransY = (x,y) => rd*y+0.23 - (rd*y+0.23)/((rd*x-0.15)*(rd*x-0.15)+(rd*y+0.23)*(rd*y+0.23));

//Define particles and how they are moved with Runge–Kutta method of 4th degree.
class Particle{
    
    constructor(_x, _y, _t, _h){
        this.x = _x;
        this.y = _y;
        this.time = _t;
        this.radius = random(3, 5);
        this.h = _h;
        this.op = random(199,200);
        this.r = random(110,120);
        this.g = random(110,120);
        this.b = random(110,120);
    }
    
    update() {
        this.k1 = P(this.time, this.x, this.y);
        this.j1 = Q(this.time, this.x, this.y);
        this.k2 = P(this.time + 1/2 * this.h, this.x + 1/2 * this.h * this.k1, this.y + 1/2 * this.h * this.j1);
        this.j2 = Q(this.time + 1/2 * this.h, this.x + 1/2 * this.h * this.k1, this.y + 1/2 * this.h * this.j1);
        this.k3 = P(this.time + 1/2 * this.h, this.x + 1/2 * this.h * this.k2, this.y + 1/2 * this.h * this.j2);
        this.j3 = Q(this.time + 1/2 * this.h, this.x + 1/2 * this.h * this.k2, this.y + 1/2 * this.h * this.j2);
        this.k4 = P(this.time + this.h, this.x + this.h * this.k3, this.y + this.h * this.j3);
        this.j4 = Q(this.time + this.h, this.x + this.h * this.k3, this.y + this.h * this.j3);
        this.x = this.x + this.h/6 *(this.k1 + 2 * this.k2 + 2 * this.k3 + this.k4);
        this.y = this.y + this.h/6 *(this.j1 + 2 * this.j2 + 2 * this.j3 + this.j4);
        this.time += this.h;
    }
    
    display() {
        fill(this.r, this.b, this.g, this.op);
        noStroke();
        this.updatex = map(this.x*(1-transf) + JkTransX(this.x,this.y)*transf, -7, 7, -width, width);
        this.updatey = map(-this.y*(1-transf)- JkTransY(this.x,this.y)*transf, -4, 4, -height, height);
        ellipse(this.updatex, this.updatey, 2*this.radius, 2*this.radius);

    }
    
}



