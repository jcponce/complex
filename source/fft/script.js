var canvas = document.getElementById("canvas");
var popup = document.getElementById("popup");
var textbox = document.getElementById("text");
var close = document.getElementById("close");
var ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var points = [];
var mousePos = { x: null, y: null };
var drawing = false;

canvas.addEventListener("mousedown", function (e) {
  e.preventDefault();
  mousePos.x = e.clientX;
  mousePos.y = e.clientY;
  drawing = true;
  update();
});

canvas.addEventListener("touchstart", function (e) {
  e.preventDefault();
  mousePos.x = e.touches[0].pageX;
  mousePos.y = e.touches[0].pageY;
  drawing = true;
  update();
});

canvas.addEventListener("mousemove", function (e) {
  e.preventDefault();
  mousePos.x = e.clientX;
  mousePos.y = e.clientY;
});

canvas.addEventListener("touchmove", function (e) {
  e.preventDefault();
  mousePos.x = e.touches[0].pageX;
  mousePos.y = e.touches[0].pageY;
});

canvas.addEventListener("mouseup", function (e) {
  e.preventDefault();
  drawing = false;
  doFFT();
});

canvas.addEventListener("touchend", function (e) {
  e.preventDefault();
  drawing = false;
  doFFT();
});

close.addEventListener("click", function () {
  popup.style.display = "none";
});

function update() {
  if (drawing) {
    requestAnimationFrame(update);
  }
  console.log(points.length);
  points.push({ x: mousePos.x, y: mousePos.y });
  ctx.fillStyle = 'green';
  ctx.beginPath();
  ctx.arc(mousePos.x, mousePos.y, 1.5, 0, 2 * Math.PI);
  ctx.fill();
}
var data;
function doFFT() {
  var n = points.length;
  data = new ComplexArray(n).map((value, i, n) => {
    value.real = points[n-i-1].x;
    value.imag = -points[n-i-1].y;
  });

  var freq = data.FFT();

  for (var i = 1; i < freq.length / 2; i++) {
    var angle = Math.atan2(freq.imag[i], freq.real[i]);
    var radius = Math.sqrt(freq.imag[i]*freq.imag[i] + freq.real[i] * freq.real[i]);
    textbox.value += i + "," + radius.toFixed(6) + "," + angle.toFixed(3) + "\n";
    
    var angle = Math.atan2(freq.imag[n-i], freq.real[n-i]);
    var radius = Math.sqrt(freq.imag[n-i]*freq.imag[n-i] + freq.real[n-i]*freq.real[n-i]);
    textbox.value += -i + "," + radius.toFixed(6) + "," + angle.toFixed(3) + "\n";
  }

  popup.style.display = "block";
}