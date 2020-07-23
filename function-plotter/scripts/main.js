// TODO : Clean this up a bit. It's still pretty messy.

  // Get the starting canvas size
  let WIDTH = $('#display-area').width(),
    HEIGHT = $('#display-area').height();

  // Get the DOM element to attach the render canvas to
  let $container = $('#display-area');

  // Create a WebGL renderer, camera and a scene
  let renderer = new THREE.WebGLRenderer();
  let camera = new THREE.OrthographicCamera(WIDTH / -2, WIDTH / 2, HEIGHT / 2, HEIGHT / -2, 1, 10);
  let scene = new THREE.Scene();

  let uniforms = {
    t: {
      type: "f",
      value: 1.0
    },
    s: {
      type: "f",
      value: 1.0
    },
    scale: {
        type: "s",
        value: 2.0
      },
    gridTexture: {
      type: 't',
      value: null
    },
    width: {
      type: "f",
      value: WIDTH
    },
    height: {
      type: "f",
      value: HEIGHT
    }
  };

  function setTexture(url) {
    // loadTexture was deprecated in version 110
    //var gridTexture = THREE.ImageUtils.loadTexture(url);
    //gridTexture.wrapS = gridTexture.wrapT = THREE.RepeatWrapping;
    let gridTexture = new THREE.TextureLoader().load(url);
    gridTexture.wrapS = THREE.RepeatWrapping;
    gridTexture.wrapT = THREE.RepeatWrapping;
    gridTexture.repeat.set(2, 2);

    uniforms.gridTexture.value = gridTexture;
  }
  setTexture('images/plotfz-2.png');

  // The camera starts at 0,0,0 so pull it back
  camera.position.z = 5;
  renderer.setSize(WIDTH, HEIGHT);

  function reset_camera() {
    let WIDTH = $('#display-area').width(),
      HEIGHT = $('#display-area').height();

    // We need to update the uniforms passed to the shader so it can later
    // compute the aspect ratio and maintain square pixels.
    uniforms.width.value = WIDTH;
    uniforms.height.value = HEIGHT;

    renderer.setSize(WIDTH, HEIGHT);
  }

  reset_camera();

  // attach the render-supplied DOM element
  $container.append(renderer.domElement);

  // Produce the Parser based on our grammar
  $(function () {
    window.pegParser = PEG.buildParser($('#complex-expression-peg-grammar').text());
  });

  // Make a full-screen quad and add it to the THREE.js scene
  let plane = new THREE.PlaneBufferGeometry(WIDTH, HEIGHT);
  let quad = new THREE.Mesh(plane, null);
  quad.position.z = 0;
  scene.add(quad);

  function buildErrorMessage(e) {
    return e.location !== undefined ?
      "" + e.message :
      e.message;
  }

   //I need a function to define a parameter 's' changing at a constant rate
  // var begin;
  //function getNow(){
   // begin  = Date.now();
    //console.log(begin);
  //}

  // Whenever the user updates the input field, we need to parse and produce a
  // new shader to update what's being displayed.
  function update_expression() {
    let new_expression = $("#equation-input").val();
    let result;
    try {
      var compiledExpression = pegParser.parse(new_expression);
      result = true;
    } catch (e) {
      $("#parse-message").attr("class", "message error").text(buildErrorMessage(e));

      result = false;
    }

    let shaderMaterial = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: $("#vertexshader").text(),
      fragmentShader: $("#fragmentshader")
        .text()
        .replace("EXPRESSION", compiledExpression)
    });
    
    console.log(compiledExpression);//debug:)

    if (result === true) {
      $('#error-container').hide();
    } else $('#error-container').show();

    quad.material = shaderMaterial;
    //getNow();
    start = Date.now();
  }

  //This part is for zoom in/out. Maybe this is too convoluted. :)
    let ammount = 0.99;
    let origSize = 2.0;
    let zoom = 1.0;
    let sc = origSize;
    window.addEventListener("wheel", event => {
      let a = event.deltaY < 0.0 ? ammount : 1 / ammount;
      zoom *= a;
      sc = origSize * zoom;
      //console.info(sc);
    });

  // When rendering, we just need to make sure our convenience variables are
  // up-to-date before we render.
  let start = Date.now();
  function render() {
    // If we're rendering video, update that.
    if (window.video && video.readyState === video.HAVE_ENOUGH_DATA) {
      videoImageContext.drawImage(video, 0, 0, videoImage.width, videoImage.height);
      if (videoTexture)
        videoTexture.needsUpdate = true;
    }

    // Update parameter 's' changing at a constant rate
    let count = Date.now();
    let s = Math.abs(start - count)*0.00025;
    quad.material.uniforms.s.value = s;//Math.sin(new Date().getTime() * 0.0005);
    quad.material.uniforms.s.needsUpdate = true;

    // Update parameter 't' oscillating between -1, 1
    quad.material.uniforms.t.value = easFunc(new Date().getTime() * 0.0005 * 0.75);
    quad.material.uniforms.t.needsUpdate = true;

    quad.material.uniforms.scale.value = sc;

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }

  // My easing function :)
  let easFunc = (x) => {
    return Math.sin(Math.PI / 2.0 * Math.cos(x));
  }

  // When the user clicks one of the images/webcam icon, change the background
  $('#texture-options a').each(function () {
    $(this).click(function () {
      let texture_path = $(this).find('img').first().attr('src');
      if (texture_path) {
        setTexture(texture_path);
      } else {
        // Currently, the only other option here is to stream from the webcam.
        initWebCam();
      }
    });
  });

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
    console.log(expression_base64);
    if (expression_base64) {
      $('#equation-input').val(atob(expression_base64.replace('/', '')));
    }
  });

  // Get things started.
  $('#equation-input').change(update_expression);
  $('#show-link').click(showLink);
  $(window).resize(reset_camera);
  $(update_expression);
  $(render);