import React from 'react';
import Audio from './Audio';
import samples from "./sounds";

const AudioPlayer = ({ muted, sound }) => {
  const sounds = Object.entries(samples);

  return (
    <div className="audioPlayer">
      {sounds.map(([key, value]) => (
        <Audio 
          key={key}
          src={value}
          play={!muted && sound===key}
        />
      ))}
    </div>
  )
};

export default AudioPlayer;
