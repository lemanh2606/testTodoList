import { Paper, IconButton, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import type { Task } from "../types";
import { useTask } from "../contexts/TaskContext";

interface TaskItemProps {
  task: Task;
}

export function TaskItem({ task }: TaskItemProps) {
  const { toggleComplete, toggleImportant, openTaskDetails } = useTask();

  return (
    <Paper
      onClick={() => openTaskDetails(task)}
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
      <IconButton
        size="small"
        onClick={(e) => {
          e.stopPropagation();
          toggleComplete(task.id);
        }}
        sx={{
          mr: 1,
          color: task.completed ? "#10b981" : "#d1d5db",
        }}
      >
        {task.completed ? <CheckCircleIcon /> : <RadioButtonUncheckedIcon />}
      </IconButton>

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

      <IconButton
        size="small"
        onClick={(e) => {
          e.stopPropagation();
          toggleImportant(task.id);
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
