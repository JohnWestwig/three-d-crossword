var camera, controls, scene, renderer, stats;

function init() {
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  stats = new Stats();
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  //camera.position.z = 500;
  camera.position.set(0, 0, 100);

  //controls
  controls = new THREE.TrackballControls( camera );
  //controls.addEventListener('change', render); //call only in static scenes
  controls.rotateSpeed = 1.0;
  controls.zoomSpeed = 1.2;
  controls.panSpeed = 0.8;

  controls.noZoom = false;
  controls.noPan = false;

  controls.staticMoving = true;
  controls.dynamicDampingFactor = 0.3;

  controls.keys = [ 65, 83, 68 ];

  controls.addEventListener( 'change', render);

  /*controls.enableDamping = true;
  controls.dampingFactor = 0.25;

  controls.screenSpacePanning = false;

  controls.minDistance = -100;
  controls.maxDistance = 500;

  controls.maxPolarAngle = Math.PI / 2;*/

  window.addEventListener( "resize", onWindowResize, false );
  render();
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
  renderer.render( scene, camera );
  stats.update();
}

init();

animate();
