import React, { useState, useEffect } from 'react';

const DataTable = ({ port, path }) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const skips = ["board", "moves"];

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`http://localhost:${port}/${path}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [port, path]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error fetching data: {error}</p>;

  return (
    <table style={{ marginLeft: "auto", marginRight: "auto" }}>
      <thead>
        <tr>
          {
            data.length > 0 && 
            Object.keys(data[0])
              .filter((value) => !skips.includes(value))
              .map((key) => (
                <th key={key}>
                  {key}
                </th>
              ))
          }
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row.id}>
            {
              Object.keys(row)
                .filter((value) => !skips.includes(value))
                .map((val, idx) => (
                  <td key={val}>
                    <a href={`/${row[val]}`}>
                      {row[val]}
                    </a>
                  </td>
                ))
            }
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DataTable;