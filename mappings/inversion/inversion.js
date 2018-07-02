/* Based on https://www.openprocessing.org/sketch/491395
 by Dan Anderson https://www.openprocessing.org/user/34940 */

var slider;

function setup(){
	createCanvas(400,450);
	slider = createSlider(0, 1, 0, 0.01);
    slider.position(120, 410);
    slider.style('width', '150px');
	colorMode(HSB);
	noStroke();
}

function draw(){
	background(255);
	noFill();
	stroke(0);
	strokeWeight(1.2);
	rect(0,0,width,400);
	
    //Cartesian plane reference
	fill(40);
	noStroke();
	textSize(16);
	text("Im",width/2+5,20);
	text("Re",width-28,(height-50)/2+15);
	text("1",3*width/4,(height-50)/2+15);
	
	
	stroke(80);
	strokeWeight(1.4);
	//ellipse(width/2, (height-50)/2,width/3,(height-50)/3);
	line(0,(height-50)/2,width,(height-50)/2);
	line(width/2,0,width/2,(height-50));
	
	let detail = 6;//Must be greater than 4 to run properly
	
 
	for (let i = 0; i < width; i += detail){
		for (let j =0; j < height-50; j += detail){
			let x,y;
			x = map(i,0,width,-1,1);
			y = map(j,height-50,0,-1,1);
			
			let nextx,nexty;
			
			nextx =   x / (x * x + y * y);//Change real component for other functions
			nexty =   - y / (x * x + y * y);//Change imaginary component for other functions
			
			let xp,yp;
			
			xp = map(x * (1-slider.value()) + nextx * slider.value(),-2,2,0,width);
			yp = map(y * (1-slider.value()) + nexty * slider.value(),-2,2,height-50,0);
			
			stroke(i*0.8, 255,255);
			ellipse(xp,yp,2);
		}
	}
	
    //Black background for slider
	fill(0);
	stroke(0);
	strokeWeight(1.2);
	rect(0,400,400,50);
			
}
