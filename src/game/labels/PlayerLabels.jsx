import React, { useEffect, useState } from 'react';
import PlayerLabel from './PlayerLabel';

const PlayerLabels = ({ chatFirst, check, id, opponent, gameOver, turn }) => {
  const [ids, setIds] = useState({
    'b': chatFirst ? id : opponent,
    'w': chatFirst ? opponent: id
  });

  useEffect(() => {
    const votes = document.getElementById('votes').value;
    console.log('labels....');
    console.log(votes);
    const opp = `${opponent}${(votes > 1) ? ' & chat': ''}`;
    setIds({
      'b': chatFirst ? id : opp,
      'w': chatFirst ? opp: id
    });
  }, [chatFirst, id, opponent, gameOver]);
  
  return (
    <>
      <PlayerLabel check={check} turn={turn} gameOver={gameOver} ids={ids} side='b' />
      <PlayerLabel check={check} turn={turn} gameOver={gameOver} ids={ids} side='w' />
    </>
  );
};

export default PlayerLabels;
