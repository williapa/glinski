import React, { useEffect, useState } from 'react';
import PlayerLabel from './PlayerLabel';

const PlayerLabels = ({ chatFirst, check, id, opponent, gameOver, turn }) => {
  const [ids, setIds] = useState({
    'b': chatFirst ? id : opponent,
    'w': chatFirst ? opponent: id
  });

  useEffect(() => {
    setIds({
      'b': chatFirst ? id + ' (ai)' : opponent,
      'w': chatFirst ? opponent: id + ' (ai)'
    });
  }, [chatFirst, id, opponent ]);
  
  return (
    <>
      <PlayerLabel check={check} turn={turn} gameOver={gameOver} ids={ids} side='b' />
      <PlayerLabel check={check} turn={turn} gameOver={gameOver} ids={ids} side='w' />
    </>
  );
};

export default PlayerLabels;
