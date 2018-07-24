var camera, controls, scene, renderer, raycaster;
var mouse = new THREE.Vector2(), INTERSECTED, ACTIVE_SQUARE;

function init() {
  console.log('init');
  console.log(dimension);
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

    //find puzzle center
    var xCenter = dimension.x / 2.0;
    var yCenter = dimension.y / 2.0;
    var zCenter = dimension.z / 2.0;

  camera.position.set(xCenter, -yCenter, dimension.z  + 5);

    //controls
  controls = new THREE.TrackballControls(camera, xCenter, yCenter, zCenter);

  controls.rotateSpeed = 5.0;
  controls.zoomSpeed = 8.0;
  controls.panSpeed = 0.8;

  controls.noZoom = false;
  controls.noPan = false;

  controls.staticMoving = false;
  controls.dynamicDampingFactor = 0.2;

  controls.keys = [ 65, 83, 68 ];

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



// function onDocumentMouseDown( event ) {
//
//   event.preventDefault();
//   mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
//   mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
//
//   camera.updateMatrixWorld();
//   raycaster.setFromCamera( mouse, camera );
//
//   var intersects = raycaster.intersectObjects(scene.children);
//   if ( INTERSECTED != intersects[ 0 ].object) {
//     if ( INTERSECTED ) {
//       INTERSECTED.material.color.setHex( 0xFFFFFF );
//     }
//     INTERSECTED = intersects[ 0 ].object;
//     INTERSECTED.material.color.set( 0xFCD931 );
//   }
// }
//
// function onDocumentKeyDown( event ) {
//   const keyCode = event.which;
//   //console.log("This was the key that was pressed: "+keyCode);
//   //TODO: On Key Pressed Logic
//   if ( INTERSECTED ) {
//     var x = document.createElement("canvas");
//     var xc = x.getContext("2d");
//     x.width = x.height = 128;
//     xc.fillStyle = "white";
//     xc.fillRect(0, 0, 128, 128);
//     xc.shadowColor = "#000";
//     xc.shadowBlur = 7;
//     xc.fillStyle = "black";
//     xc.font = "64pt arial bold";
//     xc.textAlign = "center";
//     xc.fillText(String.fromCharCode(keyCode), 64, 96);
//
//     var cmap = new THREE.Texture(x);
//     INTERSECTED.material.map = cmap;
//     INTERSECTED.material.map.needsUpdate = true;
//
//     var clicked = INTERSECTED;
//     var newPosition = INTERSECTED.position.clone();
//     if (INTERSECTED.word.direction === 'y') {
//       newPosition[INTERSECTED.word.direction] -= 1;
//     } else {
//       newPosition[INTERSECTED.word.direction] += 1;
//     }
//     console.log("Old Position: ",INTERSECTED);
//     var nextBlock = scene.getObjectByName(newPosition.x+"-"+newPosition.y+"-"+newPosition.z);
//     if (nextBlock) {
//       INTERSECTED.material.color.setHex( 0xFFFFFF );
//       INTERSECTED = scene.getObjectByName(newPosition.x+"-"+newPosition.y+"-"+newPosition.z);
//       INTERSECTED.material.color.setHex( 0xFCD931 );
//     }
//
//     console.log("New intersects: ",INTERSECTED);
//
//   }
// }


function animate() {
  requestAnimationFrame( animate );
  controls.update();
  render();
}

function render() {
  renderer.render(scene, camera);
}
