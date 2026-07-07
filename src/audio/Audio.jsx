import React from 'react';

const Audio = ({ src, play }) => {
  // Ref to the audio element
  const audioRef = React.useRef(null);

  // Effect to play/pause audio based on prop changes
  React.useEffect( () => {
    const fn = async () => {
      const audio = audioRef.current;
      if (play && audioRef.current) {
        try {
          // todo: this should be a form setting
          audio.volume = .3;
          await audio.play();
        } catch (e) {
          console.warn('you played audio and it did not work: ', e);
        }
      } else {
        audio.pause();
        audio.currentTime = 0;
      }
    }
    fn();
  }, [play]);

  return <audio ref={audioRef} src={src} preload="auto" />;
};

export default Audio;