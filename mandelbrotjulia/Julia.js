class Julia {

  constructor(maxiterations, w, sizeW) {
    this.maxiterations = maxiterations;
    this.sizeW = sizeW;
    this.w = w;
    this.h = (this.w * height) / this.sizeW;
  }

  show() {
    let xmin = -this.w / 2;
    let ymin = -this.h / 2;
    loadPixels();

    // x goes from xmin to xmax
    let xmax = xmin + this.w;
    // y goes from ymin to ymax
    let ymax = ymin + this.h;

    // Calculate amount we increment x,y for each pixel
    let dx = (xmax - xmin) / (this.sizeW);
    let dy = (ymax - ymin) / (height);

    
    // Start y
    let y = ymin;
      
      let col1, col2;
      if(clts.User==true){
          cX = clts.Cx;
          cY = clts.Cy;
          col1 = map(cX, -widthMandel / 2 + centerX, widthMandel / 2 + centerX, 0, 150);
          col2 = map(cY, -widthMandel / 2, widthMandel / 2, 0, 150);
      } else {
          cX = map(mx, 0, width / 2, -widthMandel / 2 + centerX, widthMandel / 2 + centerX);
          cY = map(my, height, 0, -widthMandel / 2, widthMandel / 2);
          col1 = map(mx, 0, width / 2, 0, 200);
          col2 = map(my, 0, height, 0, 200);
      }
        
        
      


    for (let j = 0; j < height; j++) {
      // Start x
      let x = xmin;
      for (let i = sizeGraph; i < 2 * this.sizeW; i++) {

        // Now we test, as we iterate z = z^2 + cm does z tend towards infinity?
        let a = x;
        let b = -y;
        let n = 0;
        while (n < this.maxiterations) {
          let aa = a * a;
          let bb = b * b;
          let twoab = 2.0 * a * b;

          a = aa - bb + cX;
          b = twoab + cY;
          // Infinty in our finite world is simple, let's just consider it 16
          if (aa + bb > 35.0) {
            break; // Bail
          }
          n++;
        }

        
        // We color each pixel based on how long it takes to get to infinity
        // If we never got there, let's pick the color black
        if (n == this.maxiterations) {
          set(i, j, color(30));
        } else {
          // Gosh, we could make fancy colors here if we wanted
          let h = map(log(n + sqrt(a*a + b*b)), 0, 0.9 * log(this.maxiterations)/log(2), 0, 255);
          set(i, j, color(h / 2, col1, col2));
        }
        x += dx;
      }
      y += dy;
    }
    updatePixels();

    //draw constant label
    fill(255);
    stroke(0);
    strokeWeight(1.5);
    textSize(18);
    text("c = (" + str(round((cX) * 100) / 100.0) + "," + str(round(cY * 100) / 100.0) + ")", 5, height - 10);
      

  }

}
