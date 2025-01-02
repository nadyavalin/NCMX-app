import axios from "axios";
import { useEffect, useState } from "react";
import { Item } from "@components/types";

export const useFetchItems = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await axios.get<Item[]>("http://localhost:8000/api/items/");
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
