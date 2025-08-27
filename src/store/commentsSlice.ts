import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchCommentsItems,
  createCommentInconsistencyRequest,
  deleteCommentInconsistencyRequest,
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
      .addCase(fetchCommentsItems.pending, (state) => {
        state.commentLoading = true;
        state.commentError = null;
      })
      .addCase(
        fetchCommentsItems.fulfilled,
        (state, action: PayloadAction<ItemCommentResponseGET[]>) => {
          state.comments = action.payload;
          state.commentLoading = false;
        },
      )
      .addCase(fetchCommentsItems.rejected, (state, action) => {
        state.commentError = (action.payload as string) || "Ошибка при получении комментариев";
        state.commentLoading = false;
      })
      .addCase(createCommentInconsistencyRequest.pending, (state) => {
        state.commentLoading = true;
        state.commentError = null;
      })
      .addCase(
        createCommentInconsistencyRequest.fulfilled,
        (state, action: PayloadAction<ItemCommentResponseGET>) => {
          state.comments = [...state.comments, action.payload];
          state.commentLoading = false;
        },
      )
      .addCase(createCommentInconsistencyRequest.rejected, (state, action) => {
        state.commentError = (action.payload as string) || "Ошибка при создании комментария";
        state.commentLoading = false;
      })
      .addCase(
        deleteCommentInconsistencyRequest.fulfilled,
        (state, action: PayloadAction<void, string, { arg: number }>) => {
          state.comments = state.comments.filter((comment) => comment.id !== action.meta.arg);
          state.commentLoading = false;
        },
      )
      .addCase(deleteCommentInconsistencyRequest.rejected, (state, action) => {
        state.commentError = (action.payload as string) || "Ошибка при удалении комментария";
        state.commentLoading = false;
      });
  },
});

export default commentsSlice.reducer;
