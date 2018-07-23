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

function drawCrossword(scene) {
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

      wordGroup.add(cube);

      const cubePosition = w.startingPosition;
      cubePosition[w.direction] = boxSize * i;
      cube.position.set(cubePosition.x, -cubePosition.y, cubePosition.z)
    }
  });
  scene.add(puzzleGroup);
  return puzzleGroup;
}
