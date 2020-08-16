precision highp float;

    #define M_PI 3.1415926535897932384626433832795
    #define M_E 2.7182818284

    #define A x.x
    #define B x.y
    #define C y.x
    #define D y.y

    varying vec2 vUv;
    uniform float t;
    uniform float width, height;
    uniform sampler2D gridTexture;

    // Convert from Hue,Saturation/Value to RGB
    // http://lolengine.net/blog/2013/07/27/rgb-to-hsv-in-glsl
    vec3 hsv2rgb(vec3 c)
    {
      vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
      vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
      return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
    }

    float arg(vec2 x) { return atan(B,A); }
    
    //New auxiliary functions by Juan Carlos Ponce Campuzano 12-Nov-2019
    
    float sinh( float x ) { return (pow(M_E, x) - pow(M_E, -x))*0.5; }
    float cosh( float x ) { return (pow(M_E, x) + pow(M_E, -x))*0.5; }
    //New auxiliary functions ends
    
    float complex_r(float x, float y) { return length(vec2(x,y)); }
    float complex_theta(float x, float y) { return arg(vec2(x,y)); }
    vec2 complex(float x, float y) { return vec2(x,y); }

    // https://en.wikipedia.org/wiki/Complex_number#Elementary_operations
    vec2 complex_add(vec2 x, vec2 y) { return x + y; }
    vec2 complex_sub(vec2 x, vec2 y) { return x - y; }
    vec2 complex_mul(vec2 x, vec2 y) { return vec2( A*C-B*D, B*C+A*D); }
    vec2 complex_div(vec2 x, vec2 y) { return vec2( (A*C+B*D)/(C*C+D*D), (B*C-A*D)/(C*C+D*D)); }

    // http://www.abecedarical.com/zenosamples/zs_complexnumbers.html
    vec2 complex_pow(vec2 x, vec2 y) {
      float rho = length(x);
      float theta = arg(x);
      float angle = C * theta + D * log(rho);
      float real = cos(angle);
      float imag = sin(angle);
      return vec2(real, imag) * (pow(rho, C) * pow(M_E, -D * theta));
    }

    vec2 complex_sin(vec2 x) {
      vec2 iz = complex_mul(vec2(0.0, 1.0), x);
      vec2 inz = complex_mul(vec2(0.0, -1.0), x);
      vec2 eiz = complex_pow( vec2(M_E, 0.0), iz );
      vec2 einz = complex_pow( vec2(M_E, 0.0), inz );
      return complex_div( eiz - einz, complex(0.0, 2.0));
    }

    vec2 complex_cos(vec2 x) {
      vec2 iz = complex_mul(vec2(0.0, 1.0), x);
      vec2 inz = complex_mul(vec2(0.0, -1.0), x);
      vec2 eiz = complex_pow( vec2(M_E, 0.0), iz );
      vec2 einz = complex_pow( vec2(M_E, 0.0), inz );
      return complex_div( eiz + einz, complex(2.0, 0.0));
    }
    
    vec2 complex_log(vec2 x) {
      return vec2( log( length(x) ), arg(x) );
    }
    
    //New complex functions added by Juan Carlos Ponce Campuzano 12-Nov-2019
    
    vec2 complex_re(vec2 x) {
       vec2 z = complex_mul(vec2(0.5, 0.0), x);
        float real = A;
        float nimag = -B;
        vec2 conjz = complex_mul(vec2(0.5, 0.0), vec2(real, nimag));
        return complex_add( z, conjz );
    }
    
    vec2 complex_im(vec2 x) {
       vec2 z = complex_mul(vec2(0.5, 0.0), x);
       float real = A;
       float nimag = -B;
       vec2 conjz = complex_mul(vec2(0.5, 0.0), vec2(real, nimag));
       vec2 sub = complex_sub( z, conjz );
       return complex_div( sub, vec2(0.0, 1) );
    }
    
    vec2 complex_conj(vec2 x) {
        float real = A;
        float nimag = -B;
      return vec2( real, nimag);
    }
    
    vec2 complex_tan(vec2 x) {
        float real = sin(A+A)/(cos(A+A)+cosh(B+B));
        float imag = sinh(B+B)/(cos(A+A)+cosh(B+B));
      return vec2( real, imag);
    }
    
    vec2 complex_csc(vec2 x) {
        float real = (-sin(A)*cosh(B)-sin(A)*cosh(B))/(cos(A+A)-cosh(B+B));
        float imag = (cos(A)*sinh(B)+cos(A)*sinh(B))/(cos(A+A)-cosh(B+B));
      return vec2( real, imag);
    }
    
    vec2 complex_sec(vec2 x) {
        float real = (cos(A)*cosh(B)+cos(A)*cosh(B))/(cos(A+A)+cosh(B+B));
        float imag = (sin(A)*sinh(B)+sin(A)*sinh(B))/(cos(A+A)+cosh(B+B));
      return vec2( real, imag);
    }
    
    vec2 complex_cot(vec2 x) {
        float real = sin(A+A)/(cos(A+A)-cosh(B+B));
        float imag = sinh(B+B)/(cos(A+A)-cosh(B+B));
      return vec2( real, imag);
    }
    
    vec2 complex_sinh(vec2 x) {
        float real = sinh(A)*cos(B);
        float imag = cosh(A)*sin(B);
      return vec2( real, imag);
    }
    
    vec2 complex_cosh(vec2 x) {
        float real = cosh(A)*cos(B);
        float imag = sinh(A)*sin(B);
      return vec2( real, imag);
    }
    
    vec2 complex_tanh(vec2 x) {
        float real = sinh(A+A)/(cosh(A+A)+cos(B+B));
        float imag = sin(B+B)/(cosh(A+A)+cos(B+B));
      return vec2( real, imag);
    }
    
    vec2 complex_csch(vec2 x) {
        float real = (-sinh(A)*cos(B)-sinh(A)*cos(B))/(-cosh(A+A)+cos(B+B));
        float imag = (cosh(A)*sin(B)+cosh(A)*sin(B))/(-cosh(A+A)+cos(B+B));
      return vec2( real, imag);
    }
    
    vec2 complex_sech(vec2 x) {
        float real = (+cosh(A)*cos(B)+cosh(A)*cos(B))/(cosh(A+A)+cos(B+B));
        float imag = (-sinh(A)*sin(B)-sinh(A)*sin(B))/(cosh(A+A)+cos(B+B));
      return vec2( real, imag);
    }
    
    vec2 complex_coth(vec2 x) {
        float real = -sinh(A+A)/(-cosh(A+A)+cos(B+B));
        float imag = -sin(B+B)/(-cosh(A+A)+cos(B+B));
      return vec2( real, imag);
    }

    vec2 complex_abs(vec2 x) {
      return vec2( length(x), 0 );
    }
    
    //new functions ends


    bool isNan(float val)
    {
        return (val <= 0.0 || 0.0 <= val) ? false : true;
    }

		void main()
		{
      float a = vUv.x*2.0 - 1.0;
      float b = vUv.y*2.0 - 1.0;
      const float scale = 2.0;

      // Make sure pixels are square
      a *= scale * width / height;
      b *= scale;

      vec2 final_expr = z;

      bool opt = true;

      float L = length(final_expr);
      if(isNan(length(final_expr)) || L > 1.0e10) {
        discard;
      }

      // TODO : Make this user-controlled
      if(opt) {
        // HSV Domain Coloring

        float l = length(final_expr);
        
        float _r = log(l) / 0.30102999566;

        //log(2) approx 0.30102999566
        //log(1.8) approx 0.2552725051
        
        //_r = 0.8 + (sin(_r) + 1.0) * 0.5 * 0.3;

        _r = 0.6 + 0.35 * ( _r - floor( _r ) );

        float _arg = (M_PI - atan(final_expr[1], -final_expr[0])) / ( M_PI + M_PI);

        vec3 hsv = vec3(_arg, 1, 1);
        vec3 rgb = hsv2rgb( hsv );

  			gl_FragColor = vec4(rgb, 1.0);

      } else {
        // Texture-based Domain Coloring
        //final_expr = min(vec2(1.0, 1.0), final_expr);
        //final_expr = max(vec2(-1.0, -1.0), final_expr);
        vec4 tex = texture2D(gridTexture, final_expr / (2.0*scale) + vec2(0.5,-0.5));
        gl_FragColor = vec4( tex.xyz, 1.0 );

      }
		}