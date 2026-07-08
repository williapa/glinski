import React from 'react';
import ConfigSwitch from './ConfigSwitch';
import MinutesPerPlayerStepper from './MinutesPerPlayerStepper';
import VoteThresholdStepper from './VoteThresholdStepper';

function MoveLogConfigControls({
  aiEnabled = false,
  canConfigureGame,
  isGameActive,
  onStartGame,
  onStopGame,
  onSwitchPlayerColor,
  onToggleAi,
  onUpdateTurnMins,
  onUpdateVoteThreshold,
  playerColorIsBlack,
  showAiToggle = false,
  turnMins,
  voteThreshold,
}) {
  const widthClass = `moveLog-config-control${!showAiToggle ?' moveLog-config-control-full':''}`;
  return (
    <form className="moveLog-config" onSubmit={(event) => event.preventDefault()}>
      <div className="moveLog-config-control moveLog-config-control-full">
        <button
          className="game-config-button moveLog-config-button"
          type="button"
          onClick={isGameActive ? onStopGame : onStartGame}
        >
          {isGameActive ? '⏹️ Stop' : '▶️ Start'}
        </button>
      </div>
      <div className={widthClass}>
        <MinutesPerPlayerStepper
          disabled={!canConfigureGame}
          onChange={onUpdateTurnMins}
          value={turnMins}
        />
      </div>
      <div className={widthClass}>
        <ConfigSwitch
          ariaLabel="Player color"
          checked={playerColorIsBlack}
          disabled={!canConfigureGame}
          leftLabel="⬜"
          onChange={onSwitchPlayerColor}
          rightLabel="⬛"
        />
      </div>
      {showAiToggle && (
        <div className="moveLog-config-control">
          <VoteThresholdStepper
            disabled={!canConfigureGame}
            onChange={onUpdateVoteThreshold}
            value={voteThreshold}
          />
        </div>
      )}
      {showAiToggle && (
        <div className="moveLog-config-control">
          <ConfigSwitch
            ariaLabel="Streamer AI"
            checked={aiEnabled}
            disabled={!canConfigureGame}
            leftLabel="Off"
            onChange={onToggleAi}
            rightLabel="AI"
          />
        </div>
      ) /*: (
        <div className="moveLog-config-control moveLog-config-empty" aria-hidden="true" />
      )*/}
    </form>
  );
}

export default MoveLogConfigControls;
