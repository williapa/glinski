/* the api function is super complicated */
const api = () => {
  const stage = process.env.REACT_APP_API_STAGE;
  // at some point may leverage the api gateway stage path to have 2 cors configs, 1 for localhost 
  // and prod for the real deployed place. but right now, i haven't deployed front end/ bought domain
  return (stage === 'local') ? 'http://localhost:3000/': 'https://1vohebia0l.execute-api.us-west-2.amazonaws.com/Prod/';
}

export default api;
