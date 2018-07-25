var camera, controls, scene, renderer, raycaster;
var mouse = new THREE.Vector2(), INTERSECTED, ACTIVE_SQUARE;

function init() {
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
  controls.zoomSpeed = 6.0;
  controls.panSpeed = 0.8;

  controls.noZoom = false;
  controls.noPan = false;

  controls.staticMoving = false;
  controls.dynamicDampingFactor = 0.2;

    controls.minDistance = dimension.z;
    controls.maxDistance = dimension.z * 5;

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

function animate() {
  requestAnimationFrame( animate );
  controls.update();
  render();
}

function render() {
  renderer.render(scene, camera);
}
