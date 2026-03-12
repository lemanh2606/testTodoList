import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  TextField,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTask } from "../contexts/TaskContext";
import { CATEGORIES_LIST } from "../constants";

export function TaskDrawer() {
  const {
    isDrawerOpen,
    setIsDrawerOpen,
    selectedTask,
    setSelectedTask,
    saveSelectedTask,
    openDeleteConfirm,
  } = useTask();

  return (
    <Drawer
      anchor="right"
      open={isDrawerOpen}
      onClose={() => setIsDrawerOpen(false)}
      PaperProps={{
        sx: { width: { xs: "100%", sm: 400 }, p: 4, bgcolor: "#ffffff" },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 800 }}>
          Chỉnh sửa Task
        </Typography>
        <IconButton
          onClick={() => setIsDrawerOpen(false)}
          sx={{ bgcolor: "#f3f4f6" }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider sx={{ mb: 4 }} />
      {selectedTask && (
        <Box
          sx={{ display: "flex", flexDirection: "column", gap: 3.5, flex: 1 }}
        >
          <TextField
            label="Tên công việc"
            variant="outlined"
            fullWidth
            multiline
            rows={3}
            value={selectedTask.text}
            onChange={(e) =>
              setSelectedTask({ ...selectedTask, text: e.target.value })
            }
          />

          <TextField
            select
            label="Danh mục List (Category)"
            value={selectedTask.categoryId}
            onChange={(e) =>
              setSelectedTask({ ...selectedTask, categoryId: e.target.value })
            }
            SelectProps={{ native: true }}
            fullWidth
          >
            {CATEGORIES_LIST.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </TextField>

          <Box
            sx={{ display: "flex", gap: 2, alignItems: "center", mt: "auto" }}
          >
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => openDeleteConfirm(selectedTask.id)}
              sx={{ flex: 1, py: 1.2, fontWeight: 700, borderRadius: 2 }}
            >
              Xóa
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={saveSelectedTask}
              sx={{
                flex: 2,
                py: 1.2,
                fontWeight: 700,
                borderRadius: 2,
                boxShadow: "none",
              }}
            >
              Lưu Thay Đổi
            </Button>
          </Box>
        </Box>
      )}
    </Drawer>
  );
}
