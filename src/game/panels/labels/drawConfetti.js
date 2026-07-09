import confetti from 'canvas-confetti';

// put confetti on the screen when someone wins
// take it off when the game restarts
// this is so cool
// winner: b, w, or anything else if we don't know / game isn't over
const drawConfetti = (winner) => {
  if (winner === 'b' || winner === 'w') {
    const black = (winner === 'b');
    const labelRectangle = document.querySelector(
      `.label.${black ? 'left': 'right'}`
    ).getBoundingClientRect();
    const origin = {
      y: labelRectangle[black ? 'bottom' : 'top']/ window.innerHeight,
      x: (labelRectangle.left + ((labelRectangle.right - labelRectangle.left) / 2)) / window.innerWidth
    };

    confetti({
      origin,
      gravity: .5,
      ticks: 600,
      useWorker: true
    }); 
  } else {
    confetti.reset();
  } 
}

export default drawConfetti;
