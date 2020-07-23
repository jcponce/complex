// TODO : Clean this up a bit. It's still pretty messy.

    // Get the starting canvas size
    let WIDTH = $("#display-area").width(),
      HEIGHT = $("#display-area").height();

    // Get the DOM element to attach the render canvas to
    let $container = $("#display-area");

    // Create a WebGL renderer, camera and a scene
    let renderer = new THREE.WebGLRenderer();
    let camera = new THREE.OrthographicCamera(
      WIDTH / -2,
      WIDTH / 2,
      HEIGHT / 2,
      HEIGHT / -2,
      1,
      10
    );

    // Create scene
    scene = new THREE.Scene();

    // Set uniforms
    let uniforms = {
      t: {
        type: "f",
        value: 1.0
      },
      s: {
        type: "s",
        value: 0.0
      },
      scale: {
        type: "s",
        value: 2.0
      },
      _option: {
        type: "f",
        value: 0.0
      },
      gridTexture: {
        type: "t",
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

    /*//I don't need this function for domain coloring
    function setTexture(url) {
      //var gridTexture = THREE.ImageUtils.loadTexture(url);
      //gridTexture.wrapS = gridTexture.wrapT = THREE.RepeatWrapping;
      var gridTexture = new THREE.TextureLoader().load( url );
      gridTexture.wrapS = THREE.RepeatWrapping;
      gridTexture.wrapT = THREE.RepeatWrapping;
      gridTexture.repeat.set(2, 2);

      uniforms.gridTexture.value = gridTexture;
    }
    setTexture("images/plotfz-2.png");*/


    // The camera starts at 0,0,0 so pull it back
    camera.position.z = 5;
    renderer.setSize(WIDTH, HEIGHT);

    function reset_camera() {
      let WIDTH = $("#display-area").width(),
        HEIGHT = $("#display-area").height();

      // We need to update the uniforms passed to the shader so it can later
      // compute the aspect ratio and maintain square pixels.
      uniforms.width.value = WIDTH;
      uniforms.height.value = HEIGHT;

      renderer.setSize(WIDTH, HEIGHT);
    }

    reset_camera();

    // attach the render-supplied DOM element
    $container.append(renderer.domElement);

    // Make a full-screen quad and add it to the THREE.js scene
    let plane = new THREE.PlaneBufferGeometry(WIDTH, HEIGHT);
    let quad = new THREE.Mesh(plane, null);
    quad.position.z = 0;
    scene.add(quad);

    // Produce the Parser based on our grammar
    $(function () {
      window.pegParser = PEG.buildParser(
        $("#complex-expression-peg-grammar").text()
      );
    });

    // I need an error message to show when the user enters an incomplete expression
    function buildErrorMessage(e) {
      return e.location !== undefined ?
        "" + e.message :
        e.message;
    }

    // Whenever the user updates the input field, we need to parse and produce a
    // new shader to update what's being displayed.
    // Also, I need to check the input expression is correct
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

      console.log(compiledExpression); //debug:)

      //Show or hide error message
      if (result === true) {
        $('#error-container').hide();
      } else $('#error-container').show();

      quad.material = shaderMaterial;
      begin = Date.now();// Reset parameter s
    }

    //This part is for zoom in/out. Maybe this is too convoluted :)
    let ammount = 0.97;
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

    // I need variable to define a parameter 's' changing at a constant rate
    let begin = Date.now();
    
    function render() {
      // If we're rendering video, update that.
      if (window.video && video.readyState === video.HAVE_ENOUGH_DATA) {
        videoImageContext.drawImage(
          video,
          0,
          0,
          videoImage.width,
          videoImage.height
        );
        if (videoTexture) videoTexture.needsUpdate = true;
      }

      // This a parameter 't' oscillating between -1 and 1
      quad.material.uniforms.t.value = easFunc(new Date().getTime() * 0.0005 * 0.75);
      quad.material.uniforms.t.needsUpdate = true;

      // This the parameter 's" changing at a constant rate
      let count = Date.now();
      let s = Math.abs(begin - count) * 0.00025;
      quad.material.uniforms.s.value = s;
      quad.material.uniforms.s.needsUpdate = true;

      // Update value of sc to zoom in or out
      quad.material.uniforms.scale.value = sc;

      renderer.render(scene, camera);

      requestAnimationFrame(render);
    }

    let easFunc = (x) => {
      return Math.sin(Math.PI / 2.0 * Math.cos(x));
    }

    // When the user clicks one of the images icon, change the plot
    $("#texture-options a").each(function () {
      $(this).click(function () {
        let texture_path = $(this)
          .find("img")
          .first()
          .attr("src");
        if (texture_path === "images/hsv.png") {
          uniforms._option.value = 0.0;
          //console.log(uniforms._option.value);
          //setTexture(texture_path);
        } else if (texture_path === "images/hsvmod.png") {
          uniforms._option.value = 1.0;
          //console.log(uniforms._option.value);
          //setTexture(texture_path);
        } else if (texture_path === "images/hsvphase.png") {
          uniforms._option.value = 2.0;
          //console.log(uniforms._option.value);
          //setTexture(texture_path);
        } else if (texture_path === "images/hsvcomb.png") {
          uniforms._option.value = 3.0;
          //console.log(uniforms._option.value);
          //setTexture(texture_path);
        } else {
          uniforms._option.value = 4.0;
          //Stream from the webcam.
          initWebCam();
        }
      });
    });

    // When the user presses the button, show some copyable text
    function showLink() {
      let expression_base64 = btoa($("#equation-input").val());

      let url = [location.protocol, "//", location.host, location.pathname].join(
        ""
      );
      url = url + "?expression=" + expression_base64;

      $("#copyable-link").val(url);
      $("#link-container").show();
      $("#copyable-link").select();
    }
    $("#copyable-link").blur(function () {
      $("#link-container").hide();
    });

    // If the user already specified
    $(function () {
      var expression_base64 = getQueryVariable("expression");
      //console.log(expression_base64);
      if (expression_base64) {
        $("#equation-input").val(atob(expression_base64.replace("/", "")));
      }
    });

    // Get things started.
    $("#equation-input").change(update_expression);
    $("#show-link").click(showLink);
    $(window).resize(reset_camera);
    $(update_expression);
    $(render);