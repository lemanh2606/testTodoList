import type { RootState } from "../store";
import { CATEGORIES_LIST } from "../constants";

// Selector chính: Lấy danh sách công việc đã được lọc
export const selectFilteredTasks = (state: RootState) => {
  const { tasks } = state;
  const { currentFilter } = state.ui;
  const { searchQuery } = state.search;

  return tasks.filter((task) => {
    // 1. Lọc theo từ khóa tìm kiếm
    if (searchQuery && !task.text.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // 2. Lọc theo bộ lọc hiện tại (Thẻ hoặc Danh mục)
    if (currentFilter.type === "CARD") {
      switch (currentFilter.value) {
        case "All": return !task.deleted;
        case "Important": return task.important && !task.deleted;
        case "Completed": return task.completed && !task.deleted;
        case "Deleted": return task.deleted;
        default: return true;
      }
    } else if (currentFilter.type === "CATEGORY") {
      return task.categoryId === currentFilter.value && !task.deleted;
    }

    return true;
  });
};

// Lấy tiêu đề hiển thị cho danh sách hiện tại
export const selectListHeader = (state: RootState): string => {
  const { currentFilter } = state.ui;

  if (currentFilter.type === "CARD") return currentFilter.value;

  const category = CATEGORIES_LIST.find((c) => c.id === currentFilter.value);
  return category ? category.name : "All";
};
