import React from 'react';
import ConfigSwitch from './ConfigSwitch';

function MoveLogConfigControls({
  aiEnabled = false,
  canConfigureGame,
  isGameActive,
  onStartGame,
  onSwitchPlayerColor,
  onToggleAi,
  onUpdateTurnMins,
  playerColorIsBlack,
  showAiToggle = false,
  turnMins,
}) {
  const displayedTurnMins = String(turnMins).padStart(2, '0');

  return (
    <form className="moveLog-config" onSubmit={(event) => event.preventDefault()}>
      <div className="moveLog-config-control">
        <div className="moveLog-config-stepper" aria-label="Minutes per player">
          <button disabled={!canConfigureGame} type="button" onClick={() => onUpdateTurnMins(-1)}>
            -
          </button>
          <span className="moveLog-config-minutes">
            {displayedTurnMins}
            <small>min</small>
          </span>
          <button disabled={!canConfigureGame} type="button" onClick={() => onUpdateTurnMins(1)}>
            +
          </button>
        </div>
      </div>
      <div className="moveLog-config-control">
        <button className="moveLog-config-button" type="button" onClick={onStartGame}>
          {isGameActive ? '▶️' : '▶️'}
        </button>
      </div>
      <div className="moveLog-config-control">
        <ConfigSwitch
          ariaLabel="Player color"
          checked={playerColorIsBlack}
          disabled={!canConfigureGame}
          leftLabel="⬜"
          onChange={onSwitchPlayerColor}
          rightLabel="⬛"
        />
      </div>
      {showAiToggle ? (
        <div className="moveLog-config-control">
          <ConfigSwitch
            ariaLabel="Streamer AI"
            checked={aiEnabled}
            leftLabel="Off"
            onChange={onToggleAi}
            rightLabel="AI"
          />
        </div>
      ) : (
        <div className="moveLog-config-control moveLog-config-empty" aria-hidden="true" />
      )}
    </form>
  );
}

export default MoveLogConfigControls;
