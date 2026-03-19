// Định nghĩa cấu trúc dữ liệu cho một công việc
export interface Task {
  id: number;
  text: string;
  important: boolean;
  completed: boolean;
  deleted: boolean;
  categoryId: string;
}

// Định nghĩa cấu trúc cho một danh mục công việc
export interface Category {
  id: string;
  name: string;
}

// Trạng thái bộ lọc hiện tại (Theo thẻ hoặc theo danh mục)
export interface FilterState {
  type: "CARD" | "CATEGORY";
  value: string;
}

// Trạng thái của hộp thoại xác nhận xóa
export interface DeleteDialogState {
  open: boolean;
  taskId: number | null;
}

// Trạng thái của UI Slice
export interface UiState {
  currentFilter: FilterState;
  isDrawerOpen: boolean;
  selectedTask: Task | null;
  deleteDialog: DeleteDialogState;
}

// Trạng thái của Search Slice
export interface SearchState {
  searchQuery: string;
  newTaskText: string;
}

// Props cho component TaskItem
export interface TaskItemProps {
  task: Task;
}

// Props cho component TaskInput
export interface TaskInputProps {
  visible: boolean;
}
