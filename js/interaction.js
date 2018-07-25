function onDocumentMouseDown( event ) {

  event.preventDefault();
  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

  camera.updateMatrixWorld();
  raycaster.setFromCamera( mouse, camera );

  var intersects = raycaster.intersectObjects(scene.children);

  if ( intersects.length > 0 && INTERSECTED != intersects[ 0 ].object) {

    if ( INTERSECTED ) {

      INTERSECTED.material.color.setHex( 0xFFFFFF );

    }
    INTERSECTED = intersects[ 0 ].object;

  } else {
    directionIndex = (directionIndex + 1) % 3;
    // console.log("direction index: ", directionIndex)
  }

  if (!window.hasOwnProperty("directionIndex")) {
    directionIndex = INTERSECTED.words.x ? 0 : (INTERSECTED.words.y ? 1 : 2);
  }

  while (!INTERSECTED.words[["x", "y", "z"][directionIndex]]) {
    directionIndex = (directionIndex + 1) % 3;
  }

  const activeWord = INTERSECTED.words[["x", "y", "z"][directionIndex]]
  scene.children.forEach(cube => {
    if (activeWord && cube.words[["x", "y", "z"][directionIndex]] === activeWord) {
      cube.material.color.set(0xAEDAF5);
    } else {
      cube.material.color.set(0xFFFFFF);
    }
  });

  var dir = ["x", "y", "z"][directionIndex];
  var keys = Object.keys(INTERSECTED.clues);
  if (!keys.includes(dir)) {
      onDocumentMouseDown(event);
  }
  document.getElementById("currentClue").innerHTML = INTERSECTED.clues[dir];
  console.log("HI");
  INTERSECTED.material.color.set( 0xFCD931 );
}

function onDocumentKeyDown( event ) {
    if (event.altKey  &&  event.which == 70) {
        context.reset();
    }
  const keyCode = event.which;
  //console.log("This was the key that was pressed: "+keyCode);
  //TODO: On Key Pressed Logic
  if (keyCode == 220) {
    console.log("oh my");
    resetScene("puzzle.json");
    return;
  }
  if ( INTERSECTED ) {
      if ((keyCode >= 65 && keyCode <= 120) || (keyCode == 32 && keyCode == 0) || keyCode === 8) {
          var x = document.createElement("canvas");
          var xc = x.getContext("2d");
          x.width = x.height = 128;
          xc.fillStyle = "white";
          xc.fillRect(0, 0, 128, 128);
          xc.fillStyle = "black";
          xc.font = "64pt arial bold";
          xc.textAlign = "center";
          xc.fillText(keyCode === 8 ? "" : String.fromCharCode(keyCode), 64, 96);

          INTERSECTED.currentValue = String.fromCharCode(keyCode);

          if (gameOver(scene)) {
            console.log("Game Over!");
            var audio = new Audio('end_music.mp3');
            audio.play();
            document.removeEventListener("keydown", onDocumentKeyDown);
          }

          var cmap = new THREE.Texture(x);
          INTERSECTED.material.map = cmap;
          INTERSECTED.material.map.needsUpdate = true;

          var clicked = INTERSECTED;
          var newPosition = INTERSECTED.position.clone();
          if (!window.hasOwnProperty("directionIndex")) {
              directionIndex = 0
          }
          var dir = ["x", "y", "z"][directionIndex];
          var keys = Object.keys(INTERSECTED.words);
          if (!keys.includes(dir)) {
              directionIndex = (directionIndex + 1) % 3;
              onDocumentKeyDown(event);
          }
          if (dir === 'y') {
              newPosition[dir] -= keyCode === 8 ? -1 : 1 ;
          } else {
              newPosition[dir] += keyCode === 8 ? -1 : 1 ;
          }

          var nextBlock = scene.getObjectByName(newPosition.x + "-" + newPosition.y + "-" + newPosition.z);
          if (nextBlock) {
              INTERSECTED.material.color.setHex(0xAEDAF5);
              INTERSECTED = scene.getObjectByName(newPosition.x + "-" + newPosition.y + "-" + newPosition.z);
              INTERSECTED.material.color.setHex(0xFCD931);
          }
      }
  }
}

function resetScene(nextPuzzle) {
  puzzleName = nextPuzzle;
  cancelAnimationFrame(this.id);// Stop the animation
  document.body.removeChild(renderer.domElement);
  scene = null;
  projector = null;
  camera = null;
  controls = null;
  loadPuzzle();

}

function gameOver(scene) {
  return scene.children.reduce((acc, w) => acc && w.currentValue === w.correctValue);
}

function toggleSidenav() {

  document.body.classList.toggle('sidenav-active');

}
