import React, { useEffect, useState } from 'react';
import LogLabel from './labels/LogLabel';
import logChat from '../util/logChat';
import pieceMap from '../util/pieceMap';
import rowColToLetterCol from '../util/rowColToLetterCol';

const MoveLog = ({
  board,
  channel,
  chatFirst,
  enPassantPawnPosition,
  gameOver,
  initialVotes,
  moves,
  polling,
  useMuted,
  setFlash,
  startGame,
  startTime,
}) => {
  
  const [votes, setVotes] = useState(initialVotes);
  const [socket, setSocket] = useState(null);

  const addVote = (newVote) => {
    const { startPosition, endPosition } = newVote;
    // TODO: when a vote is added we hilight animation
    setFlash({ startPosition, endPosition });
    setVotes((prev) => ([
      newVote,  
      ...prev
    ]));
  };

  const hoverMove = (s, e) => {
    setFlash({ startPosition: s, endPosition: e });
  }

  // ugly, but done to clear votes from old game 
  const wrapStartGame = (args) => {
    setVotes([]);
    startGame(args)
  }
  // use moves length as a trigger for the channel hook, kill it if 
  useEffect(() => {
    // use moves length to determine if chat turn
    const chatTurn = !(moves.length % 2) === chatFirst && !gameOver;
    // open socket if chat turn & no socket 
    if (chatTurn && !socket && !polling) {
      console.log('start log chat');
      const webSocket = logChat(addVote, board, () => setSocket(null), channel, enPassantPawnPosition);
      setSocket(webSocket);
    } else if (socket && (!chatTurn || polling || gameOver)) {
      console.log('stop log chat');
      // close socket if not chat turn && still socket 
      socket.close();
      setSocket(null);
    }
    // cleanup - close socket
    return () => {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    };
  }, [board, channel, chatFirst, enPassantPawnPosition, gameOver, moves, polling, socket]);

  useEffect(() => {
    setVotes([...initialVotes]);
  }, [initialVotes]);
  
  const movesAndVotes = moves.concat(votes).sort((a, b) => b.time - a.time);
  
  return (
    <div className="moveLog">
      <LogLabel useMuted={useMuted} startGame={wrapStartGame} gameOver={gameOver} turnCount={moves.length} />
      <ul className="moveLog-list">
        { (gameOver === 'b' || gameOver === 'w') ? 
          (
            <li key="f" className="moveLog-item">
              {
                {'w': 'White', 'b': 'Black' }[gameOver] + ' wins!'
              }
            </li>
          ) : ''
        }
        { (gameOver === 'tie') ? 
          (
            <li key="t" className="moveLog-item">
              Tie game!
            </li>
          ) : ''
        }
        { polling? <li key="r" className="moveLog-item">Reconnected - there will be a delay until next move.</li> : ''}
        {movesAndVotes.map((move, index) => (
          <li key={index} className="moveLog-item" onMouseEnter={() => hoverMove(move.startPosition, move.endPosition)}>
            { move.username ? 
              (
                <span>
                  <span className="timeLabel user"> {move.username} </span>
                  { 'voted for '}
                </span>
              ) : <span className="timeLabel">{new Date(move.time).toLocaleTimeString()} </span>
            }
            {move.promoted ? <span>Promotion to </span> : ''}
            <span>{pieceMap[move.piece]} </span>
            from <span>{rowColToLetterCol(move.startPosition.row, move.startPosition.col)} </span>
            to <span>{rowColToLetterCol(move.endPosition.row, move.endPosition.col)}</span>
            {move.removedPiece ? <span> taking {pieceMap[move.removedPiece]}</span> : ''}.
          </li>
        ))}
        { startTime ? (
          <li className="moveLog-item">
            <span className="timeLabel">{new Date(startTime).toLocaleTimeString()} </span>
            <span> Game started. </span>
          </li>): ''
        }
      </ul>
    </div>
  );
};

export default MoveLog;
