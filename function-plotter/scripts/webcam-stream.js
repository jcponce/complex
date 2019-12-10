// Written by Juan Carlos Ponce Campuzano 10-Dec-2019
// This is a new version that actually works for desktops and tablets.

function initWebCam(){
 
    video = document.getElementById( 'monitor' );
    videoImage = document.getElementById( 'videoImage' );
    videoImageContext = videoImage.getContext( '2d' );

    // background color if no video present
    videoImageContext.fillStyle = '#000000';
    videoImageContext.fillRect( 0, 0, videoImage.width, videoImage.height );

    videoTexture = new THREE.Texture( videoImage );
    videoTexture.wrapS = videoTexture.wrapT = THREE.RepeatWrapping;
    videoTexture.repeat.set( 2, 2  );
    uniforms.gridTexture.value = videoTexture;
    
    if ( navigator.mediaDevices && navigator.mediaDevices.getUserMedia ) {

        var constraints = { video: { width: 1280, height: 720, facingMode: 'user' } };

        navigator.mediaDevices.getUserMedia( constraints ).then( function ( stream ) {

            // apply the stream to the video element used in the texture

            video.srcObject = stream;
            video.play();

        } ).catch( function ( error ) {

            console.error( 'Unable to access the camera/webcam.', error );

        } );

    } else {

        console.error( 'MediaDevices interface not available.' );

    }
    
}
