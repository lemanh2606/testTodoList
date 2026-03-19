import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { FilterState, Task, UiState } from "../../types";
import type { RootState } from "../index";

const initialState: UiState = {  currentFilter: { type: "CARD", value: "All" },
  isDrawerOpen: false,
  selectedTask: null,
  deleteDialog: { open: false, taskId: null },
};

// Quản lý trạng thái giao diện UI
const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setCurrentFilter(state, action: PayloadAction<FilterState>) {
      state.currentFilter = action.payload;
    },
    openDrawer(state, action: PayloadAction<Task>) {
      state.selectedTask = { ...action.payload };
      state.isDrawerOpen = true;
    },
    closeDrawer(state) {
      state.isDrawerOpen = false;
    },
    updateSelectedTask(state, action: PayloadAction<Task>) {
      state.selectedTask = action.payload;
    },
    openDeleteDialog(state, action: PayloadAction<number>) {
      state.deleteDialog = { open: true, taskId: action.payload };
    },
    closeDeleteDialog(state) {
      state.deleteDialog = { open: false, taskId: null };
    },
  },
});

export const {
  setCurrentFilter,
  openDrawer,
  closeDrawer,
  updateSelectedTask,
  openDeleteDialog,
  closeDeleteDialog,
} = uiSlice.actions;

export const selectCurrentFilter = (state: RootState) => state.ui.currentFilter;
export const selectIsDrawerOpen = (state: RootState) => state.ui.isDrawerOpen;
export const selectSelectedTask = (state: RootState) => state.ui.selectedTask;
export const selectDeleteDialog = (state: RootState) => state.ui.deleteDialog;

export default uiSlice.reducer;
