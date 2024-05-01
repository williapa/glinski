import confetti from 'canvas-confetti';

// put confetti on the screen when someone wins
// take it off when the game restarts
// this is so cool
// winner: b, w, or anything else if we don't know / game isn't over
// todo: command to set emoji LOL 
const freddyKonfeddy = (winner) => {
  if (winner === 'b' || winner === 'w') {
    console.log('confetti!');
    const x = (winner === 'b') ? .1 : .5;
    confetti({
      particleCount: 150,
      ticks: 300,
      origin: {
        x,
        y: .15
      }
    }); 
  } else {
    console.log('reset');
    confetti.reset();
  } 
}

export default freddyKonfeddy;
