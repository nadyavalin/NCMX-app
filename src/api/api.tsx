import axios from "axios";
import { useEffect, useState } from "react";
import { ItemResponseGET } from "@components/types";

export const useFetchItems = () => {
  const src = "http://178.66.48.32:8000/ncmx_app/api/ncmx/";
  const [items, setItems] = useState<ItemResponseGET[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get<ItemResponseGET[]>(src);
        setItems(response.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setError(error.message || "An error occurred while fetching items");
        } else if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  return { items, loading, error };
};
