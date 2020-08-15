/* Written in p5.js (https://p5js.org/)
 * Under Creative Commons License
 * https://creativecommons.org/licenses/by-sa/4.0/
 * Written by Juan Carlos Ponce Campuzano, 12-Nov-2018
 
 * Last update 12-Aug-2020
 */

function mouseWheel() {
  if (domC.x <= mouseX && mouseX <= domC.w && domC.y <= mouseY && mouseY <= domC.h)
    domC.zoomAt(mouseX, mouseY, 0.9, event.delta < 0);
}

function keyReleased() {
  if (keyCode === 81) //Q key
    domC.printDebug = !domC.printDebug;
}

function mousePressed() {
  domC.pressedPlot();
}

function mouseReleased() {
  domC.releasedPlot();
}

function touchStarted() {
  domC.pressedPlot();
}

function touchEnded() {
  domC.releasedPlot();
}

function keyPressed() {
  if (keyCode === ENTER) {
    domC.func = domC.verifyFunction(complex_expression(input, def.slidert, def.slideru, def.slidern));
  }
}

function resetPlotDim() {
  s = def.size;
  domC.origSize = new p5.Vector(s, s);
  domC.size = new p5.Vector(domC.origSize.x, domC.origSize.y);
}

function resetParameters() {
  domC.func = domC.verifyFunction(complex_expression(input, def.slidert, def.slideru, def.slidern));
}

function screenSize() {
  if (def.canvasSize === 'Small') {
    resizeCanvas(500, 500);
  } else if (def.canvasSize === 'Big') {
    resizeCanvas(700, 700);
  }
  resetPlot();
}

//JQuery for getting a sharable link with equation
function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (pair[0] == variable) {
      return pair[1];
    }
  }
  return (false);
}

function update_expression() {
  let new_expression = $("#equation-input").val();
  input = new_expression;
  console.log(new_expression);
}

// When the user presses the button, show some copyable text
function showLink() {
  var expression_base64 = btoa($('#equation-input').val());
  let url = [location.protocol, '//', location.host, location.pathname].join('');
  url = url + "?expression=" + expression_base64;
  $('#copyable-link').val(url);
  $('#link-container').show();
  $('#copyable-link').select();
}
$('#copyable-link').blur(function () {
  $('#link-container').hide();
});

// If the user already specified
$(function () {
  var expression_base64 = getQueryVariable('expression');
  //console.log(expression_base64);
  if (expression_base64) {
    $('#equation-input').val(atob(expression_base64.replace('/', '')));
  }
});

// Get things started.
$('#equation-input').change(update_expression);
$('#equation-input').change(resetParameters);
$('#show-link').click(showLink);
$(update_expression);