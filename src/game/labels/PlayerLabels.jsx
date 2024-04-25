import React, { useEffect, useState } from 'react';
import PlayerLabel from './PlayerLabel';

const PlayerLabels = ({ chatFirst, id, opponent, gameOver, turn }) => {
  const [ids, setIds] = useState({
    'b': chatFirst ? id : opponent,
    'w': chatFirst ? opponent: id
  });

  useEffect(() => {
    setIds({
      'b': chatFirst ? id : opponent,
      'w': chatFirst ? opponent: id
    });
  }, [chatFirst, id, opponent ]);
  
  return (
    <>
      <PlayerLabel turn={turn} gameOver={gameOver} ids={ids} side='b' />
      <PlayerLabel turn={turn} gameOver={gameOver} ids={ids} side='w' />
    </>
  );
};

export default PlayerLabels;
