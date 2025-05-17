import axios from "axios";
import { useEffect, useState } from "react";
import {
  APICommentsResponse,
  APIResponse,
  ItemCommentRequestPOST,
  ItemCommentResponseGET,
  ItemRequestPOST,
  ItemResponseGET,
} from "@components/types";

// const URL = "http://178.66.48.32:8000/"
const URL = "http://127.0.0.1:8000/";

export const useFetchItems = () => {
  const src = `${URL}ncmx_app/api/ncmx-table/`;
  const [items, setItems] = useState<ItemResponseGET[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get<APIResponse>(src);
        const results = response.data.results || [];
        setItems(results.map((item) => ({ ...item, key: item.num_nonconf })));
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
  }, [src]);

  return { items, loading, error };
};

export const sendInconsistencyRequest = async (
  formData: ItemRequestPOST,
): Promise<ItemResponseGET> => {
  const src = `${URL}ncmx_app/api/ncmx-table/`;
  try {
    const response = await axios.post(src, formData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("Success: ", response.data);
    return response.data;
  } catch (error) {
    console.error("Error submitting form: ", error);
    if (axios.isAxiosError(error)) {
      throw new Error(error.message || "An error occurred while submitting the form");
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};

export const useFetchCommentsItems = (currentInconsistencyNumber: number | null) => {
  const [comments, setComments] = useState<ItemCommentResponseGET[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComments = async () => {
      const src = `${URL}ncmx_app/api/ncmx-comments/`;

      if (currentInconsistencyNumber === null) return;
      setLoading(true);

      try {
        const response = await fetch(src);
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data: APICommentsResponse = await response.json();
        const results = data.results || [];
        setComments(results.map((item) => ({ ...item, key: item.num_nonconf })));
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [currentInconsistencyNumber]);

  return { comments, loading, error };
};

export const sendCommentInconsistencyRequest = async (
  formData: ItemCommentRequestPOST,
): Promise<ItemCommentResponseGET> => {
  const src = `${URL}ncmx_app/api/ncmx-comments/`;
  try {
    const response = await axios.post(src, formData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("Success: ", response.data);
    return response.data;
  } catch (error) {
    console.error("Error submitting form: ", error);
    if (axios.isAxiosError(error)) {
      throw new Error(error.message || "An error occurred while submitting the form");
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};
