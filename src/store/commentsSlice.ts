import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchComments,
  createCommentRequest,
  updateCommentRequest,
  deleteCommentRequest,
} from "@/api";
import { ItemCommentResponseGET } from "@appTypes/types";

interface CommentsState {
  comments: ItemCommentResponseGET[];
  commentLoading: boolean;
  commentError: string | null;
}

const initialState: CommentsState = {
  comments: [],
  commentLoading: false,
  commentError: null,
};

const commentsSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(fetchComments.pending, (state) => {
        state.commentLoading = true;
        state.commentError = null;
      })
      .addCase(
        fetchComments.fulfilled,
        (state, action: PayloadAction<ItemCommentResponseGET[]>) => {
          state.comments = action.payload;
          state.commentLoading = false;
        },
      )
      .addCase(fetchComments.rejected, (state, action) => {
        state.commentError = (action.payload as string) || "Ошибка при получении комментариев";
        state.commentLoading = false;
      })

      .addCase(createCommentRequest.pending, (state) => {
        state.commentLoading = true;
        state.commentError = null;
      })
      .addCase(
        createCommentRequest.fulfilled,
        (state, action: PayloadAction<ItemCommentResponseGET>) => {
          state.comments = [...state.comments, action.payload];
          state.commentLoading = false;
        },
      )
      .addCase(createCommentRequest.rejected, (state, action) => {
        state.commentError = (action.payload as string) || "Ошибка при создании комментария";
        state.commentLoading = false;
      })

      .addCase(updateCommentRequest.pending, (state) => {
        state.commentLoading = true;
        state.commentError = null;
      })
      .addCase(
        updateCommentRequest.fulfilled,
        (state, action: PayloadAction<ItemCommentResponseGET>) => {
          state.comments = state.comments.map((comment) =>
            comment.id === action.payload.id ? action.payload : comment,
          );
          state.commentLoading = false;
        },
      )
      .addCase(updateCommentRequest.rejected, (state, action) => {
        state.commentError = (action.payload as string) || "Ошибка при обновлении комментария";
        state.commentLoading = false;
      })

      .addCase(
        deleteCommentRequest.fulfilled,
        (state, action: PayloadAction<void, string, { arg: number }>) => {
          state.comments = state.comments.filter((comment) => comment.id !== action.meta.arg);
          state.commentLoading = false;
        },
      )
      .addCase(deleteCommentRequest.rejected, (state, action) => {
        state.commentError = (action.payload as string) || "Ошибка при удалении комментария";
        state.commentLoading = false;
      });
  },
});

// export const { clearComments } = commentsSlice.actions;
export default commentsSlice.reducer;
