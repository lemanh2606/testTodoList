/**
 * ============================================================
 *  TASKS SLICE - Quản lý toàn bộ dữ liệu Task
 * ============================================================
 *
 * LUỒNG XỬ LÝ REDUX:
 *
 *  [Component] → dispatch(action) → [Reducer trong Slice này]
 *                                         ↓
 *                              Cập nhật state.tasks
 *                                         ↓
 *  [Component] ← re-render ← useAppSelector(selectTasks)
 *
 * Slice này chịu trách nhiệm:
 *  - Lưu trữ danh sách tasks (mảng Task[])
 *  - Xử lý thêm, xóa, sửa, hoàn thành, gắn sao, khôi phục task
 * ============================================================
 */

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Task } from "../../types";
import type { RootState } from "../index";

// ─────────────────────────────────────────────
// INITIAL STATE - Dữ liệu mặc định ban đầu
// ─────────────────────────────────────────────
const initialState: Task[] = [
  {
    id: 1,
    text: "Du lịch USA",
    important: false,
    completed: false,
    deleted: false,
    categoryId: "du-lich",
  },
  {
    id: 2,
    text: "Du lịch Nhật Bản",
    important: true,
    completed: false,
    deleted: false,
    categoryId: "du-lich",
  },
  {
    id: 3,
    text: "Test ý tưởng mới",
    important: true,
    completed: false,
    deleted: false,
    categoryId: "y-tuong",
  },
  {
    id: 4,
    text: "Ăn tối với đồng nghiệp",
    important: false,
    completed: false,
    deleted: false,
    categoryId: "cong-ty",
  },
  {
    id: 5,
    text: "Đạp xe buổi sáng",
    important: false,
    completed: false,
    deleted: false,
    categoryId: "ca-nhan",
  },
];

// ─────────────────────────────────────────────
// SLICE DEFINITION
// createSlice tự động tạo actions và reducers
// ─────────────────────────────────────────────
const tasksSlice = createSlice({
  name: "tasks", // Tên slice, dùng để debug trong Redux DevTools (state.tasks)
  initialState,
  reducers: {
    /**
     * addTask - Thêm một task mới vào cuối danh sách
     *
     * Luồng: TaskInput → dispatch(addTask(newTask)) → state.tasks.push(newTask)
     * PayloadAction<Task>: payload phải là object Task đầy đủ
     */
    addTask(state, action: PayloadAction<Task>) {
      // Immer (tích hợp sẵn trong RTK) cho phép "mutate" state trực tiếp
      // Thực chất bên dưới Immer tạo ra object mới bất biến (immutable)
      state.push(action.payload);
    },

    /**
     * toggleComplete - Đảo ngược trạng thái hoàn thành của task
     *
     * Luồng: TaskItem (checkbox) → dispatch(toggleComplete(taskId)) → cập nhật task.completed
     * PayloadAction<number>: payload là id của task cần toggle
     */
    toggleComplete(state, action: PayloadAction<number>) {
      const task = state.find((t) => t.id === action.payload);
      if (task) {
        task.completed = !task.completed; // Immer: mutate trực tiếp được
      }
    },

    /**
     * toggleImportant - Đảo ngược trạng thái quan trọng (gắn sao) của task
     *
     * Luồng: TaskItem (star button) → dispatch(toggleImportant(taskId)) → cập nhật task.important
     * PayloadAction<number>: payload là id của task cần toggle
     */
    toggleImportant(state, action: PayloadAction<number>) {
      const task = state.find((t) => t.id === action.payload);
      if (task) {
        task.important = !task.important;
      }
    },

    /**
     * updateTask - Cập nhật toàn bộ thông tin của một task (dùng khi lưu từ Drawer)
     *
     * Luồng: TaskDrawer (nút Lưu) → dispatch(updateTask(updatedTask)) → thay thế task cũ
     * PayloadAction<Task>: payload là object Task đã được sửa đổi
     */
    updateTask(state, action: PayloadAction<Task>) {
      const index = state.findIndex((t) => t.id === action.payload.id);
      if (index !== -1) {
        // Ghi đè toàn bộ task với dữ liệu mới
        state[index] = action.payload;
      }
    },

    /**
     * softDeleteTask - Xóa mềm: đánh dấu task là deleted=true (chuyển vào thùng rác)
     *
     * Luồng: DeleteConfirmDialog (xác nhận) → dispatch(softDeleteTask(taskId)) → task.deleted = true
     * PayloadAction<number>: payload là id của task cần xóa
     *
     * Lưu ý: KHÔNG xóa task khỏi mảng, chỉ đánh dấu để có thể khôi phục sau
     */
    softDeleteTask(state, action: PayloadAction<number>) {
      const task = state.find((t) => t.id === action.payload);
      if (task) {
        task.deleted = true;
      }
    },

    /**
     * restoreTask - Khôi phục task từ thùng rác
     *
     * Luồng: TaskItem (trong view Deleted) → dispatch(restoreTask(taskId)) → task.deleted = false
     * PayloadAction<number>: payload là id của task cần khôi phục
     */
    restoreTask(state, action: PayloadAction<number>) {
      const task = state.find((t) => t.id === action.payload);
      if (task) {
        task.deleted = false;
      }
    },
  },
});

// ─────────────────────────────────────────────
// EXPORT ACTIONS
// Các action creators được tự động tạo bởi createSlice
// Component sẽ import và dispatch các actions này
// ─────────────────────────────────────────────
export const {
  addTask,
  toggleComplete,
  toggleImportant,
  updateTask,
  softDeleteTask,
  restoreTask,
} = tasksSlice.actions;

// ─────────────────────────────────────────────
// SELECTORS - Hàm lấy dữ liệu từ store
// Giúp component không cần biết cấu trúc store
// Dùng: const tasks = useAppSelector(selectAllTasks)
// ─────────────────────────────────────────────

/** Lấy toàn bộ mảng tasks (bao gồm cả deleted) */
export const selectAllTasks = (state: RootState) => state.tasks;

/** Lấy tasks chưa bị xóa */
export const selectActiveTasks = (state: RootState) =>
  state.tasks.filter((t) => !t.deleted);

/** Đếm số tasks chưa bị xóa */
export const selectCountAll = (state: RootState) =>
  state.tasks.filter((t) => !t.deleted).length;

/** Đếm số tasks quan trọng */
export const selectCountImportant = (state: RootState) =>
  state.tasks.filter((t) => t.important && !t.deleted).length;

/** Đếm số tasks đã hoàn thành */
export const selectCountCompleted = (state: RootState) =>
  state.tasks.filter((t) => t.completed && !t.deleted).length;

/** Đếm số tasks trong thùng rác */
export const selectCountDeleted = (state: RootState) =>
  state.tasks.filter((t) => t.deleted).length;

// ─────────────────────────────────────────────
// EXPORT REDUCER
// Store sẽ dùng reducer này để quản lý state.tasks
// ─────────────────────────────────────────────
export default tasksSlice.reducer;
