<script src = "three.js-master/src/THREE.js"></script>
<script src = "three.js-master/src/cameras/PerspectiveCamera.js"></script>
var camera, controls, scene, renderer;

init();

animate();

function init() {
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.set(0, 0, 0);

  //controls
  controls = new THREE.OrbitControls(camera, renderer.domElement);

  //controls.addEventListener('change', render); //call only in static scenes

  controls.enableDamping = true;
  controls.dampingFactor = 0.25;

  controls.screenSpacePanning = false;

  controls.minDistance = 100;
  controls.maxDistance = 500;

  controls.maxPolarAngle = Math.PI / 2;
}
