import { Box, Typography } from "@mui/material";
import { TaskItem } from "./TaskItem";
import type { Task } from "../types";

interface TaskListProps {
  filteredTasks: Task[];
  listHeader: string;
  isDeletedFilter: boolean;
  onOpenDetails: (task: Task) => void;
  onToggleComplete: (id: number) => void;
  onToggleImportant: (id: number) => void;
  onRestoreTask?: (id: number, e?: React.MouseEvent) => void; // Optional if we want to restore from list
}

export function TaskList({
  filteredTasks,
  listHeader,
  isDeletedFilter,
  onOpenDetails,
  onToggleComplete,
  onToggleImportant,
  onRestoreTask,
}: TaskListProps) {
  return (
    <>
      <Typography variant="h4" sx={{ fontWeight: 800, color: "#111827" }}>
        {listHeader}
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        {filteredTasks.length === 0 ? (
          <Typography sx={{ color: "#9ca3af", textAlign: "center", mt: 4 }}>
            There are no tasks to display.
          </Typography>
        ) : (
          filteredTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onOpenDetails={onOpenDetails}
              onToggleComplete={onToggleComplete}
              onToggleImportant={onToggleImportant}
            />
          ))
        )}
      </Box>
    </>
  );
}
