const typing = (inputString, setterFunction, sendFunction) => {
  let index = 0;  // This will keep track of the current length of the substring
  // Create an interval that runs every 400ms
  const intervalId = setInterval(() => {
    // Increment the index to reveal the next character
    // Check if the index is within the bounds of the string length
    if (index <= inputString.length) {
      // Call the setter function with the current substring
      setterFunction(inputString.substring(0, index));
    } else if (index > inputString.length + 1) {
      sendFunction(true);
      setterFunction('');
      clearInterval(intervalId); // Clear the interval
    }
    index++;
  }, 350);
  return intervalId;
};

export default typing;
