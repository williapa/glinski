export default function endGame(winner) {
  const gameStateJSON = localStorage.getItem('current-game');
  const gameState = JSON.parse(gameStateJSON);
  gameState.gameOver = winner;
  localStorage.setItem('current-game', JSON.stringify(gameState));
}
