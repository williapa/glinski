let playing = false;

const playVideo = (id) => {
  if (playing) {
    console.log('sorry, playing already.');
    return;
  }
  playing = true;
  const video = document.getElementById(id);
  // todo: i should trim these
  const lengthMap = {
    '22s': [21, 6.5],
    'dowork': [27, 3],
    'chickens': [0,24],
    'timetravel': [0,162],
    'dirtygirl': [0,215] 
  };
  video.currentTime = lengthMap[id][0];
  document.getElementById(id).style.display = 'block';
  const playPromise = video.play();
  if (playPromise !== undefined) {
    playPromise.then(() => {
      // Playback started successfully
      console.log("Video playback started successfully.");
      setTimeout(() => {
        video.pause();
        document.getElementById(id).style.display = 'none';
        playing = false;
      }, lengthMap[id][1] * 1000);
    }).catch(error => {
      // Playback was prevented.
      console.log("Playback failed: ", error);
      document.getElementById(id).style.display = 'none';
      playing = false;
      // Implement fallback behavior here if necessary
      // For example, you might want to show a play button to the user
    });
  } else {
    document.getElementById(id).style.display = 'none';
    playing = false;
  }
};

export default playVideo;
