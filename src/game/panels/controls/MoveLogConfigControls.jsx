import React from 'react';
import ConfigSwitch from './ConfigSwitch';
import MinutesPerPlayerStepper from './MinutesPerPlayerStepper';

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
  return (
    <form className="moveLog-config" onSubmit={(event) => event.preventDefault()}>
      <div className="moveLog-config-control">
        <MinutesPerPlayerStepper
          disabled={!canConfigureGame}
          onChange={onUpdateTurnMins}
          value={turnMins}
        />
      </div>
      <div className="moveLog-config-control">
        <button className="game-config-button moveLog-config-button" type="button" onClick={onStartGame}>
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
