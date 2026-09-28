import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RescheduleCommentResponseGET } from "@appTypes/types";
import {
  createRescheduleCommentRequest,
  deleteRescheduleCommentRequest,
  fetchRescheduleComments,
  updateRescheduleCommentRequest,
} from "@/api/rescheduleCommentsApi";

interface RescheduleCommentsState {
  rescheduleComments: RescheduleCommentResponseGET[];
  rescheduleCommentLoading: boolean;
  rescheduleCommentError: string | null;
}

const initialState: RescheduleCommentsState = {
  rescheduleComments: [],
  rescheduleCommentLoading: false,
  rescheduleCommentError: null,
};

const rescheduleCommentsSlice = createSlice({
  name: "rescheduleComments",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRescheduleComments.pending, (state) => {
        state.rescheduleCommentLoading = true;
        state.rescheduleCommentError = null;
      })
      .addCase(
        fetchRescheduleComments.fulfilled,
        (state, action: PayloadAction<RescheduleCommentResponseGET[]>) => {
          state.rescheduleComments = action.payload;
          state.rescheduleCommentLoading = false;
        },
      )
      .addCase(fetchRescheduleComments.rejected, (state, action) => {
        state.rescheduleCommentError =
          (action.payload as string) || "Ошибка при получении комментариев о переносе";
        state.rescheduleCommentLoading = false;
      })

      .addCase(createRescheduleCommentRequest.pending, (state) => {
        state.rescheduleCommentLoading = true;
        state.rescheduleCommentError = null;
      })
      .addCase(
        createRescheduleCommentRequest.fulfilled,
        (state, action: PayloadAction<RescheduleCommentResponseGET>) => {
          state.rescheduleComments = [...state.rescheduleComments, action.payload];
          state.rescheduleCommentLoading = false;
        },
      )
      .addCase(createRescheduleCommentRequest.rejected, (state, action) => {
        state.rescheduleCommentError =
          (action.payload as string) || "Ошибка при создании комментария о переносе";
        state.rescheduleCommentLoading = false;
      })

      .addCase(updateRescheduleCommentRequest.pending, (state) => {
        state.rescheduleCommentLoading = true;
        state.rescheduleCommentError = null;
      })
      .addCase(
        updateRescheduleCommentRequest.fulfilled,
        (state, action: PayloadAction<RescheduleCommentResponseGET>) => {
          state.rescheduleComments = state.rescheduleComments.map((comment) =>
            comment.id === action.payload.id ? action.payload : comment,
          );
          state.rescheduleCommentLoading = false;
        },
      )
      .addCase(updateRescheduleCommentRequest.rejected, (state, action) => {
        state.rescheduleCommentError =
          (action.payload as string) || "Ошибка при обновлении комментария о переносе";
        state.rescheduleCommentLoading = false;
      })

      .addCase(
        deleteRescheduleCommentRequest.fulfilled,
        (state, action: PayloadAction<void, string, { arg: number }>) => {
          state.rescheduleComments = state.rescheduleComments.filter(
            (comment) => comment.id !== action.meta.arg,
          );
          state.rescheduleCommentLoading = false;
        },
      )
      .addCase(deleteRescheduleCommentRequest.rejected, (state, action) => {
        state.rescheduleCommentError =
          (action.payload as string) || "Ошибка при удалении комментария о переносе";
        state.rescheduleCommentLoading = false;
      });
  },
});

export default rescheduleCommentsSlice.reducer;
