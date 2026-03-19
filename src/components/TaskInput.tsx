import { Paper, InputBase } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import type React from "react";

// Redux
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { selectNewTaskText, setNewTaskText, clearNewTaskText } from "../store/slices/searchSlice";
import { selectCurrentFilter } from "../store/slices/uiSlice";
import { addTask } from "../store/slices/tasksSlice";
import type { Task, TaskInputProps } from "../types";

// Ô nhập liệu để thêm công việc mới
export function TaskInput({ visible }: TaskInputProps) {
  // ── Lấy dữ liệu từ Redux store ──────────────────────────
  const dispatch = useAppDispatch();
  const newTaskText = useAppSelector(selectNewTaskText);
  const currentFilter = useAppSelector(selectCurrentFilter);

  // ── Xử lý khi user nhấn Enter ───────────────────────────
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newTaskText.trim() !== "") {
      // Tạo Task mới với các giá trị mặc định thông minh
      const newTask: Task = {
        id: Date.now(), // ID duy nhất dựa trên timestamp
        text: newTaskText.trim(),
        // Nếu đang ở tab "Important" → task mới cũng là quan trọng
        important: currentFilter.value === "Important",
        completed: false,
        deleted: false,
        // Nếu đang xem theo danh mục → task mới thuộc danh mục đó
        // Ngược lại → mặc định là "Cá nhân"
        categoryId:
          currentFilter.type === "CATEGORY"
            ? currentFilter.value
            : "ca-nhan",
      };

      // Bước 4: Dispatch action thêm task vào Redux store
      dispatch(addTask(newTask));

      // Bước 5: Reset ô nhập về trống
      dispatch(clearNewTaskText());
    }
  };

  if (!visible) return null;

  return (
    <Paper
      sx={{
        p: "10px 16px",
        display: "flex",
        alignItems: "center",
        width: "100%",
        borderRadius: 3,
        boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        border: "1px solid #f3f4f6",
        bgcolor: "#ffffff",
        transition: "box-shadow 0.2s",
      }}
    >
      <AddIcon sx={{ color: "#6b7280", mr: 1, fontSize: 22 }} />
      <InputBase
        sx={{ flex: 1, fontSize: 15, color: "#374151" }}
        placeholder="Add new task"
        value={newTaskText}
        // onChange: mỗi keystroke → dispatch(setNewTaskText)
        onChange={(e) => dispatch(setNewTaskText(e.target.value))}
        // onKeyDown: nhấn Enter → tạo task mới
        onKeyDown={handleKeyDown}
      />
    </Paper>
  );
}
