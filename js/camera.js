var camera, controls, scene, renderer, raycaster;
var inFocus = false;
var clickedOnCube = false;
var mouse = new THREE.Vector2(),
  INTERSECTED,
  ACTIVE_SQUARE;
var timer, minutes, seconds;
function init() {
  renderer = new THREE.WebGLRenderer({ antialias: true });
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

  camera.position.set(xCenter, -yCenter, dimension.z + 5);

  //controls
  controls = new THREE.TrackballControls(camera, xCenter, yCenter, zCenter);

  controls.rotateSpeed = 5.0;
  controls.zoomSpeed = 6.0;
  controls.panSpeed = 0.8;

  controls.noZoom = false;
  controls.noPan = false;

  controls.staticMoving = false;
  controls.dynamicDampingFactor = 0.2;

  controls.minDistance = zCenter;
  controls.maxDistance = dimension.z * 5;

  controls.keys = [65, 83, 68];

  window.addEventListener("resize", onWindowResize, false);
  document.addEventListener("mousedown", onDocumentMouseDown, false);
}

//To start: timer = startTimer(duration_in_seconds, html_element);
//To stop: clearInterval(timer);
//If minutes and seconds ~= 0, need to activate similar gameOver logic (remove onKeydown event listener)
function startTimer(display) {
  var time = -1;
  function timer() {
    time += 1
    minutes = (time / 60) | 0;
    seconds = (time % 60) | 0;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    display.innerHTML = minutes+":"+seconds;
    display.style.color = "white";
    display.style.textShadow = "1px 1px 2px black";
    display.style.fontFamily = "NYTFranklinMedium";

 }
 timer();
 return setInterval(timer, 1000);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
  controls.handleResize();
  render();
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  render();
}

function render() {
  renderer.render(scene, camera);
}
