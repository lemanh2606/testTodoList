/**
 * ============================================================
 *  TASK LIST - Hiển thị danh sách task đã được lọc
 * ============================================================
 *
 * REDUX STATE ĐƯỢC DÙNG:
 *  ┌─────────────────────────────────────────────────────┐
 *  │  READ (useAppSelector):                             │
 *  │    • selectFilteredTasks → filteredTasks            │
 *  │      (selector kết hợp tasks + filter + search)     │
 *  └─────────────────────────────────────────────────────┘
 *
 * Component chỉ re-render khi:
 *  - state.tasks thay đổi (thêm/sửa/xóa task)
 *  - state.ui.currentFilter thay đổi (đổi bộ lọc)
 *  - state.search.searchQuery thay đổi (tìm kiếm)
 * ============================================================
 */

import { Box, Typography } from "@mui/material";
import { TaskItem } from "./TaskItem";

// Redux
import { useAppSelector } from "../store/hooks";
import { selectFilteredTasks } from "../store/selectors";

export function TaskList() {
  // selectFilteredTasks kết hợp tasks + currentFilter + searchQuery
  // để trả về đúng danh sách task cần hiển thị
  const filteredTasks = useAppSelector(selectFilteredTasks);

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
