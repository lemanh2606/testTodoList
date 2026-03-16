/**
 * ============================================================
 *  REDUX STORE - Trung tâm lưu trữ state toàn cục
 * ============================================================
 *
 * CẤU TRÚC REDUX TOÀN ỨNG DỤNG:
 *
 *  ┌─────────────────────────────────────────────────────┐
 *  │                    Redux Store                      │
 *  │                                                     │
 *  │   state = {                                         │
 *  │     tasks:  Task[]         ← tasksSlice             │
 *  │     ui:     UiState        ← uiSlice                │
 *  │     search: SearchState    ← searchSlice            │
 *  │   }                                                 │
 *  └─────────────────────────────────────────────────────┘
 *
 * DATA FLOW (Luồng dữ liệu một chiều - Unidirectional):
 *
 *  1. User tương tác với Component (click, gõ,...)
 *  2. Component gọi dispatch(someAction(payload))
 *  3. Action đi qua Reducer tương ứng trong Slice
 *  4. Reducer tính toán state mới (bất biến)
 *  5. Store lưu state mới
 *  6. Các Component đang subscribe (useAppSelector) re-render
 *     với dữ liệu mới
 *
 *  Component → dispatch(action) → Reducer → Store → Component
 *
 * PHÂN CHIA SLICE:
 *  ┌─────────────────┬────────────────────────────────────────┐
 *  │ tasksSlice      │ Dữ liệu Task: thêm/sửa/xóa/hoàn thành │
 *  ├─────────────────┼────────────────────────────────────────┤
 *  │ uiSlice         │ Trạng thái UI: filter/drawer/dialog    │
 *  ├─────────────────┼────────────────────────────────────────┤
 *  │ searchSlice     │ Search query & new task text (input)   │
 *  └─────────────────┴────────────────────────────────────────┘
 * ============================================================
 */

import { configureStore } from "@reduxjs/toolkit";
import tasksReducer from "./slices/tasksSlice";
import uiReducer from "./slices/uiSlice";
import searchReducer from "./slices/searchSlice";

// ─────────────────────────────────────────────
// CONFIGURE STORE
// Kết hợp tất cả reducers thành một store duy nhất
// ─────────────────────────────────────────────
export const store = configureStore({
  reducer: {
    tasks: tasksReducer,    // Quản lý state.tasks
    ui: uiReducer,          // Quản lý state.ui
    search: searchReducer,  // Quản lý state.search
  },
  // Redux DevTools tự động bật trong development mode
  // Cài extension "Redux DevTools" trên Chrome để debug trực quan
});

// ─────────────────────────────────────────────
// TYPE EXPORTS - TypeScript inference từ store
//
// Thay vì định nghĩa thủ công, TypeScript tự suy ra types
// từ store configuration → luôn đồng bộ với code
// ─────────────────────────────────────────────

/**
 * RootState - Kiểu dữ liệu của toàn bộ Redux state
 *
 * Dùng trong Selectors: (state: RootState) => state.tasks
 * TypeScript tự suy ra = { tasks: Task[], ui: UiState, search: SearchState }
 */
export type RootState = ReturnType<typeof store.getState>;

/**
 * AppDispatch - Kiểu của hàm dispatch
 *
 * Dùng trong typed hook useAppDispatch để dispatch actions
 * (bao gồm cả async thunks nếu sau này cần)
 */
export type AppDispatch = typeof store.dispatch;
