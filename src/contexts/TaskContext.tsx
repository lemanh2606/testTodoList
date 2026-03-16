import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import type { Task, FilterState, DeleteDialogState } from "../types";
import { CATEGORIES_LIST } from "../constants";

/**
 * TaskContextType định nghĩa cấu trúc dữ liệu và các hàm mà Context sẽ cung cấp cho ứng dụng.
 */
interface TaskContextType {
  // --- States ---
  tasks: Task[]; // Danh sách toàn bộ công việc (bao gồm cả đã xóa)
  filteredTasks: Task[]; // Danh sách công việc sau khi áp dụng các bộ lọc (filter, search)
  newTaskText: string; // Nội dung văn bản đang nhập cho công việc mới
  searchQuery: string; // Từ khóa tìm kiếm công việc
  currentFilter: FilterState; // Trạng thái bộ lọc hiện tại (Tất cả, Quan trọng, Danh mục...)
  isDrawerOpen: boolean; // Trạng thái đóng/mở của thanh chỉnh sửa bên phải
  selectedTask: Task | null; // Đối tượng công việc đang được chọn để chỉnh sửa
  deleteDialog: DeleteDialogState; // Trạng thái của hộp thoại xác nhận xóa
  listHeader: string; // Tiêu đề hiển thị cho danh sách hiện tại (ví dụ: "Tất cả", "Du lịch")

  // --- Actions (Hàm cập nhật state đơn giản) ---
  setNewTaskText: (text: string) => void;
  setSearchQuery: (query: string) => void;
  setCurrentFilter: (filter: FilterState) => void;
  setIsDrawerOpen: (open: boolean) => void;
  setSelectedTask: (task: Task | null) => void;
  setDeleteDialog: (state: DeleteDialogState) => void;

  // --- Logic Handlers (Hàm xử lý nghiệp vụ) ---
  addTask: (e: React.KeyboardEvent<HTMLInputElement>) => void; // Thêm công việc mới vào danh sách
  toggleComplete: (taskId: number) => void; // Thay đổi trạng thái Hoàn thành (check/uncheck)
  toggleImportant: (taskId: number) => void; // Thay đổi trạng thái Quan trọng (gắn sao)
  openTaskDetails: (task: Task) => void; // Mở Drawer để chỉnh sửa chi tiết một task
  saveSelectedTask: () => void; // Lưu lại các thông tin đã sửa trong Drawer
  openDeleteConfirm: (taskId: number, e?: React.MouseEvent) => void; // Hiển thị thông báo xác nhận xóa
  confirmDelete: () => void; // Thực hiện xóa task (đưa vào trạng thái 'deleted')
  closeDeleteConfirm: () => void; // Đóng thông báo xác nhận xóa
  restoreTask: (taskId: number, e?: React.MouseEvent) => void; // Khôi phục task từ thùng rác
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // State lưu trữ danh sách task gốc
  const [tasks, setTasks] = useState<Task[]>([
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
      text: "Test",
      important: true,
      completed: false,
      deleted: false,
      categoryId: "y-tuong",
    },
    {
      id: 4,
      text: "Ăn tối",
      important: false,
      completed: false,
      deleted: false,
      categoryId: "cong-ty",
    },
    {
      id: 5,
      text: "Đạp xe",
      important: false,
      completed: false,
      deleted: false,
      categoryId: "ca-nhan",
    },
  ]);

  // Các state quản lý UI và filter
  const [newTaskText, setNewTaskText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentFilter, setCurrentFilter] = useState<FilterState>({
    type: "CARD",
    value: "All",
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const [deleteDialog, setDeleteDialog] = useState<DeleteDialogState>({
    open: false,
    taskId: null,
  });

  /**
   * Thêm một task mới vào danh sách khi người dùng nhấn Enter
   */
  const addTask = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newTaskText.trim() !== "") {
      const newTask: Task = {
        id: Date.now(),
        text: newTaskText.trim(),
        important: currentFilter.value === "Important", // Nếu đang ở tab Important thì mặc định là quan trọng
        completed: false,
        deleted: false,
        categoryId:
          currentFilter.type === "CATEGORY" ? currentFilter.value : "ca-nhan", // Mặc định theo danh mục đang chọn
      };

      setTasks([...tasks, newTask]);
      setNewTaskText("");
    }
  };

  /**
   * Đảo ngược trạng thái hoàn thành của một task
   */
  const toggleComplete = (taskId: number) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, completed: !t.completed } : t,
      ),
    );
  };

  /**
   * Đảo ngược trạng thái quan trọng (gắn sao) của một task
   */
  const toggleImportant = (taskId: number) => {
    setTasks(
      tasks.map((t) =>
        t.id === taskId ? { ...t, important: !t.important } : t,
      ),
    );
  };

  /**
   * Mở chi tiết công việc trong Drawer để chỉnh sửa
   */
  const openTaskDetails = (task: Task) => {
    setSelectedTask({ ...task });
    setIsDrawerOpen(true);
  };

  /**
   * Cập nhật thông tin task sau khi người dùng sửa trong Drawer
   */
  const saveSelectedTask = () => {
    if (selectedTask) {
      setTasks(tasks.map((t) => (t.id === selectedTask.id ? selectedTask : t)));
      setIsDrawerOpen(false);
    }
  };

  /**
   * Mở popup yêu cầu xác nhận trước khi xóa
   */
  const openDeleteConfirm = (taskId: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setDeleteDialog({ open: true, taskId });
  };

  /**
   * Thực hiện xóa thực sự (đánh dấu deleted = true) sau khi xác nhận
   */
  const confirmDelete = () => {
    if (deleteDialog.taskId !== null) {
      setTasks(
        tasks.map((t) =>
          t.id === deleteDialog.taskId ? { ...t, deleted: true } : t,
        ),
      );

      // Nếu đang mở Drawer của chính task đó thì đóng lại
      if (selectedTask && selectedTask.id === deleteDialog.taskId) {
        setIsDrawerOpen(false);
      }
    }
    setDeleteDialog({ open: false, taskId: null });
  };

  /**
   * Đóng popup xác nhận xóa mà không làm gì cả
   */
  const closeDeleteConfirm = () => {
    setDeleteDialog({ open: false, taskId: null });
  };

  /**
   * Khôi phục task từ thùng rác về danh sách hoạt động
   */
  const restoreTask = (taskId: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setTasks(
      tasks.map((t) => (t.id === taskId ? { ...t, deleted: false } : t)),
    );
  };

  /**
   * Lấy tiêu đề hiển thị cho danh sách dựa trên filter đang chọn
   */
  const getListHeader = () => {
    if (currentFilter.type === "CARD") return currentFilter.value;
    const cat = CATEGORIES_LIST.find((c) => c.id === currentFilter.value);
    return cat ? cat.name : "All";
  };

  /**
   * Logic lọc danh sách tasks dựa trên search query và filter type
   */
  const filteredTasks = tasks.filter((task) => {
    // 1. Lọc theo tìm kiếm
    if (
      searchQuery &&
      !task.text.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    // 2. Lọc theo Loại bộ lọc (Chung hoặc Danh mục)
    if (currentFilter.type === "CARD") {
      switch (currentFilter.value) {
        case "All":
          return !task.deleted;
        case "Important":
          return task.important && !task.deleted;
        case "Completed":
          return task.completed && !task.deleted;
        case "Deleted":
          return task.deleted;
        default:
          return true;
      }
    } else if (currentFilter.type === "CATEGORY") {
      return task.categoryId === currentFilter.value && !task.deleted;
    }

    return true;
  });

  // Gom tất cả state và hàm vào một object để truyền qua Context
  const value = {
    tasks,
    filteredTasks,
    newTaskText,
    searchQuery,
    currentFilter,
    isDrawerOpen,
    selectedTask,
    deleteDialog,
    listHeader: getListHeader(),
    setNewTaskText,
    setSearchQuery,
    setCurrentFilter,
    setIsDrawerOpen,
    setSelectedTask,
    setDeleteDialog,
    addTask,
    toggleComplete,
    toggleImportant,
    openTaskDetails,
    saveSelectedTask,
    openDeleteConfirm,
    confirmDelete,
    closeDeleteConfirm,
    restoreTask,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

/**
 * Hook tùy chỉnh để sử dụng TaskContext một cách nhanh chóng
 */
export const useTask = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTask must be used within a TaskProvider");
  }
  return context;
};
