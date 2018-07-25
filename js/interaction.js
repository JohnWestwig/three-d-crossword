function onDocumentMouseDown( event ) {

  event.preventDefault();
  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

  camera.updateMatrixWorld();
  raycaster.setFromCamera( mouse, camera );

  var intersects = raycaster.intersectObjects(scene.children);

  if ( INTERSECTED != intersects[ 0 ].object) {
    if ( INTERSECTED ) {
      INTERSECTED.material.color.setHex( 0xFFFFFF );

    }
    INTERSECTED = intersects[ 0 ].object;
    //get directionIndex
    //find which word letter belongs to based on directionIndex
    //color all other blocks blue in that word
    //But also delete any other blue blocks in other directions
      

    //display clue

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
      cube.material.color.set(0x006600);
    } else {
      cube.material.color.set(0xFFFFFF);
    }
  });

  INTERSECTED.material.color.set( 0xFCD931 );
}

function onDocumentKeyDown( event ) {
    if (event.altKey  &&  event.which == 70) {
        context.reset();
    }
  const keyCode = event.which;
  //console.log("This was the key that was pressed: "+keyCode);
  //TODO: On Key Pressed Logic
  if ( INTERSECTED ) {
      if ((keyCode >= 65 && keyCode <= 120) || (keyCode == 32 && keyCode == 0)) {
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
              newPosition[dir] -= 1;

          } else {
              newPosition[dir] += 1;
          }

          //console.log("Old Position: ", INTERSECTED);
          var nextBlock = scene.getObjectByName(newPosition.x + "-" + newPosition.y + "-" + newPosition.z);
          if (nextBlock) {
              INTERSECTED.material.color.setHex(0xAEDAF5);
              INTERSECTED = scene.getObjectByName(newPosition.x + "-" + newPosition.y + "-" + newPosition.z);
              INTERSECTED.material.color.setHex(0xFCD931);
          }

          //console.log("New intersects: ", INTERSECTED);

      }
  }
}

function toggleSidenav() {

  document.body.classList.toggle('sidenav-active');

}
