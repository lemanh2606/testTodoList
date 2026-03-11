export interface Task {
  id: number;
  text: string;
  important: boolean;
  completed: boolean;
  deleted: boolean;
  categoryId: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface FilterState {
  type: "CARD" | "CATEGORY";
  value: string;
}

export interface DeleteDialogState {
  open: boolean;
  taskId: number | null;
}
