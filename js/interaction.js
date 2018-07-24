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
    INTERSECTED.material.color.set( 0xFCD931 );
  } else {
    if (!window.hasOwnProperty("directionIndex")) {
      directionIndex = 0
    }
    directionIndex = (directionIndex + 1) % 3;
    console.log("direction index: ", directionIndex)
  }
}

function onDocumentKeyDown( event ) {
    if (event.altKey  &&  event.which == 70) {
        context.reset();
    }
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

    // click -> set global state variable to 0, click again and increment variable..pass variable into object name argument
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

    console.log("Old Position: ",INTERSECTED);
    var nextBlock = scene.getObjectByName(newPosition.x+"-"+newPosition.y+"-"+newPosition.z);
    if (nextBlock) {
      INTERSECTED.material.color.setHex( 0xFFFFFF );
      INTERSECTED = scene.getObjectByName(newPosition.x+"-"+newPosition.y+"-"+newPosition.z);
      INTERSECTED.material.color.setHex( 0xFCD931 );
    }

    console.log("New intersects: ",INTERSECTED);

  }
}
