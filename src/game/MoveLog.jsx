import React, { useEffect, useRef, useState } from 'react';
import LogLabel from './labels/LogLabel';
import letChatStartGame from '../util/letChatStartGame';
import logChat from '../util/logChat';
import logPieceMap from '../util/logPieceMap';
import rowColToLetterCol from '../util/rowColToLetterCol';

const MoveLog = ({
  ai,
  board,
  channel,
  chatFirst,
  enPassantPawnPosition,
  gameOver,
  hilighter,
  initialVotes,
  moves,
  polling,
  useMuted,
  setColorChoice,
  setFlash,
  startGame,
  startTime,
}) => {
  
  const [votes, setVotes] = useState(initialVotes);
  const [socket, setSocket] = useState(null);
  const [startGameSocket, setStartGameSocket] = useState(null);
  const [startGameInterval, setStartGameInterval] = useState(null);
  const topRef = useRef(null);

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

  const scrollToTop = () => {
    if (topRef.current) {
      topRef.current.scrollTop = 0; // Scrolls to the top of the chat box
    }
  };

  // ugly, but done to clear votes from old game 
  const wrapStartGame = (args) => {
    setVotes([]);
    startGame(args)
  }

  const wrapSocketStartGame = (username) => {
    setVotes([]);
    startGame({ preventDefault: () => {} }, username);
  }

  // use moves length as a trigger for the channel hook, kill it if 
  useEffect(() => {
    // use moves length to determine if chat turn
    const chatTurn = !(moves.length % 2) === chatFirst && !gameOver;
    // open socket if chat turn & no socket 
    if (chatTurn && !socket && !polling) {
      console.log('start log chat');
      const webSocket = logChat(addVote, board, () => setSocket(null), channel, enPassantPawnPosition, hilighter);
      setSocket(webSocket);
    } else if (socket && (!chatTurn || polling || gameOver)) {
      console.log('stop log chat');
      // close socket if not chat turn && still socket 
      socket.close();
      setSocket(null);
    }
    if (gameOver && !startGameSocket) {
      // setstartgamesocket and letchatstartgame
      const [i,s] = letChatStartGame(wrapSocketStartGame, () => setStartGameSocket(null), channel, setColorChoice);
      setStartGameSocket(s);
      setStartGameInterval(i);
    } else if (!gameOver && startGameSocket) {
      // kill it 
      startGameSocket.close();
      setStartGameSocket(null);
      // and the interval
      clearInterval(startGameInterval);
      setStartGameInterval(null);
    } 
    // cleanup - close socket
    return () => {
      if (socket) {
        socket.close();
        setSocket(null);
      }
      if (startGameSocket) {
        startGameSocket.close();
        setStartGameSocket(null);
        clearInterval(startGameInterval);
        setStartGameInterval(null);
      }
    };
  }, [board, channel, chatFirst, enPassantPawnPosition, gameOver, moves, polling, socket]);

  useEffect(() => {
    setVotes([...initialVotes]);
  }, [initialVotes]);

  useEffect(() => scrollToTop(), [moves]);
  
  const movesAndVotes = moves.concat(votes).sort((a, b) => b.time - a.time);
  
  return (
    <div className="moveLog">
      <LogLabel useMuted={useMuted} startGame={wrapStartGame} gameOver={gameOver} turnCount={moves.length} />
      <ul ref={topRef} className="moveLog-list">
      { (gameOver === 'b' || gameOver === 'w') ? 
          (<>
            <li key="bdg" className="moveLog-item">
              <b>!play</b> - start a new game.
            </li>
            <li key="bdh" className="moveLog-item">
              <b>!minutes 10</b> - set game length.
            </li>
            <li key="bdi" className="moveLog-item">
              <b>!votes 2</b> - set number of chat votes required to apply next move.
            </li>
            <li key="bdj" className="moveLog-item">
              <b>!random</b>, <b>!stay</b>, or <b>!switch</b> - choose a side.
            </li>
          </>
          ) : ''
        }
        { (gameOver === 'b' || gameOver === 'w') ? 
          (
            <li key="f" className="moveLog-item">
              <i>
              {
                {'w': 'White', 'b': 'Black' }[gameOver] + ' wins!'
              }
              </i>
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
        <button style={{ display: 'none' }} onClick={ai}> refresh </button>
        { polling? <li key="r" className="moveLog-item">Reconnecting to chat...</li> : ''}
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
            <span>{logPieceMap[move.piece]} </span>
            <span>{rowColToLetterCol(move.startPosition.row, move.startPosition.col)} </span>
            <span>{rowColToLetterCol(move.endPosition.row, move.endPosition.col)}</span>
            {move.removedPiece ? <span> taking {logPieceMap[move.removedPiece]}</span> : ''}.
            { move.check ? <span> {move.piece.charAt(0) === 'b' ? 'white' : 'black' } king is in check. </span> : '' }
          </li>
        ))}
        { startTime ? (
          <>
            <li className="moveLog-item">
              <span className="timeLabel">{new Date(startTime).toLocaleTimeString()} </span>
              <span> Game started. </span>
            </li>
            <li className="moveLog-item">
                <span> <b>B4 B5</b> - Vote for move. </span>
            </li>
            
            <li className="moveLog-item">
                <span> <b>B4</b> - See moves for piece. </span>
            </li>
            <li className="moveLog-item">
               <b>B1 B0 K</b> - Pawns promote to queens, or choose a piece by letter.
            </li>
          </>): ''
        }
      </ul>
    </div>
  );
};

export default MoveLog;
