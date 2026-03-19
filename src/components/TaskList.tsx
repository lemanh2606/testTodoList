import { Box, Typography } from "@mui/material";
import { TaskItem } from "./TaskItem";

// Redux
import { useAppSelector } from "../store/hooks";
import { selectFilteredTasks } from "../store/selectors";

// Hiển thị danh sách các công việc đã lọc theo tìm kiếm hoặc bộ lọc
export function TaskList() {
  const filteredTasks = useAppSelector(selectFilteredTasks);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
      {filteredTasks.length === 0 ? (
        <Typography sx={{ color: "#9ca3af", textAlign: "center", mt: 4 }}>
          Không có công việc nào để hiển thị.
        </Typography>
      ) : (
        filteredTasks.map((task) => <TaskItem key={task.id} task={task} />)
      )}
    </Box>
  );
}
