import { useState, useEffect } from 'react';

function useFetch(apiUrl) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    async function getData(url) {
      try {
        setHasError(false);
        setIsLoading(true);
        const response = await fetch(url);
        const json = await response.json();
        setData(json);
        return json;
      } catch (error) {
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    }

    getData(apiUrl);
  }, [apiUrl]);

  return {
    data,
    isLoading,
    hasError,
  };
}

export { useFetch };