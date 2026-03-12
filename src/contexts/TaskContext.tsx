import React, { createContext, useContext, useState, type ReactNode } from "react";
import type { Task, FilterState, DeleteDialogState } from "../types";
import { CATEGORIES_LIST } from "../constants";

interface TaskContextType {
  tasks: Task[];
  filteredTasks: Task[];
  newTaskText: string;
  searchQuery: string;
  currentFilter: FilterState;
  isDrawerOpen: boolean;
  selectedTask: Task | null;
  deleteDialog: DeleteDialogState;
  listHeader: string;

  // Actions
  setNewTaskText: (text: string) => void;
  setSearchQuery: (query: string) => void;
  setCurrentFilter: (filter: FilterState) => void;
  setIsDrawerOpen: (open: boolean) => void;
  setSelectedTask: (task: Task | null) => void;
  setDeleteDialog: (state: DeleteDialogState) => void;

  addTask: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  toggleComplete: (taskId: number) => void;
  toggleImportant: (taskId: number) => void;
  openTaskDetails: (task: Task) => void;
  saveSelectedTask: () => void;
  openDeleteConfirm: (taskId: number, e?: React.MouseEvent) => void;
  confirmDelete: () => void;
  closeDeleteConfirm: () => void;
  restoreTask: (taskId: number, e?: React.MouseEvent) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
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

  const addTask = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newTaskText.trim() !== "") {
      const newTask: Task = {
        id: Date.now(),
        text: newTaskText.trim(),
        important: currentFilter.value === "Important",
        completed: false,
        deleted: false,
        categoryId:
          currentFilter.type === "CATEGORY" ? currentFilter.value : "ca-nhan",
      };

      setTasks([...tasks, newTask]);
      setNewTaskText("");
    }
  };

  const toggleComplete = (taskId: number) => {
    setTasks(
      tasks.map((t) =>
        t.id === taskId ? { ...t, completed: !t.completed } : t,
      ),
    );
  };

  const toggleImportant = (taskId: number) => {
    setTasks(
      tasks.map((t) =>
        t.id === taskId ? { ...t, important: !t.important } : t,
      ),
    );
  };

  const openTaskDetails = (task: Task) => {
    setSelectedTask({ ...task });
    setIsDrawerOpen(true);
  };

  const saveSelectedTask = () => {
    if (selectedTask) {
      setTasks(tasks.map((t) => (t.id === selectedTask.id ? selectedTask : t)));
      setIsDrawerOpen(false);
    }
  };

  const openDeleteConfirm = (taskId: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setDeleteDialog({ open: true, taskId });
  };

  const confirmDelete = () => {
    if (deleteDialog.taskId !== null) {
      setTasks(
        tasks.map((t) =>
          t.id === deleteDialog.taskId ? { ...t, deleted: true } : t,
        ),
      );

      if (selectedTask && selectedTask.id === deleteDialog.taskId) {
        setIsDrawerOpen(false);
      }
    }
    setDeleteDialog({ open: false, taskId: null });
  };

  const closeDeleteConfirm = () => {
    setDeleteDialog({ open: false, taskId: null });
  };

  const restoreTask = (taskId: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setTasks(
      tasks.map((t) => (t.id === taskId ? { ...t, deleted: false } : t)),
    );
  };

  const getListHeader = () => {
    if (currentFilter.type === "CARD") return currentFilter.value;
    const cat = CATEGORIES_LIST.find((c) => c.id === currentFilter.value);
    return cat ? cat.name : "All";
  };

  const filteredTasks = tasks.filter((task) => {
    if (
      searchQuery &&
      !task.text.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

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

export const useTask = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTask must be used within a TaskProvider");
  }
  return context;
};
