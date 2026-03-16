/**
 * ============================================================
 *  APP COMPONENT - Component gốc của ứng dụng
 * ============================================================
 *
 * Trước (Context API):
 *   const { listHeader, currentFilter } = useTask();
 *
 * Sau (Redux):
 *   const listHeader = useAppSelector(selectListHeader);
 *   const currentFilter = useAppSelector(selectCurrentFilter);
 *
 * Sự khác biệt:
 *  - useAppSelector chỉ re-render component khi đúng phần state
 *    mà nó đang subscribe thay đổi (granular re-render)
 *  - Context: mọi consumer re-render khi bất kỳ giá trị nào thay đổi
 * ============================================================
 */

import { Box, ThemeProvider, CssBaseline, Typography } from "@mui/material";
import { Sidebar } from "./components/Sidebar";
import { TaskInput } from "./components/TaskInput";
import { TaskList } from "./components/TaskList";
import { TaskDrawer } from "./components/TaskDrawer";
import { DeleteConfirmDialog } from "./components/DeleteConfirmDialog";
import { theme } from "./theme";

// Redux hooks và selectors
import { useAppSelector } from "./store/hooks";
import { selectCurrentFilter } from "./store/slices/uiSlice";
import { selectListHeader } from "./store/selectors";

export default function App() {
  // Lấy dữ liệu từ Redux store
  // Component chỉ re-render khi listHeader hoặc currentFilter thay đổi
  const listHeader = useAppSelector(selectListHeader);
  const currentFilter = useAppSelector(selectCurrentFilter);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f3f4f6" }}>
        <Box
          sx={{
            display: "flex",
            width: "100%",
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          <Sidebar />

          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: 3,
              p: { xs: 3, md: 4, lg: 5 },
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {/* Tiêu đề thay đổi theo filter đang chọn */}
              <Typography variant="h4" sx={{ fontWeight: 800, color: "#111827" }}>
                {listHeader}
              </Typography>

              {/* Ẩn ô nhập task khi đang xem thùng rác */}
              <TaskInput visible={currentFilter.value !== "Deleted"} />

              <TaskList />
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Drawer xem/sửa task - render ngoài flow để overlay toàn màn hình */}
      <TaskDrawer />

      {/* Dialog xác nhận xóa */}
      <DeleteConfirmDialog />
    </ThemeProvider>
  );
}
