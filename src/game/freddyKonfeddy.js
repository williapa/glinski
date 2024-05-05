import confetti from 'canvas-confetti';

// put confetti on the screen when someone wins
// take it off when the game restarts
// this is so cool
// winner: b, w, or anything else if we don't know / game isn't over
// todo: command to set emoji KEKW 
const freddyKonfeddy = (winner) => {
  if (winner === 'b' || winner === 'w') {
    const black = (winner == 'b');
    const x = document.querySelector(
      `.label.${black ? 'left': 'right'}`
    ).getBoundingClientRect()[black ? 'right' : 'left']/ window.innerWidth;
    confetti({
      particleCount: 150,
      ticks: 500,
      origin: {
        x,
        y: .15
      }
    }); 
  } else {
    confetti.reset();
  } 
}

export default freddyKonfeddy;
