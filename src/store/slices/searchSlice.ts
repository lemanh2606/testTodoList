import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { SearchState } from "../../types";
import type { RootState } from "../index";

const initialState: SearchState = {  searchQuery: "",
  newTaskText: "",
};

// Quản lý trạng thái tìm kiếm và nhập task mới
const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
    setNewTaskText(state, action: PayloadAction<string>) {
      state.newTaskText = action.payload;
    },
    clearNewTaskText(state) {
      state.newTaskText = "";
    },
  },
});

export const { setSearchQuery, setNewTaskText, clearNewTaskText } = searchSlice.actions;

export const selectSearchQuery = (state: RootState) => state.search.searchQuery;
export const selectNewTaskText = (state: RootState) => state.search.newTaskText;

export default searchSlice.reducer;
