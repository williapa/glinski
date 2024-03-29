import React, { useEffect, useState } from 'react';
import PlayerLabel from './PlayerLabel';

const PlayerLabels = ({ chatFirst, id, gameOver, turn }) => {
  const [ids, setIds] = useState({
    'b': chatFirst ? id : 'chat',
    'w': chatFirst ? 'chat': id
  });

  useEffect(() => {
    setIds({
      'b': chatFirst ? id : 'chat',
      'w': chatFirst ? 'chat': id
    });
  }, [chatFirst, id ]);
  
  return (
    <>
      <PlayerLabel turn={turn} gameOver={gameOver} ids={ids} side='b' />
      <PlayerLabel turn={turn} gameOver={gameOver} ids={ids} side='w' />
    </>
  );
};

export default PlayerLabels;
