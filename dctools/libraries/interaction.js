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

function zoomIn() {
  domC.zoomAt(width / 2, height / 2, 0.85, true);
}

function zoomOut() {
  domC.zoomAt(width / 2, height / 2, 0.85, false);
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

/*
function keyPressed() {
  if (keyCode === ENTER) {
    domC.func = domC.verifyFunction(complex_expression(input, pt.value, pu.value, pn.value));
  }
}*/

function resetPlotDim() {
  s = pz.value; //def.size;
  let sw = s * 2;
  let sh = (sw * height) / width;
  domC.origSize = new p5.Vector(sw, sh);
  //domC.origSize = new p5.Vector(s, s);
  domC.size = new p5.Vector(domC.origSize.x, domC.origSize.y);
}

function resetParameters() {
  domC.func = domC.verifyFunction(complex_expression(input, pt.value, pu.value, pn.value));
}

function screenSize() {
  if (size) {
    resizeCanvas(500, 500);
  } else if (!size) {
    resizeCanvas(700, 700);
  }
  resetPlot();
}

//JQuery for getting a link with equation to share
function getQueryVariable(variable) {
  let query = window.location.search.substring(1);
  let vars = query.split("&");
  for (let i = 0; i < vars.length; i++) {
    let pair = vars[i].split("=");
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
// First I tried it with a base64 expression. 
// Now I am tryin to show just the expression. I hope this works fine :)
// To make it work, we need to trim the expression
// Maybe later I will figure out
// Define a function to handle the showing of the link
function showLink() {
  const expressionBase64 = btoa($('#equation-input').val());
  let url = `${location.protocol}//${location.host}${location.pathname}?expression=${expressionBase64}`;
  $('#copyable-link').val(url);
  $('#link-container').show();
  $('#copyable-link').select();
}

// Hide the link container when the copyable link loses focus
$('#copyable-link').blur(function () {
  $('#link-container').hide();
});

// Check if the user already specified an expression in the URL
$(function () {
  const expressionBase64 = trimSpaces(getQueryVariable('expression'));
  const expression_unicode = trimSpaces(getQueryVariable('expression'));
  const checkValue = isBase64Encoded(expressionBase64);
  //console.log(isBase64Encoded(expressionBase64));
  ///if (expressionBase64) {
  //  $('#equation-input').val(atob(expressionBase64.replace('/', '')));
  //}
  if(checkValue) 
    $('#equation-input').val(atob(expressionBase64.replace('/', '')));
  else 
    $('#equation-input').val(decodeURIComponent(expression_unicode));
  
});

// Function to trim leading and trailing spaces
function trimSpaces(s) {
  return s.trim ? s.trim() : s.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
}

function isBase64Encoded(str) {
  // Remove white spaces from the string before checking
  str = str.trim();

  // Base64 encoded strings typically have a length that is a multiple of 4
  // and only contain characters from the base64 character set, plus optional '=' padding
  const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;

  // Unicode-encoded strings should not match the base64 regex
  return base64Regex.test(str);
}


// Function to get the value of a query variable from the URL
function getQueryVariable(variable) {
  const query = window.location.search.substring(1);
  const vars = query.split('&');
  for (let i = 0; i < vars.length; i++) {
    const pair = vars[i].split('=');
    if (decodeURIComponent(pair[0]) === variable) {
      return decodeURIComponent(pair[1]);
    }
  }
  return null;
}


// Get things started.
$('#equation-input').change(update_expression);
$('#equation-input').change(resetParameters);
$('#show-link').click(showLink);
$(update_expression);

//Next functions for sidebars and interaction with dom

function openLeftMenu() {
  closeRightMenu();
  document.getElementById("leftMenu").style.width = "100%";
  document.getElementById("leftMenu").style.display = "block";
  document.getElementById("equation-input").style.display = "none";
  document.getElementById("show-link").style.display = "none";
  document.getElementById("home").style.display = "none";
  document.getElementById("sketch-Holder").style.display = "none";
}

function closeLeftMenu() {
  document.getElementById("leftMenu").style.display = "none";
  document.getElementById("equation-input").style.display = "inline-block";
  document.getElementById("show-link").style.display = "inline-block";
  document.getElementById("home").style.display = "inline-block";
  document.getElementById("sketch-Holder").style.display = "inline-block";
}

function openRightMenu() {
  document.getElementById("main").style.marginRight = "35%";
  document.getElementById("rightMenu").style.width = "35%";
  document.getElementById("rightMenu").style.display = "block";
  document.getElementById("openNav").style.display = 'none';
  document.getElementById("sketch-Holder").style.position = "absolute";
  document.getElementById("sketch-Holder").style.top = "50%";
  document.getElementById("sketch-Holder").style.left = "30%";
  document.getElementById("sketch-Holder").style.transform = "translate(0%, 0%);";
}

function closeRightMenu() {
  document.getElementById("main").style.marginRight = "0%";
  document.getElementById("rightMenu").style.display = "none";
  document.getElementById("openNav").style.display = "inline-block";
  document.getElementById("sketch-Holder").style.position = "fixed";
  document.getElementById("sketch-Holder").style.top = "50%";
  document.getElementById("sketch-Holder").style.left = "50%";
  document.getElementById("sketch-Holder").style.transform = "translate(-50%, -50%)";
}

function updateTextInput(val) {
  document.getElementById('textInput').value = val;
  resetParameters();
}

function reloadPage() {
  location.reload();
}

/*
document.getElementById("pZoom").oninput = function () {
  document.getElementById('zL').innerHTML = this.value;
  resetPlotDim();
};
*/

document.getElementById("pt").oninput = function () {
  document.getElementById('tL').innerHTML = this.value;
  resetParameters();
};

document.getElementById("pu").oninput = function () {
  document.getElementById('uL').innerHTML = this.value;
  resetParameters();
};

document.getElementById("pn").oninput = function () {
  document.getElementById('nL').innerHTML = this.value;
  resetParameters();
};

/* 
	The follwing function is to include an HTML file in the slides
	Source: https://www.w3schools.com/howto/howto_html_include.asp
*/

function includeHTML() {
  let z, i, elmnt, file, xhttp;
  /*loop through a collection of all HTML elements:*/
  z = document.getElementsByTagName("*");
  for (i = 0; i < z.length; i++) {
    elmnt = z[i];
    /*search for elements with a certain atrribute:*/
    file = elmnt.getAttribute("w3-include-html");
    if (file) {
      /*make an HTTP request using the attribute value as the file name:*/
      xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
          if (this.status == 200) {
            elmnt.innerHTML = this.responseText;
          }
          if (this.status == 404) {
            elmnt.innerHTML = "Page not found.";
          }
          /*remove the attribute, and call this function once more:*/
          elmnt.removeAttribute("w3-include-html");
          includeHTML();
        }
      }
      xhttp.open("GET", file, true);
      xhttp.send();
      /*exit the function:*/
      return;
    }
  }
};