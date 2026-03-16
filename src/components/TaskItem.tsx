/**
 * ============================================================
 *  TASK ITEM - Một dòng task trong danh sách
 * ============================================================
 *
 * REDUX STATE ĐƯỢC DÙNG:
 *  ┌─────────────────────────────────────────────────────┐
 *  │  READ: nhận task qua props (không cần selector)     │
 *  │                                                     │
 *  │  WRITE (dispatch):                                  │
 *  │    • toggleComplete(taskId) → đánh dấu hoàn thành  │
 *  │    • toggleImportant(taskId) → gắn/bỏ sao          │
 *  │    • openDrawer(task) → mở drawer xem/sửa task     │
 *  └─────────────────────────────────────────────────────┘
 *
 * LUỒNG KHI CLICK VÀO TASK (mở Drawer):
 *  TaskItem → click → dispatch(openDrawer(task))
 *           → state.ui.isDrawerOpen = true
 *           → state.ui.selectedTask = {...task} (clone)
 *           → TaskDrawer tự render vì subscribe isDrawerOpen
 *
 * LUỒNG KHI TOGGLE COMPLETE (checkbox):
 *  TaskItem → click checkbox → e.stopPropagation() (không mở Drawer)
 *           → dispatch(toggleComplete(task.id))
 *           → tasksSlice.reducer cập nhật task.completed
 *           → TaskItem re-render với icon mới
 * ============================================================
 */

import { Paper, IconButton, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import type { Task } from "../types";

// Redux
import { useAppDispatch } from "../store/hooks";
import { toggleComplete, toggleImportant } from "../store/slices/tasksSlice";
import { openDrawer } from "../store/slices/uiSlice";

interface TaskItemProps {
  task: Task;
}

export function TaskItem({ task }: TaskItemProps) {
  const dispatch = useAppDispatch();

  return (
    <Paper
      // Click vào task → mở Drawer để xem/sửa chi tiết
      onClick={() => dispatch(openDrawer(task))}
      sx={{
        p: "6px 16px",
        display: "flex",
        alignItems: "center",
        width: "100%",
        borderRadius: 3,
        boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        border: "1px solid #f3f4f6",
        opacity: task.completed ? 0.7 : 1,
        cursor: "pointer",
        transition: "all 0.2s",
        "&:hover": {
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          transform: "translateY(-1px)",
        },
      }}
    >
      {/* ── Checkbox hoàn thành ──────────────────────────────
          stopPropagation: ngăn event nổi lên → không mở Drawer
          dispatch(toggleComplete): đảo ngược task.completed
      ─────────────────────────────────────────────────── */}
      <IconButton
        size="small"
        onClick={(e) => {
          e.stopPropagation(); // Ngăn click lan ra Paper (không mở Drawer)
          dispatch(toggleComplete(task.id));
        }}
        sx={{
          mr: 1,
          color: task.completed ? "#10b981" : "#d1d5db",
        }}
      >
        {task.completed ? (
          <CheckCircleIcon />
        ) : (
          <RadioButtonUncheckedIcon />
        )}
      </IconButton>

      {/* ── Tên task ─────────────────────────────────────── */}
      <Typography
        sx={{
          flex: 1,
          fontSize: 15,
          fontWeight: 500,
          color: task.completed ? "#6b7280" : "#1f2937",
          textDecoration: task.completed ? "line-through" : "none",
          ml: 1,
        }}
      >
        {task.text}
      </Typography>

      {/* ── Nút gắn/bỏ sao (quan trọng) ────────────────────
          stopPropagation: ngăn mở Drawer khi click sao
          dispatch(toggleImportant): đảo ngược task.important
      ─────────────────────────────────────────────────── */}
      <IconButton
        size="small"
        onClick={(e) => {
          e.stopPropagation(); // Ngăn click lan ra Paper (không mở Drawer)
          dispatch(toggleImportant(task.id));
        }}
        sx={{
          mr: 1,
          color: task.important ? "#f59e0b" : "#d1d5db",
        }}
      >
        {task.important ? <StarIcon /> : <StarBorderIcon />}
      </IconButton>
    </Paper>
  );
}
