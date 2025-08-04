import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ItemResponseGET, ItemCommentResponseGET } from "@components/types";
import {
  fetchItems,
  createInconsistencyRequest,
  deleteInconsistencyRequest,
  updateInconsistencyRequest,
  createCommentInconsistencyRequest,
  fetchCommentsItems,
  restoreInconsistencyRequest,
} from "@api/route";

interface InconsistencyNumberState {
  currentInconsistencyNumber: number | null;
  isModalCommentsOpen: boolean;
  isModalHistoryCommentsOpen: boolean;
  isModalEstimateResultOpen: boolean;
  isModalEditOpen: boolean;
  activeItems: ItemResponseGET[];
  archivedItems: ItemResponseGET[];
  itemsLoading: boolean;
  itemsError: string | null;
  createLoading: boolean;
  createError: string | null;
  commentLoading: boolean;
  commentError: string | null;
  comments: ItemCommentResponseGET[];
}

const initialState: InconsistencyNumberState = {
  currentInconsistencyNumber: null,
  isModalCommentsOpen: false,
  isModalHistoryCommentsOpen: false,
  isModalEstimateResultOpen: false,
  isModalEditOpen: false,
  activeItems: [],
  archivedItems: [],
  itemsLoading: false,
  itemsError: null,
  createLoading: false,
  createError: null,
  commentLoading: false,
  commentError: null,
  comments: [],
};

const numSlice = createSlice({
  name: "num",
  initialState,
  reducers: {
    setCurrentInconsistencyNumber(state, action: PayloadAction<number | null>) {
      state.currentInconsistencyNumber = action.payload;
    },
    toggleModalComments(state, action: PayloadAction<boolean>) {
      state.isModalCommentsOpen = action.payload;
    },
    toggleModalHistoryComments(state, action: PayloadAction<boolean>) {
      state.isModalHistoryCommentsOpen = action.payload;
    },
    toggleModalEstimateResult(state, action: PayloadAction<boolean>) {
      state.isModalEstimateResultOpen = action.payload;
    },
    toggleModalEdit(state, action: PayloadAction<boolean>) {
      state.isModalEditOpen = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchItems.pending, (state) => {
        state.itemsLoading = true;
        state.itemsError = null;
      })
      .addCase(
        fetchItems.fulfilled,
        (
          state,
          action: PayloadAction<
            ItemResponseGET[],
            string,
            { arg: { is_archived?: boolean } | void }
          >,
        ) => {
          if (action.meta.arg && "is_archived" in action.meta.arg) {
            if (action.meta.arg.is_archived) {
              state.archivedItems = action.payload;
            } else {
              state.activeItems = action.payload;
            }
          } else {
            state.activeItems = action.payload;
          }
          state.itemsLoading = false;
        },
      )
      .addCase(fetchItems.rejected, (state, action) => {
        state.itemsError = (action.payload as string) || "Ошибка при загрузке данных";
        state.itemsLoading = false;
      })
      .addCase(createInconsistencyRequest.pending, (state) => {
        state.createLoading = true;
        state.createError = null;
      })
      .addCase(
        createInconsistencyRequest.fulfilled,
        (state, action: PayloadAction<ItemResponseGET>) => {
          state.activeItems = [...state.activeItems, action.payload];
          state.createLoading = false;
        },
      )
      .addCase(createInconsistencyRequest.rejected, (state, action) => {
        if (
          typeof action.payload === "string" &&
          action.payload.includes("Несоответствие с номером") &&
          action.payload.includes("уже существует")
        ) {
          // Не устанавливаем createError для ошибки дублирования
        } else {
          state.createError = (action.payload as string) || "Ошибка при создании несоответствия";
        }
        state.createLoading = false;
      })
      .addCase(
        deleteInconsistencyRequest.fulfilled,
        (state, action: PayloadAction<void, string, { arg: number }>) => {
          state.activeItems = state.activeItems.filter(
            (item) => item.num_nonconf !== action.meta.arg,
          );
        },
      )
      .addCase(deleteInconsistencyRequest.rejected, (state, action) => {
        state.itemsError = (action.payload as string) || "Ошибка при удалении несоответствия";
      })
      .addCase(
        updateInconsistencyRequest.fulfilled,
        (state, action: PayloadAction<ItemResponseGET>) => {
          if (action.payload.is_archived) {
            state.activeItems = state.activeItems.filter(
              (item) => item.num_nonconf !== action.payload.num_nonconf,
            );
            state.archivedItems = state.archivedItems.some(
              (item) => item.num_nonconf === action.payload.num_nonconf,
            )
              ? state.archivedItems.map((item) =>
                  item.num_nonconf === action.payload.num_nonconf ? action.payload : item,
                )
              : [...state.archivedItems, action.payload];
          } else {
            state.archivedItems = state.archivedItems.filter(
              (item) => item.num_nonconf !== action.payload.num_nonconf,
            );
            state.activeItems = state.activeItems.some(
              (item) => item.num_nonconf === action.payload.num_nonconf,
            )
              ? state.activeItems.map((item) =>
                  item.num_nonconf === action.payload.num_nonconf ? action.payload : item,
                )
              : [...state.activeItems, action.payload];
          }
          state.itemsLoading = false;
        },
      )
      .addCase(updateInconsistencyRequest.rejected, (state, action) => {
        state.itemsError = (action.payload as string) || "Ошибка при обновлении несоответствия";
        state.itemsLoading = false;
      })
      .addCase(
        restoreInconsistencyRequest.fulfilled,
        (state, action: PayloadAction<ItemResponseGET>) => {
          state.archivedItems = state.archivedItems.filter(
            (item) => item.num_nonconf !== action.payload.num_nonconf,
          );
          state.activeItems = state.activeItems.some(
            (item) => item.num_nonconf === action.payload.num_nonconf,
          )
            ? state.activeItems.map((item) =>
                item.num_nonconf === action.payload.num_nonconf ? action.payload : item,
              )
            : [...state.activeItems, action.payload];
        },
      )
      .addCase(restoreInconsistencyRequest.rejected, (state, action) => {
        state.itemsError = (action.payload as string) || "Ошибка при восстановлении несоответствия";
      })
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
      });
  },
});

export const {
  setCurrentInconsistencyNumber,
  toggleModalComments,
  toggleModalHistoryComments,
  toggleModalEstimateResult,
  toggleModalEdit,
} = numSlice.actions;

export default numSlice.reducer;
