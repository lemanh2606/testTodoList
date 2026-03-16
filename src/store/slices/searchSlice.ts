/**
 * ============================================================
 *  SEARCH SLICE - Quản lý trạng thái tìm kiếm
 * ============================================================
 *
 * Tại sao tách riêng searchSlice thay vì để trong uiSlice?
 * ─────────────────────────────────────────────────────────
 *  - Search query thay đổi liên tục khi user gõ (mỗi keystroke)
 *  - Nếu để chung uiSlice, mọi thay đổi search sẽ khiến TẤT CẢ
 *    components đọc uiSlice re-render, dù chúng không dùng search
 *  - Tách riêng → chỉ components dùng searchQuery mới re-render
 *    khi search thay đổi (performance tốt hơn)
 *
 * Ngoài ra, searchSlice cũng quản lý newTaskText (text đang nhập
 * để thêm task mới) vì cả hai đều là "input state" ngắn hạn.
 *
 * LUỒNG XỬ LÝ:
 *
 *  [TaskInput] → user gõ → dispatch(setNewTaskText("..."))
 *                                   ↓
 *                      state.search.newTaskText cập nhật
 *                                   ↓
 *  [TaskInput] ← re-render ← useAppSelector(selectNewTaskText)
 *
 * ============================================================
 */

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../index";

// ─────────────────────────────────────────────
// STATE TYPE
// ─────────────────────────────────────────────
interface SearchState {
  /** Từ khóa tìm kiếm nhập trong Sidebar → filter danh sách task */
  searchQuery: string;

  /** Nội dung đang gõ trong ô nhập task mới (TaskInput) */
  newTaskText: string;
}

// ─────────────────────────────────────────────
// INITIAL STATE
// ─────────────────────────────────────────────
const initialState: SearchState = {
  searchQuery: "",
  newTaskText: "",
};

// ─────────────────────────────────────────────
// SLICE DEFINITION
// ─────────────────────────────────────────────
const searchSlice = createSlice({
  name: "search", // state.search trong Redux DevTools
  initialState,
  reducers: {
    /**
     * setSearchQuery - Cập nhật từ khóa tìm kiếm
     *
     * Luồng: SearchInput trong Sidebar → onChange
     *        → dispatch(setSearchQuery(query))
     *        → state.search.searchQuery cập nhật
     *        → TaskList tính lại filteredTasks dựa trên query mới
     */
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },

    /**
     * setNewTaskText - Cập nhật text đang nhập ô thêm task mới
     *
     * Luồng: TaskInput → onChange
     *        → dispatch(setNewTaskText(text))
     *        → state.search.newTaskText cập nhật (controlled input)
     *        → TaskInput re-render với value mới
     *
     * Reset về "" sau khi addTask thành công
     */
    setNewTaskText(state, action: PayloadAction<string>) {
      state.newTaskText = action.payload;
    },

    /**
     * clearNewTaskText - Xóa nội dung ô nhập task mới sau khi thêm thành công
     *
     * Luồng: Sau dispatch(addTask(...)) → dispatch(clearNewTaskText())
     *        → state.search.newTaskText = ""
     *        → TaskInput hiển thị ô trống, sẵn sàng nhập task tiếp theo
     */
    clearNewTaskText(state) {
      state.newTaskText = "";
    },
  },
});

// ─────────────────────────────────────────────
// EXPORT ACTIONS
// ─────────────────────────────────────────────
export const { setSearchQuery, setNewTaskText, clearNewTaskText } =
  searchSlice.actions;

// ─────────────────────────────────────────────
// SELECTORS
// ─────────────────────────────────────────────

/** Lấy từ khóa tìm kiếm hiện tại */
export const selectSearchQuery = (state: RootState) =>
  state.search.searchQuery;

/** Lấy nội dung ô nhập task mới */
export const selectNewTaskText = (state: RootState) =>
  state.search.newTaskText;

// ─────────────────────────────────────────────
// EXPORT REDUCER
// ─────────────────────────────────────────────
export default searchSlice.reducer;
