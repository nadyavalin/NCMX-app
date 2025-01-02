import { useEffect, useState } from "react";
import { Item } from "@components/types";

export const useFetchItems = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://178.66.48.32:8000/api/");
      const result = await response.json();
      setItems(result.data);
      } catch (error) {
        console.error("Error fetching data: ", error);
        setError("Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { items, loading, error };
};
