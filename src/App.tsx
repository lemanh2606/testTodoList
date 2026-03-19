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

// Component gốc của ứng dụng Todo List
export default function App() {
  const listHeader = useAppSelector(selectListHeader);
  const currentFilter = useAppSelector(selectCurrentFilter);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f3f4f6" }}>
        <Box sx={{ display: "flex", width: "100%", flexDirection: { xs: "column", md: "row" } }}>
          <Sidebar />

          <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 3, p: { xs: 3, md: 4, lg: 5 } }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {/* Tiêu đề danh sách */}
              <Typography variant="h4" sx={{ fontWeight: 800, color: "#111827" }}>
                {listHeader}
              </Typography>

              {/* Ô nhập task mới (ẩn khi ở thùng rác) */}
              <TaskInput visible={currentFilter.value !== "Deleted"} />

              {/* Danh sách công việc */}
              <TaskList />
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Các thành phần giao diện khác */}
      <TaskDrawer />
      <DeleteConfirmDialog />
    </ThemeProvider>
  );
}
