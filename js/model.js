var context = this;
var dimension;
var puzzleName = "puzzle.json";

function loadJSON(callback) {
  var xobj = new XMLHttpRequest();
  //xobj.overrideMimeType("application/json");
  xobj.open(
    "GET",
    "https://raw.githubusercontent.com/JohnWestwig/three-d-crossword/master/"+puzzleName,
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
var loadPuzzle = () => {
  loadJSON(function(response) {
    // Parse JSON string into object
    var actual_JSON = JSON.parse(response);
    var puzzle = actual_JSON;

    dimension = new THREE.Vector3(puzzle.puzzle_meta.width,
        puzzle.puzzle_meta.height,
        puzzle.puzzle_meta.depth);

    init();

    animate();

    document.body.appendChild( renderer.domElement );

    console.log('loadJSON');

    const boxSize = 1;

    function drawText(letter) {
        var x = document.createElement("canvas");
        var xc = x.getContext("2d");
        x.width = x.height = 128;
        xc.fillStyle = "white";
        xc.fillRect(0, 0, 128, 128);
        xc.fillStyle = "black";
        xc.font = "64pt arial bold";
        xc.textAlign = "center";
        //xc.fillText(letter, 64, 96);

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
        //var clue_number = 0;
        for (j = 0; j < puzzle.puzzle_data.length; j++) {
            var w = puzzle.puzzle_data[j];

            // add clues to side panel
            var x = document.getElementById("clues_x");
            var y = document.getElementById("clues_y");
            var z = document.getElementById("clues_z");

            // get clue Id
            var clue = document.createElement("a");
            clue.innerHTML = w.Id.toString().bold();
            clue.style.padding = "0px 30px 0px 0px"; // T R B L

            // add clue to Id
            var divtest = document.createElement("div");
            divtest.innerHTML = w.clue;
            divtest.style.display = "inline";
            divtest.style.padding = "0px 0px 0px 15px"; 

            clue.appendChild(divtest);
            clue.style.padding = "0px 0px 0px 10px";
            clue.style.color = "white";
            clue.style.textAlign = "left";

            // insert break after each clue
            var br = document.createElement("br");
            clue.appendChild(br);

            var br2 = document.createElement("br");

            // add clue to xyz window
            if (w.direction == "x") {
              x.appendChild(clue);
              x.appendChild(br2);
            } else if (w.direction == "y") {
              y.appendChild(clue);
              y.appendChild(br2);
            } else {
              z.appendChild(clue);
              z.appendChild(br2);
            }

            var originalPosition = w.start[w.direction];
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
                cubePosition[w.direction] = boxSize * originalPosition;
                cube.position.set(cubePosition.x, -cubePosition.y, cubePosition.z);
                originalPosition = originalPosition + 1;

                cube.name = `${cubePosition.x}-${-cubePosition.y}-${cubePosition.z}`;
                cube.words = {};
                cube.words[w.direction] = w.entry;
                cube.clues = {};
                cube.clues[w.direction] = w.clue;
                cube.correctValue = w.entry[i];


                if (!scene.getObjectByName(cube.name)) {
                    scene.add(cube);
                } else {
                  scene.getObjectByName(cube.name).words[w.direction] = w.entry;
                    scene.getObjectByName(cube.name).clues[w.direction] = w.clue;
                }
            }
        }
        return puzzleGroup;
    }

    const puzzleGroup = drawCrossword(scene);
  })
};
loadPuzzle();
