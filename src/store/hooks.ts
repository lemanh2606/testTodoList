/**
 * ============================================================
 *  REDUX TYPED HOOKS
 * ============================================================
 *
 * Tại sao cần typed hooks thay vì dùng thẳng useDispatch/useSelector?
 * ─────────────────────────────────────────────────────────────────
 *
 *  Cách thông thường (KHÔNG NÊN):
 *    const dispatch = useDispatch();        // dispatch: Dispatch<AnyAction>
 *    const tasks = useSelector(state => state.tasks); // state: unknown
 *
 *    → TypeScript KHÔNG kiểm tra được type → dễ bug
 *
 *  Cách đúng với typed hooks (NÊN DÙNG):
 *    const dispatch = useAppDispatch();     // dispatch: AppDispatch 
 *  *    const tasks = useAppSelector(selectAllTasks); // tasks: Task[] 
 *
 *    → TypeScript kiểm tra đầy đủ → autocomplete → an toàn hơn
 *
 * CÁCH DÙNG:
 *  import { useAppDispatch, useAppSelector } from "../store/hooks";
 *
 *  const dispatch = useAppDispatch();
 *  const tasks = useAppSelector(selectAllTasks);
 *  dispatch(addTask(newTask));
 * ============================================================
 */

import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./index";

/**
 * useAppDispatch - Typed version của useDispatch
 *
 * Trả về dispatch function với đầy đủ kiểu dữ liệu AppDispatch
 * Giúp TypeScript kiểm tra action types khi dispatch
 *
 * @example
 *  const dispatch = useAppDispatch();
 *  dispatch(addTask(newTask));          //  TypeScript kiểm tra
 *  dispatch({ type: "invalid" });       //  TypeScript báo lỗi
 */
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();

/**
 * useAppSelector - Typed version của useSelector
 *
 * Trả về kết quả của selector với RootState đã được typed
 * component sẽ tự động re-render khi phần state được chọn thay đổi
 *
 * @example
 *  const tasks = useAppSelector(selectAllTasks);       // tasks: Task[]
 *  const filter = useAppSelector(selectCurrentFilter); // filter: FilterState
 *  const query = useAppSelector(selectSearchQuery);    // query: string
 */
export const useAppSelector = useSelector.withTypes<RootState>();
