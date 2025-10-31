import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@utils/api";
import { RootState } from "@store/store";
import { handleApiInconsistencyError } from "@utils/handleApiError";
import { APIResponse, InconsistencyResponseGET, InconsistencyRequestPOST } from "@appTypes/types";

// Thunk для загрузки списка несоответствий
export const fetchInconsistencies = createAsyncThunk<
  InconsistencyResponseGET[],
  { is_archived?: boolean } | void,
  { state: RootState }
>("inconsistencies/fetchInconsistencies", async (params, { rejectWithValue }) => {
  try {
    const response = await api.get<APIResponse>("/ncmx-table-inconsistencies/", {
      params: { is_archived: params?.is_archived },
    });
    return response.data.results || [];
  } catch (error: unknown) {
    return rejectWithValue(
      handleApiInconsistencyError(error, "Ошибка при получении списка несоответствий"),
    );
  }
});

// Thunk для создания несоответствия
export const createInconsistencyRequest = createAsyncThunk<
  InconsistencyResponseGET,
  InconsistencyRequestPOST,
  { state: RootState }
>("inconsistencies/createInconsistency", async (formData, { rejectWithValue }) => {
  try {
    const response = await api.post<InconsistencyResponseGET>(
      "/ncmx-table-inconsistencies/",
      formData,
    );
    return response.data;
  } catch (error: unknown) {
    return rejectWithValue(
      handleApiInconsistencyError(
        error,
        "Ошибка при создании несоответствия",
        formData.num_nonconf,
      ),
    );
  }
});

// Thunk для удаления несоответствия
export const deleteInconsistencyRequest = createAsyncThunk<void, number, { state: RootState }>(
  "inconsistencies/deleteInconsistency",
  async (num_nonconf, { rejectWithValue }) => {
    try {
      await api.delete(`/ncmx-table-inconsistencies/${num_nonconf}/`);
    } catch (error: unknown) {
      return rejectWithValue(
        handleApiInconsistencyError(error, "Ошибка при удалении несоответствия"),
      );
    }
  },
);

// Thunk для восстановления несоответствия
export const restoreInconsistencyRequest = createAsyncThunk<
  InconsistencyResponseGET,
  number,
  { state: RootState }
>("inconsistencies/restoreInconsistency", async (num_nonconf, { rejectWithValue }) => {
  try {
    const response = await api.post<InconsistencyResponseGET>(
      `/ncmx-table-inconsistencies/${num_nonconf}/restore/`,
    );
    return response.data;
  } catch (error: unknown) {
    return rejectWithValue(
      handleApiInconsistencyError(error, "Ошибка при восстановлении несоответствия"),
    );
  }
});

// Thunk для обновления несоответствия
export const updateInconsistencyRequest = createAsyncThunk<
  InconsistencyResponseGET,
  { num_nonconf: number; data: Partial<InconsistencyRequestPOST> },
  { state: RootState }
>("inconsistencies/updateInconsistency", async ({ num_nonconf, data }, { rejectWithValue }) => {
  try {
    const response = await api.patch<InconsistencyResponseGET>(
      `/ncmx-table-inconsistencies/${num_nonconf}/`,
      data,
    );
    return response.data;
  } catch (error: unknown) {
    return rejectWithValue(
      handleApiInconsistencyError(error, "Ошибка при обновлении несоответствия"),
    );
  }
});

// // Thunk для оценки результативности и архивации несоответствия
// export const estimateAndArchiveInconsistencyRequest = createAsyncThunk<
//   InconsistencyResponseGET,
//   {
//     num_nonconf: number;
//     estimate: number;
//     resp_person_nonconf_closure: string;
//     is_archived: boolean;
//     comment_text?: string;
//   },
//   { state: RootState }
// >(
//   "inconsistencies/estimateAndArchiveInconsistency",
//   async (
//     { num_nonconf, estimate, resp_person_nonconf_closure, is_archived, comment_text },
//     { rejectWithValue, dispatch },
//   ) => {
//     try {
//       // Сначала добавляем комментарий, если он есть
//       if (comment_text && comment_text.trim()) {
//         await dispatch(
//           createCommentRequest({
//             content_type: "inconsistency",
//             object_id: num_nonconf,
//             comment_author: resp_person_nonconf_closure,
//             comment_text: comment_text,
//           }),
//         ).unwrap();
//       }

//       // Затем обновляем несоответствие
//       const closureDate = new Date().toISOString();
//       const response = await api.patch<InconsistencyResponseGET>(
//         `/ncmx-table-inconsistencies/${num_nonconf}/`,
//         {
//           estimate,
//           resp_person_nonconf_closure,
//           is_archived,
//           nonconf_closure_date: closureDate,
//         },
//       );

//       return response.data;
//     } catch (error: unknown) {
//       return rejectWithValue(
//         handleApiInconsistencyError(error, "Ошибка при оценке результативности несоответствия"),
//       );
//     }
//   },
// );
