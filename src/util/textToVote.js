const textToVote = (text) => {
  const voteThreshold = parseInt(text.split(' ')[1].trim());
  if(!isNaN(voteThreshold) && voteThreshold < 10 && voteThreshold >= 0) {
    // hack, no i do not care, react can't tell me how to use forms in the dom, go to hell.
    document.querySelector(`form input[name='votes']`).value = voteThreshold;
  }
}

export default textToVote;
