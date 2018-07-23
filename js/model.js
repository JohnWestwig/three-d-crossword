// const puzzle = {
//   size: {
//     x: 5,
//     y: 5,
//     z: 5,
//   },
//   words: [
//     {
//       startingPosition: {
//         x: 0,
//         y: 0,
//         z: 0
//       },
//       direction: 'x',
//       length: 5,
//       answer: 'GIZMO'
//     },
//     {
//       startingPosition: {
//         x: 0,
//         y: 0,
//         z: 0
//       },
//       direction: 'y',
//       length: 5,
//       answer: 'GIZMO'
//     },
//     {
//       startingPosition: {
//         x: 0,
//         y: 0,
//         z: 0
//       },
//       direction: 'z',
//       length: 5,
//       answer: 'GIZMO'
//     },
//   ]
// };

function loadJSON(callback) {
  var xobj = new XMLHttpRequest();
  //xobj.overrideMimeType("application/json");
  xobj.open(
    "GET",
    "https://raw.githubusercontent.com/JohnWestwig/three-d-crossword/master/puzzle.json",
    true
  ); // Replace 'my_data' with the path to your file
  xobj.onreadystatechange = function() {
    if (xobj.readyState == 4 && xobj.status == "200") {
      // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
      callback(xobj.responseText);
    }
  };
  xobj.send(null);
}

//var puzzle;
loadJSON(function(response) {
  // Parse JSON string into object
  var actual_JSON = JSON.parse(response);
  var puzzle = actual_JSON;

  const boxSize = 1;

  function drawText(letter) {
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
    xc.fillText(letter, 64, 96);

    var xm = new THREE.MeshBasicMaterial({
      map: new THREE.Texture(x),
      color: 0xffffff
    });
    xm.map.needsUpdate = true;
    return xm;
  }

  function drawCrossword(scene) {
    const puzzleGroup = new THREE.Group();

    var j;
    for (j = 0; j < puzzle.puzzle_data.length; j++) {
      var w = puzzle.puzzle_data[j];
      for (i = 0; i < w.entry.length; i++) {
        const wordGroup = new THREE.Group();
        puzzleGroup.add(wordGroup);

        var textMesh = drawText(w.entry[i]);

        const geometry = new THREE.BoxGeometry(boxSize, boxSize, boxSize);
        const cube = new THREE.Mesh(geometry, textMesh);

        const geo = new THREE.EdgesGeometry(cube.geometry);
        const mat = new THREE.LineBasicMaterial({
          color: 0x000000,
          linewidth: 4
        });
        const wireframe = new THREE.LineSegments(geo, mat);
        wireframe.renderOrder = 1; // make sure wireframes are rendered 2nd
        cube.add(wireframe);

        const cubePosition = w.start;
        cubePosition[w.direction] = boxSize * i;
        cube.position.set(cubePosition.x, -cubePosition.y, cubePosition.z);
        wordGroup.add(cube);
      }
    }

    scene.add(puzzleGroup);
    return puzzleGroup;
  }

  const puzzleGroup = drawCrossword(scene);
});

//console.log(puzzle);
