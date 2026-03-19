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
import { CATEGORIES_LIST } from "../constants";

// Redux
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  selectIsDrawerOpen,
  selectSelectedTask,
  closeDrawer,
  updateSelectedTask,
  openDeleteDialog,
} from "../store/slices/uiSlice";
import { updateTask } from "../store/slices/tasksSlice";

// Menu bên phải để xem và chỉnh sửa chi tiết công việc
export function TaskDrawer() {
  const dispatch = useAppDispatch();
  const isDrawerOpen = useAppSelector(selectIsDrawerOpen);
  const selectedTask = useAppSelector(selectSelectedTask);

  // Lưu các thay đổi vào danh sách chính
  const handleSave = () => {
    if (selectedTask) {
      dispatch(updateTask(selectedTask));
      dispatch(closeDrawer());
    }
  };

  return (
    <Drawer
      anchor="right"
      open={isDrawerOpen}
      onClose={() => dispatch(closeDrawer())}
      PaperProps={{ sx: { width: { xs: "100%", sm: 400 }, p: 4, bgcolor: "#ffffff" } }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 800 }}>Chỉnh sửa Task</Typography>
        <IconButton onClick={() => dispatch(closeDrawer())} sx={{ bgcolor: "#f3f4f6" }}><CloseIcon /></IconButton>
      </Box>
      <Divider sx={{ mb: 4 }} />

      {selectedTask && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3.5, flex: 1 }}>
          <TextField
            label="Tên công việc"
            variant="outlined"
            fullWidth
            multiline
            rows={3}
            value={selectedTask.text}
            onChange={(e) => dispatch(updateSelectedTask({ ...selectedTask, text: e.target.value }))}
          />

          <TextField
            select
            label="Danh mục List (Category)"
            value={selectedTask.categoryId}
            onChange={(e) => dispatch(updateSelectedTask({ ...selectedTask, categoryId: e.target.value }))}
            SelectProps={{ native: true }}
            fullWidth
          >
            {CATEGORIES_LIST.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </TextField>

          <Box sx={{ display: "flex", gap: 2, alignItems: "center", mt: "auto" }}>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => dispatch(openDeleteDialog(selectedTask.id))}
              sx={{ flex: 1, py: 1.2, fontWeight: 700, borderRadius: 2 }}
            >
              Xóa
            </Button>

            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              sx={{ flex: 2, py: 1.2, fontWeight: 700, borderRadius: 2, boxShadow: "none" }}
            >
              Lưu Thay Đổi
            </Button>
          </Box>
        </Box>
      )}
    </Drawer>
  );
}
