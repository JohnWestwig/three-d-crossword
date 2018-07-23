var camera, controls, scene, renderer, raycaster;
var mouse = new THREE.Vector2(), INTERSECTED;


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
  camera.position.set(0, 0, 10);

  //controls
  controls = new THREE.TrackballControls( camera, renderer.domElement );
  //controls.target.set( 0, 0, 0 );
  //controls.addEventListener('change', render); //call only in static scenes
  controls.rotateSpeed = 1.0;
  controls.zoomSpeed = 1.2;
  controls.panSpeed = 0.8;

  controls.noZoom = false;
  controls.noPan = false;

  controls.staticMoving = true;
  controls.dynamicDampingFactor = 0.3;

  controls.keys = [ 65, 83, 68 ];

  //controls.addEventListener( 'change', render);

  /*controls.enableDamping = true;
  controls.dampingFactor = 0.25;

  controls.screenSpacePanning = false;

  controls.minDistance = -100;
  controls.maxDistance = 500;

  controls.maxPolarAngle = Math.PI / 2;*/

  window.addEventListener("resize", onWindowResize, false);
  document.addEventListener( 'mousedown', onDocumentMouseDown, false );  

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

function animate() {
  requestAnimationFrame( animate );
  controls.update();
  render();
}

function render() {
  console.log(scene.children);
  camera.updateMatrixWorld();
  raycaster.setFromCamera( mouse, camera );
  var intersects = raycaster.intersectObjects(scene.children);
  if ( intersects.length > 0 ) {
    if ( INTERSECTED != intersects[ 0 ].object ) {
      if ( INTERSECTED ) {
        INTERSECTED.material.color.setHex( 0xFFFFFF );
      }
      INTERSECTED = intersects[ 0 ].object;
      INTERSECTED.material.color.setHex( 0xff0000 );
    }
  } else {
    if ( INTERSECTED ) {
      INTERSECTED.material.color.setHex( 0xFFFFFF );
    }
    INTERSECTED = null;
  }
  renderer.render(scene, camera);

}

init();

animate();
