

class Mandelbrot {

  constructor(maxiterations, w, sizeW) {
    this.maxiterations = maxiterations;
    this.sizeW = sizeW;
    this.w = w;
    this.h = (this.w * height) / this.sizeW;
  }

  show() {
    let xmin = -this.w / 2 + centerX;
    let ymin = -this.h / 2;
    loadPixels();

    // x goes from xmin to xmax
    let xmax = xmin + this.w;
    // y goes from ymin to ymax
    let ymax = ymin + this.h;

    // Calculate amount we increment x,y for each pixel
    let dx = (xmax - xmin) / (this.sizeW);
    let dy = (ymax - ymin) / (height);

    let funColor = (x , y) => 1/5*log(5*sqrt(x * x + y * y))/log(1.5) - 1/5* floor(log(5*sqrt(x * x + y * y))/log(1.5))+0.75;

    // Start y
    let y1 = ymin;
    for (let j = 0; j < height; j++) {
      // Start x
      let x1 = xmin;
      for (let i = 0; i < this.sizeW; i++) {

        // Now we test, as we iterate z = z^2 + cm does z tend towards infinity?
        let x = x1;
        let y = -y1;
        let n = 0;
        while (n < this.maxiterations) {
          let aa = x * x;
          let bb = y * y;
          let twoab = 2.0 * x * y;

          x = aa - bb + x1;
          y = twoab - y1;
          // Infinty in our finite world is simple, let's just consider it 16
          if (aa + bb > 35.0) {
            break; // Bail
          }
          n++;
        }

        setPixelHSV(i, j, map(n, 0, this.maxiterations, 0, 1), 0.8, 1);

        x1 += dx;
      }
      y1 += dy;
    }
    updatePixels();
  }

}