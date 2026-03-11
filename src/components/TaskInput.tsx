import { Paper, InputBase } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

interface TaskInputProps {
  newTaskText: string;
  setNewTaskText: (val: string) => void;
  onAddTask: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  visible: boolean;
}

export function TaskInput({
  newTaskText,
  setNewTaskText,
  onAddTask,
  visible,
}: TaskInputProps) {
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
        onChange={(e) => setNewTaskText(e.target.value)}
        onKeyDown={onAddTask}
      />
    </Paper>
  );
}
