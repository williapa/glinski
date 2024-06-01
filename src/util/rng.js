const blackMoveRngReducer = 1; // as a decimal, this scales down the total RNG 

const rng = (base, range, isFirst) => Math.ceil((base + (range * Math.random())) * (isFirst || blackMoveRngReducer));

export default rng;
