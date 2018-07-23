const puzzle = {
  size: {
    x: 5,
    y: 5,
    z: 5,
  },
  words: [
    {
      startingPosition: {
        x: 0,
        y: 0,
        z: 0
      },
      direction: 'x',
      length: 5,
      answer: 'GIZMO'
    },
    {
      startingPosition: {
        x: 0,
        y: 0,
        z: 0
      },
      direction: 'y',
      length: 5,
      answer: 'GIZMO'
    },
    {
      startingPosition: {
        x: 0,
        y: 0,
        z: 0
      },
      direction: 'z',
      length: 5,
      answer: 'GIZMO'
    },
  ]
};

const boxSize = 1;

function drawText(cube, font) {
  const geometry = new THREE.TextGeometry("T", {
      font: font,
      size: .5,
      height: .7,
      curveSegments: 2
  });
  const material = new THREE.MeshBasicMaterial( { color: 0xFF0000 } );
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(cube.position.x, cube.position.y, cube.position.z);
  mesh.position.add(new THREE.Vector3(0, 0, 0));
  console.log(mesh.position);

  return mesh;
}

function drawCrossword(scene, font) {
  const puzzleGroup = new THREE.Group();

  puzzle.words.forEach(w => {
    for (i = 0; i < w.length; i++) {
      const wordGroup = new THREE.Group();
      puzzleGroup.add(wordGroup);

      const geometry = new THREE.BoxGeometry( boxSize, boxSize, boxSize );
      const material = new THREE.MeshBasicMaterial( { color: 0xFFFFFF } );
      const cube = new THREE.Mesh( geometry, material );

      const geo = new THREE.EdgesGeometry( cube.geometry );
      const mat = new THREE.LineBasicMaterial( { color: 0x000000, linewidth: 4 } );
      const wireframe = new THREE.LineSegments( geo, mat );
      wireframe.renderOrder = 1; // make sure wireframes are rendered 2nd
      cube.add( wireframe );

      const cubePosition = w.startingPosition;
      cubePosition[w.direction] = boxSize * i;
      cube.position.set(cubePosition.x, -cubePosition.y, cubePosition.z)

      var textMesh = drawText(cube, font);

      wordGroup.add(cube);
      wordGroup.add(textMesh);
    }
  });

  scene.add(puzzleGroup);
  return puzzleGroup;
}
