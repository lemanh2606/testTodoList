/**
 * ============================================================
 *  UI SLICE - Quản lý toàn bộ trạng thái giao diện người dùng
 * ============================================================
 *
 * LUỒNG XỬ LÝ REDUX:
 *
 *  [Component] → dispatch(uiAction) → [Reducer trong Slice này]
 *                                           ↓
 *                              Cập nhật state.ui (filter, drawer, dialog...)
 *                                           ↓
 *  [Component] ← re-render ← useAppSelector(selectUI...)
 *
 * Slice này chịu trách nhiệm:
 *  - Bộ lọc hiện tại (filter: All, Important, Completed, Deleted, Category)
 *  - Trạng thái đóng/mở của Drawer (chi tiết task)
 *  - Task đang được chọn để chỉnh sửa trong Drawer
 *  - Trạng thái hộp thoại xác nhận xóa
 * ============================================================
 */

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { FilterState, DeleteDialogState, Task } from "../../types";
import type { RootState } from "../index";

// ─────────────────────────────────────────────
// STATE TYPE - Định nghĩa cấu trúc state của slice này
// ─────────────────────────────────────────────
interface UiState {
  /** Bộ lọc hiện tại: loại lọc (CARD/CATEGORY) và giá trị (All/Important/...) */
  currentFilter: FilterState;

  /** Trạng thái mở/đóng của Drawer bên phải (xem/sửa chi tiết task) */
  isDrawerOpen: boolean;

  /**
   * Task đang được chọn để chỉnh sửa trong Drawer
   * null = chưa chọn task nào / đã đóng Drawer
   * Task = đang xem/sửa task này
   */
  selectedTask: Task | null;

  /** Trạng thái hộp thoại xác nhận xóa */
  deleteDialog: DeleteDialogState;
}

// ─────────────────────────────────────────────
// INITIAL STATE - Trạng thái UI mặc định khi khởi động
// ─────────────────────────────────────────────
const initialState: UiState = {
  currentFilter: {
    type: "CARD",
    value: "All", // Mặc định hiển thị tất cả tasks
  },
  isDrawerOpen: false,
  selectedTask: null,
  deleteDialog: {
    open: false,
    taskId: null,
  },
};

// ─────────────────────────────────────────────
// SLICE DEFINITION
// ─────────────────────────────────────────────
const uiSlice = createSlice({
  name: "ui", // state.ui trong Redux DevTools
  initialState,
  reducers: {
    /**
     * setCurrentFilter - Thay đổi bộ lọc hiển thị danh sách
     *
     * Luồng: Sidebar (click card/category) → dispatch(setCurrentFilter({type, value}))
     *        → state.ui.currentFilter cập nhật
     *        → TaskList re-render với danh sách đã lọc mới
     *
     * PayloadAction<FilterState>:
     *   - type: "CARD" | "CATEGORY"
     *   - value: "All" | "Important" | "Completed" | "Deleted" | categoryId
     */
    setCurrentFilter(state, action: PayloadAction<FilterState>) {
      state.currentFilter = action.payload;
    },

    /**
     * openDrawer - Mở Drawer chỉnh sửa với task được cung cấp
     *
     * Luồng: TaskItem (click vào task) → dispatch(openDrawer(task))
     *        → state.ui.isDrawerOpen = true & state.ui.selectedTask = task
     *        → TaskDrawer hiển thị và load thông tin task
     *
     * PayloadAction<Task>: payload là task cần xem/sửa
     *
     * Lưu ý: Clone task ({...task}) để tránh mutate trực tiếp task gốc
     *        khi người dùng đang sửa trong Drawer nhưng chưa lưu
     */
    openDrawer(state, action: PayloadAction<Task>) {
      state.selectedTask = { ...action.payload }; // Clone để edit không ảnh hưởng task gốc
      state.isDrawerOpen = true;
    },

    /**
     * closeDrawer - Đóng Drawer và reset selectedTask
     *
     * Luồng: Nút X trong Drawer / overlay → dispatch(closeDrawer())
     *        → state.ui.isDrawerOpen = false
     */
    closeDrawer(state) {
      state.isDrawerOpen = false;
      // Giữ selectedTask để animation đóng Drawer không bị giật (fade out)
      // selectedTask sẽ bị clear khi mở task khác
    },

    /**
     * updateSelectedTask - Cập nhật thông tin task đang sửa trong Drawer (local state)
     *
     * Luồng: TextField trong TaskDrawer onChange
     *        → dispatch(updateSelectedTask({...selectedTask, text: newText}))
     *        → state.ui.selectedTask cập nhật (CHỈ local, task gốc chưa đổi)
     *        → Sau đó bấm "Lưu" mới dispatch updateTask vào tasksSlice
     *
     * PayloadAction<Task>: payload là toàn bộ Task object đã chỉnh sửa
     */
    updateSelectedTask(state, action: PayloadAction<Task>) {
      state.selectedTask = action.payload;
    },

    /**
     * openDeleteDialog - Mở hộp thoại xác nhận xóa
     *
     * Luồng: Nút Xóa (TaskItem hoặc TaskDrawer)
     *        → dispatch(openDeleteDialog(taskId))
     *        → state.ui.deleteDialog = { open: true, taskId }
     *        → DeleteConfirmDialog hiển thị
     *
     * PayloadAction<number>: payload là id của task muốn xóa
     */
    openDeleteDialog(state, action: PayloadAction<number>) {
      state.deleteDialog = {
        open: true,
        taskId: action.payload,
      };
    },

    /**
     * closeDeleteDialog - Đóng hộp thoại xác nhận xóa (hủy bỏ)
     *
     * Luồng: Nút "Hủy bỏ" trong DeleteConfirmDialog
     *        → dispatch(closeDeleteDialog())
     *        → state.ui.deleteDialog = { open: false, taskId: null }
     */
    closeDeleteDialog(state) {
      state.deleteDialog = {
        open: false,
        taskId: null,
      };
    },
  },
});

// ─────────────────────────────────────────────
// EXPORT ACTIONS
// ─────────────────────────────────────────────
export const {
  setCurrentFilter,
  openDrawer,
  closeDrawer,
  updateSelectedTask,
  openDeleteDialog,
  closeDeleteDialog,
} = uiSlice.actions;

// ─────────────────────────────────────────────
// SELECTORS - Đọc dữ liệu UI từ store
// ─────────────────────────────────────────────

/** Lấy bộ lọc hiện tại */
export const selectCurrentFilter = (state: RootState) =>
  state.ui.currentFilter;

/** Lấy trạng thái đóng/mở Drawer */
export const selectIsDrawerOpen = (state: RootState) => state.ui.isDrawerOpen;

/** Lấy task đang được chọn/sửa trong Drawer */
export const selectSelectedTask = (state: RootState) => state.ui.selectedTask;

/** Lấy trạng thái hộp thoại xóa */
export const selectDeleteDialog = (state: RootState) => state.ui.deleteDialog;

// ─────────────────────────────────────────────
// EXPORT REDUCER
// ─────────────────────────────────────────────
export default uiSlice.reducer;
