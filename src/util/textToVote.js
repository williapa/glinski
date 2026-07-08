const textToVote = (text, onChange) => {
  const voteThreshold = parseInt((text.split(' ')[1] || '').trim(), 10);
  if(!isNaN(voteThreshold) && voteThreshold < 10 && voteThreshold >= 0) {
    if (onChange) {
      onChange(voteThreshold);
    }
    return voteThreshold;
  }

  return null;
}

export default textToVote;
