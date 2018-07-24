var camera, controls, scene, renderer, raycaster;
var mouse = new THREE.Vector2(), INTERSECTED, ACTIVE_SQUARE;


function init() {
  console.log('init');
  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setSize(window.innerWidth, window.innerHeight);
  scene = new THREE.Scene();
  raycaster = new THREE.Raycaster();

  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  //camera.position.z = 500;
  camera.position.set(0, 0, 10);

  //controls
  controls = new THREE.TrackballControls(camera);

  //controls.addEventListener('change', render); //call only in static scenes
  controls.rotateSpeed = 5.0;
  controls.zoomSpeed = 8.0;
  controls.panSpeed = 0.8;

  controls.noZoom = false;
  controls.noPan = false;

  controls.staticMoving = true;
  controls.dynamicDampingFactor = 0.3;

  controls.keys = [ 65, 83, 68 ];

  //controls.addEventListener('change', render);

  /*controls.enableDamping = true;
  controls.dampingFactor = 0.25;

  controls.screenSpacePanning = false;

  controls.minDistance = -100;
  controls.maxDistance = 500;

  controls.maxPolarAngle = Math.PI / 2;*/

  window.addEventListener("resize", onWindowResize, false);
  document.addEventListener( 'mousedown', onDocumentMouseDown, false );   
  document.addEventListener("keydown", onDocumentKeyDown, false);

}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );
  controls.handleResize();
  render();
}

function onDocumentMouseDown( event ) {
    event.preventDefault();
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

function onDocumentKeyDown( event ) {
  const keyCode = event.which;
  //console.log("This was the key that was pressed: "+keyCode);
  //TODO: On Key Pressed Logic
  if ( INTERSECTED ) {
    var x = document.createElement("canvas");
    var xc = x.getContext("2d");
    x.width = x.height = 128;
    xc.fillStyle = "white";
    xc.fillRect(0, 0, 128, 128);
    xc.shadowColor = "#000";
    xc.shadowBlur = 7;
    xc.fillStyle = "black";
    xc.font = "64pt arial bold";
    xc.textAlign = "center";
    xc.fillText(String.fromCharCode(keyCode), 64, 96);

    var cmap = new THREE.Texture(x);
    INTERSECTED.material.map = cmap;
    INTERSECTED.material.map.needsUpdate = true;

    var clicked = INTERSECTED;
    var newPosition = INTERSECTED.position.clone();
    if (INTERSECTED.word.direction === 'y') {
      newPosition[INTERSECTED.word.direction] -= 1;
    } else {
      newPosition[INTERSECTED.word.direction] += 1;
    }
    console.log("Old Position: ",INTERSECTED);
    var nextBlock = scene.getObjectByName(newPosition.x+"-"+newPosition.y+"-"+newPosition.z);
    if (nextBlock) {
      INTERSECTED.material.color.setHex( 0xFFFFFF );
      INTERSECTED = scene.getObjectByName(newPosition.x+"-"+newPosition.y+"-"+newPosition.z);
      INTERSECTED.material.color.setHex( 0xff0000 );
    }
   

    ACTIVE_SQUARE = INTERSECTED;
    console.log("New intersects: ",INTERSECTED);

  } 
}

function animate() {
  requestAnimationFrame( animate );
  controls.update();
  render();
}

function render() {
  //console.log(scene.children);
  camera.updateMatrixWorld();
  raycaster.setFromCamera( mouse, camera );
  var intersects = raycaster.intersectObjects(scene.children);
  if ( intersects.length > 0 ) {
    if ( INTERSECTED != intersects[ 0 ].object && !ACTIVE_SQUARE ) {
      if ( INTERSECTED ) {
        INTERSECTED.material.color.setHex( 0xFFFFFF );
      }
      INTERSECTED = intersects[ 0 ].object;
      ACTIVE_SQUARE = INTERSECTED;
      INTERSECTED.material.color.setHex( 0xff0000 );
    }
  } else {
    ACTIVE_SQUARE = null;
  }
  renderer.render(scene, camera);

}

init();

animate();
