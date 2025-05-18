import api from "../../utils/api";
import { useEffect, useState } from "react";
import {
  APIResponse,
  APICommentsResponse,
  ItemResponseGET,
  ItemCommentResponseGET,
  ItemRequestPOST,
  ItemCommentRequestPOST,
} from "../../components/types";
import { isAxiosError } from "axios";

export const useFetchItems = () => {
  const [items, setItems] = useState<ItemResponseGET[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await api.get<APIResponse>("/ncmx-table/");
        const results = response.data.results || [];
        setItems(results.map((item) => ({ ...item, key: item.num_nonconf })));
      } catch (error: unknown) {
        let errorMessage = "An error occurred while fetching items";
        if (isAxiosError(error)) {
          errorMessage = error.response?.data?.message || error.message;
        } else if (error instanceof Error) {
          errorMessage = error.message;
        }
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  return { items, loading, error };
};

export const sendInconsistencyRequest = async (
  formData: ItemRequestPOST,
): Promise<ItemResponseGET> => {
  try {
    const response = await api.post<ItemResponseGET>("/ncmx-table/", formData);
    console.log("Success: ", response.data);
    return response.data;
  } catch (error: unknown) {
    let errorMessage = "An error occurred while submitting the form";
    if (isAxiosError(error)) {
      errorMessage = error.response?.data?.message || error.message;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.error("Error submitting form: ", error);
    throw new Error(errorMessage);
  }
};

// TODO доделать backend, чтобы удалить в UI
export const deleteInconsistencyRequest = async (num_nonconf: number): Promise<void> => {
  try {
    await api.delete(`/ncmx-table/${num_nonconf}/`);
    console.log(`Successfully deleted inconsistency with num_nonconf: ${num_nonconf}`);
  } catch (error: unknown) {
    let errorMessage = "An error occurred while deleting the inconsistency";
    if (isAxiosError(error)) {
      errorMessage = error.response?.data?.message || error.message;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.error("Error deleting inconsistency: ", error);
    throw new Error(errorMessage);
  }
};

export const useFetchCommentsItems = (currentInconsistencyNumber: number | null) => {
  const [comments, setComments] = useState<ItemCommentResponseGET[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComments = async () => {
      if (currentInconsistencyNumber === null) {
        setComments([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const response = await api.get<APICommentsResponse>("/ncmx-comments/", {
          params: { num_nonconf: currentInconsistencyNumber },
        });
        const results = response.data.results || [];
        setComments(results.map((item) => ({ ...item, key: item.num_nonconf })));
      } catch (error: unknown) {
        let errorMessage = "An unexpected error occurred";
        if (isAxiosError(error)) {
          errorMessage = error.response?.data?.message || error.message;
        } else if (error instanceof Error) {
          errorMessage = error.message;
        }
        setError(errorMessage);
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
  try {
    const response = await api.post<ItemCommentResponseGET>("/ncmx-comments/", formData);
    console.log("Success: ", response.data);
    return response.data;
  } catch (error: unknown) {
    let errorMessage = "An error occurred while submitting the form";
    if (isAxiosError(error)) {
      errorMessage = error.response?.data?.message || error.message;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.error("Error submitting form: ", error);
    throw new Error(errorMessage);
  }
};
