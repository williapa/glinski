const dealWithSafari = () => {
    /* safari doesn't know how to render my pawns
  well, technically this is a problem only because I drew the hex grid the wrong direction to begin with
  i thought it looked better
  but eventually I realized I should just lay out the board like everyone else
  and then came this pawn problem, where safari chooses not to rotate my fucking pawns 
  so I had to add a class for pawns
  but that wasn't enough... because there's no media query that reliably plucks safari
  let's not even worry about the fact that I have no clue what safari versions this affects
  oh god i haven't even updated safari so it really could be some old problem
  fuck but yeah anyways that's why this is here. 
  And if i ever swap out the unicode for my own images, which would be a good idea,
  i might not need this. don't quote me on that though. 
  */
  const userAgent = window.navigator.userAgent;
  const safari = /Safari/.test(userAgent) && !/Chrome|Chromium/.test(userAgent);
  if (safari) {
    document.body.classList.add('safari');
  }
}

export default dealWithSafari;
