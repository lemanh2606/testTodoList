import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Task } from "../../types";
import type { RootState } from "../index";

// Dữ liệu mẫu ban đầu
const initialState: Task[] = [
  { id: 1, text: "Du lịch USA", important: false, completed: false, deleted: false, categoryId: "du-lich" },
  { id: 2, text: "Du lịch Nhật Bản", important: true, completed: false, deleted: false, categoryId: "du-lich" },
  { id: 3, text: "Test ý tưởng mới", important: true, completed: false, deleted: false, categoryId: "y-tuong" },
  { id: 4, text: "Ăn tối với đồng nghiệp", important: false, completed: false, deleted: false, categoryId: "cong-ty" },
  { id: 5, text: "Đạp xe buổi sáng", important: false, completed: false, deleted: false, categoryId: "ca-nhan" },
];

// Slice quản lý toàn bộ dữ liệu công việc (Tasks)
const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    addTask(state, action: PayloadAction<Task>) {
      state.push(action.payload);
    },
    toggleComplete(state, action: PayloadAction<number>) {
      const task = state.find((t) => t.id === action.payload);
      if (task) task.completed = !task.completed;
    },
    toggleImportant(state, action: PayloadAction<number>) {
      const task = state.find((t) => t.id === action.payload);
      if (task) task.important = !task.important;
    },
    updateTask(state, action: PayloadAction<Task>) {
      const index = state.findIndex((t) => t.id === action.payload.id);
      if (index !== -1) state[index] = action.payload;
    },
    softDeleteTask(state, action: PayloadAction<number>) {
      const task = state.find((t) => t.id === action.payload);
      if (task) task.deleted = true;
    },
    restoreTask(state, action: PayloadAction<number>) {
      const task = state.find((t) => t.id === action.payload);
      if (task) task.deleted = false;
    },
  },
});

export const {
  addTask,
  toggleComplete,
  toggleImportant,
  updateTask,
  softDeleteTask,
  restoreTask,
} = tasksSlice.actions;

// Selectors: Lấy dữ liệu từ store
export const selectAllTasks = (state: RootState) => state.tasks;
export const selectActiveTasks = (state: RootState) => state.tasks.filter((t) => !t.deleted);
export const selectCountAll = (state: RootState) => state.tasks.filter((t) => !t.deleted).length;
export const selectCountImportant = (state: RootState) => state.tasks.filter((t) => t.important && !t.deleted).length;
export const selectCountCompleted = (state: RootState) => state.tasks.filter((t) => t.completed && !t.deleted).length;
export const selectCountDeleted = (state: RootState) => state.tasks.filter((t) => t.deleted).length;

export default tasksSlice.reducer;
