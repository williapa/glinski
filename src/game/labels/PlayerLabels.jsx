import React from 'react';
import PlayerLabel from './PlayerLabel';

const PlayerLabels = ({ chatFirst, turn, gameOver, ids }) => (
  <>
    <PlayerLabel chatFirst={chatFirst} turn={turn} gameOver={gameOver} ids={ids} side='b' />
    <PlayerLabel chatFirst={chatFirst} turn={turn} gameOver={gameOver} ids={ids} side='w' />
  </>
);

export default PlayerLabels;
