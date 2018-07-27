var activeWord;
function onDocumentMouseDown(event) {
  event.preventDefault();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  camera.updateMatrixWorld();

  raycaster.setFromCamera(mouse, camera);

  var intersects = raycaster.intersectObjects(scene.children);

  if (intersects.length > 0 && INTERSECTED != intersects[0].object) {
    if (INTERSECTED) {
      INTERSECTED.material.color.setHex(0xffffff);
    }
    INTERSECTED = intersects[0].object;
  } else if (intersects.length > 0 && INTERSECTED === intersects[0].object) {
    directionIndex = (directionIndex + 1) % 3;
  }

  if (!window.hasOwnProperty("directionIndex")) {
    directionIndex = INTERSECTED.words.x ? 0 : INTERSECTED.words.y ? 1 : 2;
  }

  while (!INTERSECTED.words[["x", "y", "z"][directionIndex]]) {
    directionIndex = (directionIndex + 1) % 3;
  }

  activeWord = INTERSECTED.words[["x", "y", "z"][directionIndex]];
  scene.children.forEach(cube => {
    if (
      activeWord &&
      cube.words[["x", "y", "z"][directionIndex]] === activeWord
    ) {
      cube.material.color.set(0xaedaf5);
    } else {
      cube.material.color.set(0xffffff);
    }
  });

  var dir = ["x", "y", "z"][directionIndex];
  var keys = Object.keys(INTERSECTED.clues);
  if (!keys.includes(dir)) {
    onDocumentMouseDown(event);
  }
  document.getElementById("currentClue").innerHTML = INTERSECTED.clues[dir];
  if (intersects.length > 0) {
    inFocus = true;
    clickedOnCube = true;
    // controls.focus(
    //   INTERSECTED.start[dir].x,
    //   INTERSECTED.start[dir].y,
    //   INTERSECTED.start[dir].z
    // );
  } else {
    inFocus = false;
    clickedOnCube = false;
  }
  INTERSECTED.material.color.set(0xfcd931);
}

function onDocumentKeyDown(event) {
  const keyCode = event.which;
  if (keyCode == 9) {
    event.preventDefault();
    var randomlySelectWord = function() {
      var random = Math.floor(Math.random() * scene.children.length);
      var randomCube = scene.children[random];
      var randomDirIndex = Math.floor(Math.random() * 3);
      var dir = ["x", "y", "z"][randomDirIndex];
      var keys = Object.keys(randomCube.words);
      var counter;
      for (counter = 0; counter < 3; counter++) {
        dir = ["x", "y", "z"][randomDirIndex];
        directionIndex = randomDirIndex;
        if (!keys.includes(dir)) {
          randomDirIndex = (randomDirIndex + 1) % 3;
        } else {
          break;
        }
      }
      // if randomly chose the same word as before, run the function again
      if (activeWord === randomCube.words[dir]) {
        randomlySelectWord();
        return;
      }
      activeWord = randomCube.words[dir];
      scene.children.forEach(cube => {
        var cubePos = new THREE.Vector3();
        cubePos.copy(cube.position);
        cubePos.y = -1 * cubePos.y;
        var cubeStart = new THREE.Vector3();
        if (cube.start[dir]) {
          cubeStart.copy(cube.start[dir]);
        }
        if (
          activeWord &&
          cube.words[dir] === activeWord &&
          cubeStart.x == cubePos.x &&
          cubeStart.y == cubePos.y &&
          cubeStart.z == cubePos.z
        ) {
          INTERSECTED = cube;
          cube.material.color.set(0xfcd931);
        } else if (activeWord && cube.words[dir] === activeWord) {
          cube.material.color.set(0xaedaf5);
        } else {
          cube.material.color.set(0xffffff);
        }
      });
      document.getElementById("currentClue").innerHTML = INTERSECTED.clues[dir];
    };
    randomlySelectWord();
  } else if (keyCode == 220) {
    resetScene("puzzle.json");
    return;
  } else if (INTERSECTED) {
    if (
      (keyCode >= 65 && keyCode <= 120) ||
      (keyCode == 32 && keyCode == 0) ||
      keyCode === 8
    ) {
      var x = document.createElement("canvas");
      var xc = x.getContext("2d");
      x.width = x.height = 128;
      xc.fillStyle = "white";
      xc.fillRect(0, 0, 128, 128);
      xc.fillStyle = "black";
      xc.font = "64pt NYTFranklinMedium";
      xc.textAlign = "center";
      xc.fillText(keyCode === 8 ? "" : String.fromCharCode(keyCode), 64, 96);

      INTERSECTED.currentValue = String.fromCharCode(keyCode);

      if (gameOver(scene)) {
        document.removeEventListener("keydown", onDocumentKeyDown);
        clearInterval(timer);
        var audio = new Audio("end_music.mp3");
        audio.play();
        // pop up window
        document.getElementById("finish").style.display = "block";
        document.getElementById("finishTime").innerHTML =
          minutes + ":" + seconds;
        document.getElementById("overlay").style.opacity = "0.8";
        // hamburger opacity
        document.getElementById("bar1").style.opacity = "0.2";
        document.getElementById("bar2").style.opacity = "0.2";
        document.getElementById("bar3").style.opacity = "0.2";
      }

      var cmap = new THREE.Texture(x);
      INTERSECTED.material.map = cmap;
      INTERSECTED.material.map.needsUpdate = true;

      var clicked = INTERSECTED;
      var newPosition = INTERSECTED.position.clone();
      if (!window.hasOwnProperty("directionIndex")) {
        directionIndex = 0;
      }
      var dir = ["x", "y", "z"][directionIndex];
      var keys = Object.keys(INTERSECTED.words);
      if (!keys.includes(dir)) {
        directionIndex = (directionIndex + 1) % 3;
        onDocumentKeyDown(event);
      }
      if (dir === "y") {
        newPosition[dir] -= keyCode === 8 ? -1 : 1;
      } else {
        newPosition[dir] += keyCode === 8 ? -1 : 1;
      }

      var nextBlock = scene.getObjectByName(
        newPosition.x + "-" + newPosition.y + "-" + newPosition.z
      );
      if (nextBlock) {
        INTERSECTED.material.color.setHex(0xaedaf5);
        INTERSECTED = scene.getObjectByName(
          newPosition.x + "-" + newPosition.y + "-" + newPosition.z
        );
        INTERSECTED.material.color.setHex(0xfcd931);
      }
    }
  }
}

function onOkClick() {
  document.getElementById("overlay").style.opacity = "0.0";
  // hamburger opacity
  document.getElementById("bar1").style.opacity = "1.0";
  document.getElementById("bar2").style.opacity = "1.0";
  document.getElementById("bar3").style.opacity = "1.0";

  document.getElementById("start").style.display = "none";
  document.addEventListener("keydown", onDocumentKeyDown, false);
  timer = startTimer(document.getElementById("timer"));
}

function onOkClickFinish() {
  document.getElementById("overlay").style.opacity = "0.0";

  // hamburger opacity
  document.getElementById("bar1").style.opacity = "1.0";
  document.getElementById("bar2").style.opacity = "1.0";
  document.getElementById("bar3").style.opacity = "1.0";

  document.getElementById("finish").style.display = "none";
}

function resetScene(nextPuzzle) {
  window.name = nextPuzzle;
  location.reload();
}

function gameOver(scene) {
  return scene.children.reduce(
    (acc, w) => acc && w.currentValue === w.correctValue
  );
}

function autoComplete() {
  scene.children.forEach(w => {
    var x = document.createElement("canvas");
    var xc = x.getContext("2d");
    x.width = x.height = 128;
    xc.fillStyle = "white";
    xc.fillRect(0, 0, 128, 128);
    xc.fillStyle = "black";
    xc.font = "64pt NYTFranklinMedium";
    xc.textAlign = "center";
    xc.fillText(w.correctValue + "", 64, 96);
    w.currentValue = w.correctValue;
    var cmap = new THREE.Texture(x);
    w.material.map = cmap;
    w.material.map.needsUpdate = true;
  });
  document.removeEventListener("keydown", onDocumentKeyDown);
  clearInterval(timer);
  var audio = new Audio("end_music.mp3");
  audio.play();
  // pop up window
  document.getElementById("finish").style.display = "block";
  document.getElementById("finishTime").innerHTML = minutes + ":" + seconds;
  document.getElementById("overlay").style.opacity = "0.8";
  // hamburger opacity
  document.getElementById("bar1").style.opacity = "0.2";
  document.getElementById("bar2").style.opacity = "0.2";
  document.getElementById("bar3").style.opacity = "0.2";
}

function toggleSidenav() {
  document.body.classList.toggle("sidenav-active");
}
