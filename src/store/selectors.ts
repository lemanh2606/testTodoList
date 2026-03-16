/**
 * ============================================================
 *  TASK SELECTORS - Các selector phức tạp kết hợp nhiều state
 * ============================================================
 *
 * Tại sao cần file selectors riêng?
 * ──────────────────────────────────
 *  Một số logic cần kết hợp nhiều slices (tasks + ui + search)
 *  → Không thể đặt trong một slice cụ thể nào
 *  → Tập trung ở đây để dễ tìm, dễ tái sử dụng
 *
 * selectFilteredTasks là selector QUAN TRỌNG NHẤT của app:
 *  Kết hợp 3 nguồn:
 *    1. tasks[]         (từ tasksSlice)
 *    2. currentFilter   (từ uiSlice)
 *    3. searchQuery     (từ searchSlice)
 *
 * LUỒNG:
 *  state.tasks + state.ui.currentFilter + state.search.searchQuery
 *      ↓
 *  selectFilteredTasks(state)
 *      ↓
 *  Mảng Task[] đã lọc → hiển thị trong TaskList
 * ============================================================
 */

import type { RootState } from "../store";

/**
 * selectFilteredTasks - Selector chính để lấy danh sách task đã lọc
 *
 * Logic lọc theo thứ tự:
 *  1. Lọc theo searchQuery (nếu có)
 *  2. Lọc theo currentFilter (CARD type hoặc CATEGORY type)
 *
 * Dùng trong: TaskList component
 *
 * @example
 *  const filteredTasks = useAppSelector(selectFilteredTasks);
 */
export const selectFilteredTasks = (state: RootState) => {
  const { tasks } = state;
  const { currentFilter } = state.ui;
  const { searchQuery } = state.search;

  return tasks.filter((task) => {
    // ── Bước 1: Lọc theo từ khóa tìm kiếm ──────────────────
    // Nếu có search query, task phải chứa từ khóa (không phân biệt hoa thường)
    if (
      searchQuery &&
      !task.text.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false; // Loại bỏ task không khớp search
    }

    // ── Bước 2: Lọc theo loại filter hiện tại ───────────────
    if (currentFilter.type === "CARD") {
      // Lọc theo thẻ thống kê (All, Important, Completed, Deleted)
      switch (currentFilter.value) {
        case "All":
          return !task.deleted; // Tất cả task chưa bị xóa
        case "Important":
          return task.important && !task.deleted; // Task quan trọng, chưa xóa
        case "Completed":
          return task.completed && !task.deleted; // Task đã hoàn thành, chưa xóa
        case "Deleted":
          return task.deleted; // Task trong thùng rác
        default:
          return true;
      }
    } else if (currentFilter.type === "CATEGORY") {
      // Lọc theo danh mục (ca-nhan, cong-ty, du-lich, y-tuong)
      return task.categoryId === currentFilter.value && !task.deleted;
    }

    return true;
  });
};

/**
 * selectListHeader - Selector lấy tiêu đề danh sách hiện tại
 *
 * Dùng trong: App component để hiển thị tên của view đang xem
 * Ví dụ: "All", "Important", "Du lịch", "Cá nhân",...
 *
 * CATEGORIES_LIST được import trực tiếp vì đó là constant, không phải state
 */
import { CATEGORIES_LIST } from "../constants";

export const selectListHeader = (state: RootState): string => {
  const { currentFilter } = state.ui;

  if (currentFilter.type === "CARD") {
    // Trả về giá trị thẻ: "All", "Important", "Completed", "Deleted"
    return currentFilter.value;
  }

  // Tìm tên danh mục theo id
  const category = CATEGORIES_LIST.find((c) => c.id === currentFilter.value);
  return category ? category.name : "All";
};
