
function gameOver(scene, word_completed_list) {
  var completed = word_completed_list.reduce((acc, i) => acc && i);
  if (completed) {
      return true;
  }
}

function updateGameGrid(scene) {
  
}