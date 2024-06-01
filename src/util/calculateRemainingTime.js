const calculateRemainingTime = (moves, gameConfig, player ) => {
  const { startTime, turnMins } = gameConfig;
  // Convert allowed time in minutes to milliseconds
  const allowedTime = turnMins * 60 * 1000;
  let totalTimeTaken = 0; // Total time taken by the player in milliseconds
  // base case - no moves yet 
  if (moves.length < 1 && player === 'w') {
    const currentTime = new Date().getTime();
    const usedMsThisTurn = (currentTime - startTime);
    const remainingMs = allowedTime - usedMsThisTurn;
    const remainingSeconds = remainingMs / 1000;
    return remainingSeconds;
  }
  // Calculate total time taken by the player
  moves.forEach((move, index) => {
    if (move.piece.charAt(0) === player) {
      if (index === (moves.length - 1)) {
        // For the first move, calculate the time from the game start
        totalTimeTaken = totalTimeTaken + move.time - startTime; 
      } else {
        // For subsequent moves, calculate the time taken since the last move
        totalTimeTaken = totalTimeTaken + move.time - moves[index + 1].time;
      }
    }
  });
  // if it's the player's current turn then subtract current time 
  if ((moves.length > 0 && player !== moves[0].piece.charAt(0)) || (moves.length < 1 && player === 'w')) {
    totalTimeTaken = totalTimeTaken + new Date().getTime() - ((moves.length > 0) ? moves[0].time : startTime);
  }
  // Calculate the remaining time in seconds and return
  const remainingPlayerTime = (allowedTime - totalTimeTaken) / 1000;
  // if the time left is more than 10 minutes something has gone horribly wrong.
  // if this breaks its because i made it run for more than 10  but 15 is probably the upper limit
  if (remainingPlayerTime > 6000) throw new Error('something has gone horribly wrong with the remaining time calculated.');
  // otherwise return
  return remainingPlayerTime;
};

export default calculateRemainingTime;
