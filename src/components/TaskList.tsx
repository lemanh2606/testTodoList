import { Box, Typography } from "@mui/material";
import { TaskItem } from "./TaskItem";
import { useTask } from "../contexts/TaskContext";

export function TaskList() {
  const { filteredTasks } = useTask();

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
      {filteredTasks.length === 0 ? (
        <Typography sx={{ color: "#9ca3af", textAlign: "center", mt: 4 }}>
          There are no tasks to display.
        </Typography>
      ) : (
        filteredTasks.map((task) => <TaskItem key={task.id} task={task} />)
      )}
    </Box>
  );
}
