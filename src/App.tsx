import { Box, ThemeProvider, CssBaseline, Typography } from "@mui/material";

// Đưa components ra ngoài App
import { Sidebar } from "./components/Sidebar";
import { TaskInput } from "./components/TaskInput";
import { TaskList } from "./components/TaskList";
import { TaskDrawer } from "./components/TaskDrawer";
import { DeleteConfirmDialog } from "./components/DeleteConfirmDialog";

// Types, Constants và Theme
import { theme } from "./theme";
import { useTask } from "./contexts/TaskContext";

export default function App() {
  const { listHeader, currentFilter } = useTask();

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
              {/* Task Header & Task List sẽ được handle trong TaskList */}
              <Typography
                variant="h4"
                sx={{ fontWeight: 800, color: "#111827" }}
              >
                {listHeader}
              </Typography>

              <TaskInput visible={currentFilter.value !== "Deleted"} />

              <TaskList />
            </Box>
          </Box>
        </Box>
      </Box>

      <TaskDrawer />

      <DeleteConfirmDialog />
    </ThemeProvider>
  );
}
