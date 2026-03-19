import { configureStore } from "@reduxjs/toolkit";
import tasksReducer from "./slices/tasksSlice";
import uiReducer from "./slices/uiSlice";
import searchReducer from "./slices/searchSlice";

// Cấu hình Redux Store: Kết hợp các reducers để quản lý state toàn cục
export const store = configureStore({
  reducer: {
    tasks: tasksReducer,    // Quản lý danh sách công việc
    ui: uiReducer,          // Quản lý giao diện (filter, drawer...)
    search: searchReducer,  // Quản lý tìm kiếm và nhập liệu
  },
});

// Xuất các kiểu dữ liệu cho TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
