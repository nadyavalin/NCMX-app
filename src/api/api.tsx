import axios from "axios";
import { useEffect, useState } from "react";
import {
  ItemCommentRequestPOST,
  ItemCommentResponseGET,
  ItemRequestPOST,
  ItemResponseGET,
} from "@components/types";

export const useFetchItems = () => {
  const src = "http://178.66.48.32:8000/ncmx_app/api/ncmx-table/";
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

export const useFetchCommentsItems = (num_nonconf: number | null) => {
  const src = `http://178.66.48.32:8000/ncmx_app/api/ncmx-comments/?num_nonconf=${num_nonconf}`;
  const [comments, setComments] = useState<ItemCommentResponseGET[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get<ItemCommentResponseGET[]>(src);
        setComments(response.data);
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

    fetchComments();
  }, [src]);

  return { comments, loading, error };
};

export const sendInconsistencyRequest = async (
  formData: ItemRequestPOST,
): Promise<ItemResponseGET> => {
  try {
    const response = await axios.post(
      "http://178.66.48.32:8000/ncmx_app/api/ncmx-table/",
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
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

export const sendCommentInconsistencyRequest = async (
  formData: ItemCommentRequestPOST,
): Promise<ItemCommentResponseGET> => {
  try {
    const response = await axios.post(
      "http://178.66.48.32:8000/ncmx_app/api/ncmx-comments/",
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
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
