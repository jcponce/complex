"use strict"

//Namespace to store everything
let graph = {
  settings: {},
  props: {},
  objects: {},
  currEquation: "f(z)=z",
};
let lastJson = "";
var DEBUG = false;

function initEquation() {
  const equationInput = $("#equations");
  const updateDelay = 500;
  let lastEquation = "";
  let lastEquationChange = null;
  let cMin = -1;
  let cMax = 1;

  $("#cReInput").on("change input", function () {
    uniforms.c_C.value.x = $(this).val() * (cMax - cMin) + cMin;
    $(".c.value").text(`${uniforms.c_C.value.x.toFixed(4)} + ${uniforms.c_C.value.y.toFixed(4)}i`);
  }).change();

  $("#cImInput").on("change input", function () {
    uniforms.c_C.value.y = $(this).val() * (cMax - cMin) + cMin;
    $(".c.value").text(`${uniforms.c_C.value.x.toFixed(4)} + ${uniforms.c_C.value.y.toFixed(4)}i`);
  }).change();

  $("#cMin").change(function () {
    cMin = Number($(this).val()) || 0;
  }).change();

  $("#cMax").change(function () {
    cMax = Number($(this).val()) || 1;
  }).change();

  $(".c.value").click(function () {
    let re = prompt("Real part of c", uniforms.c_C.value.x);
    let im = prompt("Imaginary part of c", uniforms.c_C.value.y);

    if (re && im) {
      $("#cReInput").val((Number(re) - cMin) / (cMax - cMin));
      $("#cImInput").val((Number(im) - cMin) / (cMax - cMin));
      $(".c.value").text(`${uniforms.c_C.value.x.toFixed(4)} + ${uniforms.c_C.value.y.toFixed(4)}i`);

      uniforms.c_C.value.x = Number(re);
      uniforms.c_C.value.y = Number(im);
    }
  });

  function update() {
    const equation = equationInput.val();
    const plot = graph.objects.plot;

    if (equation != lastEquation) {
      lastEquation = equation;
      lastEquationChange = Date.now();
    }

    if (lastEquationChange != null && Date.now() - lastEquationChange >= updateDelay) {
      try {
        plot.material = compileMaterial(lastEquation, "plot");
        graph.currEquation = lastEquation;

        location.hash = encodeURIComponent(graph.currEquation);
        $("#errors").text("");
      } catch (err) {
        $("#errors").text(err.message)
      }

      lastEquationChange = null;
    }

    requestAnimationFrame(update);
  }

  update();
}

function initOptions() {
  const groups = ["equation", "about", "c", "plot", "grid", "cursor"];

  groups.forEach(function (name) {
    $(`.${name}.showSettings`).change(function () {
      if ($(this).prop("checked")) {
        $(`.${name}.setting`).slideDown(200);
      } else {
        $(`.${name}.setting`).slideUp(200);
      }
    }).change();

    $(`.${name}.showHelp`).click(function () {
      $(`.${name}.popUpWrapper`).fadeIn(200);
    });
  });

  $(".popUpWrapper").click(function (e) {
    if (e.target == this) {
      $(this).fadeOut(200);
    }
  });

  $(".popUpClose").click(function () {
    $(this).parents(".popUpWrapper").fadeOut(200);
  });

  //$(".about.popUpWrapper").show();

  $("#fullscreen").click(function () {
    var elem = document.getElementById("plot");

    var isInFullScreen = (document.fullscreenElement && document.fullscreenElement !== null) ||
        (document.webkitFullscreenElement && document.webkitFullscreenElement !== null) ||
        (document.mozFullScreenElement && document.mozFullScreenElement !== null) ||
        (document.msFullscreenElement && document.msFullscreenElement !== null);

    if (!isInFullScreen) {
      if (elem.requestFullscreen) {
          elem.requestFullscreen();
      } else if (elem.mozRequestFullScreen) {
          elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullScreen) {
          elem.webkitRequestFullScreen();
      } else if (elem.msRequestFullscreen) {
          elem.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
          document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
      }
    }
  });
}

function createPlot() {
  const geometry = new THREE.PlaneBufferGeometry(10, 10, 256, 256);
  const material = compileMaterial(graph.currEquation, "plot");
  const plot = new THREE.Mesh(geometry, material);

  plot.lookAt(0, 1, 0);

  $("#plotShow").change(function () {
    graph.settings.plotShow = $(this).prop("checked");
    plot.visible = graph.settings.plotShow;
  }).change();

  $("#plotHeight").change(function () {
    graph.settings.plotHeight = Number($(this).val());
  }).change();

  $("#plotColor").change(function () {
    graph.settings.plotColor = Number($(this).val());
    if (graph.settings.plotColor == 1 || graph.settings.plotColor == 3) {
      $(".plotSaturation.setting").slideDown(300);
    } else {
      $(".plotSaturation.setting").slideUp(300);
    }
  }).change();

  $("#plotSaturation").on("change input", function () {
    graph.settings.plotSaturation = Number($(this).val());
  }).change();

  plot.onBeforeRender = function () {
    uniforms.plotHeight.value = graph.settings.plotHeight;
    uniforms.plotColor.value = graph.settings.plotColor;
    uniforms.plotSaturation.value = graph.settings.plotSaturation;
  };

  return plot;
}

function drawCanvasGrid(ctx, offset, scale, sizePx, labels, spacing) {
  const originX = -offset.x / scale * sizePx + sizePx / 2;
  const originY = -offset.z / scale * sizePx + sizePx / 2;

  let gridSpace = 1;
  let gridSize = gridSpace * sizePx / scale;

  while (true) {
    if (gridSize < spacing) {
      if (gridSpace.toExponential(0).substr(0, 1) == "2") gridSpace *= 2.5;
      else gridSpace *= 2;
      gridSize = gridSpace * sizePx / scale;

    } else if (gridSize > spacing * 3) {
      if (gridSpace.toExponential(0).substr(0, 1) == "5") gridSpace /= 2.5;
      else gridSpace /= 2;
      gridSize = gridSpace * sizePx / scale;

    } else break;
  }

  let gridStartX = originX % gridSize;
  if (gridStartX < 0) gridStartX += gridSize;
  let gridStartY = originY % gridSize;
  if (gridStartY < 0) gridStartY += gridSize;

  ctx.clearRect(0, 0, sizePx, sizePx);

  //Draw major axes
  ctx.strokeStyle = "#FFFFFF";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(0, originY);
  ctx.lineTo(sizePx, originY);
  ctx.moveTo(originX, 0);
  ctx.lineTo(originX, sizePx);
  ctx.stroke();

  //Draw minor geid lines
  ctx.font = "30px Arial";
  ctx.fillStyle = "#FFFFFF";
  ctx.lineWidth = 3;
  ctx.strokeStyle = "#df883a";
  ctx.beginPath();
  //Draw vertical lines
  for (let x = gridStartX, i = 0; x <= sizePx; x += gridSize, i++) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, sizePx);
    if (labels) {
      let xPos = (x - sizePx / 2) / sizePx * scale + offset.x;
      xPos = Math.round(xPos * 1e+9) / 1e+9;
      ctx.fillText(xPos, x + 5, sizePx - 10);
    }
  }

  ctx.stroke();
  ctx.strokeStyle = "#00BFFF";
  ctx.beginPath();

  //Draw horizontal lines
  for (let y = gridStartY, i = 0; y <= sizePx; y += gridSize, i++) {
    ctx.moveTo(0, y);
    ctx.lineTo(sizePx, y);
    if (labels) {
      let yPos = (y - sizePx / 2) / sizePx * scale + offset.z;
      yPos = Math.round(yPos * 1e+9) / 1e+9;
      ctx.fillText(-yPos + "i", 10, y - 5);
    }
  }

  ctx.stroke();
}

function createGrid() {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const size = 10;
  const sizePx = 1024;
  const labelFrequency = 1;

  canvas.width = sizePx;
  canvas.height = sizePx;

  const texture = new THREE.CanvasTexture(canvas);
  // texture.minFilter = THREE.NearestFilter;

  const material = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.DoubleSide,
    transparent: true,
    depthWrite: true,
  });

  const geometry = new THREE.PlaneBufferGeometry(size, size);
  const grid = new THREE.Mesh(geometry, material);

  grid.lookAt(0, 1, 0);

  $("#gridShow").change(function () {
    graph.settings.gridShow = $(this).prop("checked");
    grid.visible = graph.settings.gridShow;
  }).change();

  $("#gridSpacing").on("change input", function () {
    graph.settings.gridSpacing = Number($(this).val()) || 40;
  }).change();

  $("#gridLabels").change(function () {
    graph.settings.gridLabels = $(this).prop("checked");
  }).change();

  grid.onBeforeRender = function () {
    drawCanvasGrid(
      ctx, graph.props.position,
      graph.props.scale * size, sizePx,
      graph.settings.gridLabels,
      graph.settings.gridSpacing * 10
    );

    texture.needsUpdate = true;
  };

  return grid;
}

function createBBox() {
  const color = 0xFF8C00;
  const size = 10;
  const height = 10;

  const geometry = new THREE.BoxBufferGeometry(size, size, height);
  const edges = new THREE.EdgesGeometry(geometry);
  const material = new THREE.LineBasicMaterial({ color: color });
  const box = new THREE.LineSegments(edges, material);

  return box;
}

function createCursor() {
  const color = 0xFF8C00;
  const size = 10;
  const height = 10;

  var material = new THREE.LineDashedMaterial({
    color: color,
    scale: 10,
    dashSize: 2,
    gapSize: 2,
  });

  var point1 = new THREE.Vector3(0, height / 2, 0);
  var point2 = new THREE.Vector3(0, -height / 2, 0);

  var geometry = new THREE.Geometry();
  geometry.vertices.push(point1);
  geometry.vertices.push(point2);

  var line = new THREE.Line(geometry, material);
  line.computeLineDistances();

  var raycaster = new THREE.Raycaster();
  graph.props.cursorPos = new THREE.Vector2();
  
  $("#cursorShow").change(function () {
    graph.settings.cursorShow = $(this).prop("checked");
    if (!graph.settings.cursorShow) {
      $("#cursor").hide();
      line.visible = false;
    }
  }).change();

  $("#cursorContinuous").change(function () {
    graph.settings.cursorContinuous = $(this).prop("checked");
  }).change();

  $("#plot").on("mousedown touchstart", function (event) {
    let x = event.pageX;
    let y = event.pageY;
    if (event.touches !== undefined && event.touches.length > 0) {
      let x = event.touches[0].clientX;
      let y = event.touches[0].clientY;
    }

    if (graph.settings.cursorShow && x !== undefined && y !== undefined) {
      setCursor(x, y, false);
    }
  });

  $("#plot").on("mousemove", function (event) {
    let x = event.pageX;
    let y = event.pageY;
    if (event.touches !== undefined && event.touches.length > 0) {
      let x = event.touches[0].clientX;
      let y = event.touches[0].clientY;
    }

    if (graph.settings.cursorShow && x !== undefined && y !== undefined) {
      if (graph.settings.cursorContinuous) {
        setCursor(x, y, true);
      }

      if (raycastToGrid(x, y).length > 0) {
        $(this).css({cursor: "crosshair"});
      } else {
        $(this).css({cursor: "default"});
      }
    }
  });
  
  function raycastToGrid(x, y) {
    raycaster.setFromCamera(new THREE.Vector2(
      x / window.innerWidth * 2 - 1,
      -y / window.innerHeight * 2 + 1
    ), graph.objects.camera);

    return raycaster.intersectObject(graph.objects.grid);
  }

  function setCursor(x, y, hideCursor) {
    var hit = raycastToGrid(x, y);

    if (hit.length > 0) {
      graph.props.cursorPos.x = (hit[0].uv.x - 0.5) * size;
      graph.props.cursorPos.y = (hit[0].uv.y - 0.5) * size;

      updateCursor();
      
      $("#cursor").css({left: x, top: y});
      $("#cursor").show();

    } else if (hideCursor) {
      graph.props.cursorPos.x = null;
      graph.props.cursorPos.y = null;
      line.visible = false;
      $("#cursor").hide();
    }
  }

  function updateCursor() {
    var pos = graph.props.cursorPos;
    point1.x = pos.x;
    point1.z = -pos.y;
    point2.x = pos.x;
    point2.z = -pos.y;
    geometry.verticesNeedUpdate = true;
    line.visible = true;

    var z = math.complex(
      pos.x * uniforms.scale.value + uniforms.offset.value.x,
      pos.y * uniforms.scale.value + uniforms.offset.value.y
    );

    var scope = {
      c: math.complex(uniforms.c_C.value.x, uniforms.c_C.value.y)
    };
    math.evaluate(graph.currEquation, scope);
    var w = math.Complex(scope.f(z));

    $("#cursor").html(z.format(5) + ",<br>" + w.format(5));
  }

  line.onBeforeRender = function () {
    updateCursor()
  };

  return line;
}

function initScene() {
  const plotElement = $("#plot");
  const backgroundColor = 0x555555;
  const cameraSize = 7;
  const initHeight = 10;
  const plotRows = 1024;
  const canvasSizePx = 512;
  const minGridSize = 40;
  const labelFrequency = 2;

  let renderer = new THREE.WebGLRenderer();
  plotElement.append(renderer.domElement);

  let scene = new THREE.Scene();
  scene.background = new THREE.Color(backgroundColor);

  let camera = new THREE.OrthographicCamera(-cameraSize, cameraSize, cameraSize, -cameraSize, 0, 100);
  camera.position.set(0, 0, 50);
  scene.add(camera);

  let fakeCamera = new THREE.OrthographicCamera(-cameraSize, cameraSize, cameraSize, -cameraSize, 0, 100);
  fakeCamera.position.copy(camera.position);
  scene.add(fakeCamera);

  let controls = new THREE.OrbitControls(fakeCamera, renderer.domElement);
  controls.object.position.set(0, 50, 0);
  controls.screenSpacePanning = false;
  controls.saveState();

  let plotGroup = new THREE.Group();
  scene.add(plotGroup);

  let plot = createPlot();
  plotGroup.add(plot);

  let grid = createGrid();
  plotGroup.add(grid);

  let bBox = createBBox();
  plotGroup.add(bBox);

  let cursor = createCursor();
  plotGroup.add(cursor);

  $("#viewReset").click(function () {
    controls.reset();
  });

  graph.objects.renderer = renderer;
  graph.objects.scene = scene;
  graph.objects.camera = camera;
  graph.objects.fakeCamera = fakeCamera;
  graph.objects.controls = controls;
  graph.objects.plotGroup = plotGroup;
  graph.objects.plot = plot;
  graph.objects.grid = grid;
  graph.objects.bBox = bBox;
  graph.objects.cursor = cursor;
}

function initStats() {
  var stats = new Stats();
  stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
  document.body.appendChild(stats.domElement);
  $(stats.domElement).addClass("stats");

  graph.objects.stats = stats;
}

function onResize() {
  const plotElement = $("#plot");
  const width = plotElement.width();
  const height = plotElement.height();
  const aspect = width / height;
  const camera = graph.objects.camera;
  const renderer = graph.objects.renderer;

  camera.left = -aspect * camera.top;
  camera.right = aspect * camera.top;

  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
  graph.props.aspect = aspect;
}

function animate() {
  const controls = graph.objects.controls;
  const plotGroup = graph.objects.plotGroup;
  const renderer = graph.objects.renderer;
  const scene = graph.objects.scene;
  const camera = graph.objects.camera;

  controls.update();
  graph.objects.stats.update();

  graph.props.position = controls.target.clone();
  graph.props.scale = 1 / controls.object.zoom;
  graph.props.orientation = controls.object.quaternion.conjugate();

  plotGroup.quaternion.copy(graph.props.orientation);
  uniforms.offset.value.x = graph.props.position.x;
  uniforms.offset.value.y = -graph.props.position.z;
  uniforms.scale.value = graph.props.scale;

  let currJson = JSON.stringify([
    graph.settings,
    graph.props,
    graph.currEquation,
    uniforms,
  ]);

  if (currJson != lastJson) {
    renderer.render(scene, camera);
    lastJson = currJson;
  }

  requestAnimationFrame(animate);
};

function readURLParms() {
  var hash = decodeURIComponent(location.hash.substr(1));
  if (hash.length > 1) $("#equations").val(hash);
}

$(window).resize(onResize);

window.onerror = function (message, src, line, col, err) {
  if (DEBUG) {
    alert(
      "An unexpected error occured:\n" + 
      message + "\n" +
      "line " + line + 
      " in " + src
    );
  }
};

$(document).ready(function () {
  readURLParms();
  initEquation();
  initOptions();
  initScene();
  initStats();
  onResize();
  animate();
});