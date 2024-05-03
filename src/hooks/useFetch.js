import { useState, useEffect, useCallback, useRef } from 'react';

const useFetch = (
  url,
  options = { 
    method: "GET",
    headers: { 
      "Content-Type": "application/json"
    }
  }
) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use useRef to store the latest values of url and options
  const urlRef = useRef(url);
  const optionsRef = useRef(options);

  useEffect(() => {
    urlRef.current = url;
    optionsRef.current = options;
  }, [url, options]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(urlRef.current, optionsRef.current);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      console.log("it's me and i'm just letting you know we're catching a bit of an error here.");
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, fetchData };
};

export default useFetch;
