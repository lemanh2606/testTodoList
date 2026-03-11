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
import type { Task, Category } from "../types";

interface TaskDrawerProps {
  open: boolean;
  onClose: () => void;
  task: Task | null;
  onChangeTask: (task: Task) => void;
  onSave: () => void;
  onDeleteRequest: (taskId: number) => void;
  categoriesList: Category[];
}

export function TaskDrawer({
  open,
  onClose,
  task,
  onChangeTask,
  onSave,
  onDeleteRequest,
  categoriesList,
}: TaskDrawerProps) {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
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
        <IconButton onClick={onClose} sx={{ bgcolor: "#f3f4f6" }}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider sx={{ mb: 4 }} />
      {task && (
        <Box
          sx={{ display: "flex", flexDirection: "column", gap: 3.5, flex: 1 }}
        >
          <TextField
            label="Tên công việc"
            variant="outlined"
            fullWidth
            multiline
            rows={3}
            value={task.text}
            onChange={(e) => onChangeTask({ ...task, text: e.target.value })}
          />

          <TextField
            select
            label="Danh mục List (Category)"
            value={task.categoryId}
            onChange={(e) =>
              onChangeTask({ ...task, categoryId: e.target.value })
            }
            SelectProps={{ native: true }}
            fullWidth
          >
            {categoriesList.map((cat) => (
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
              onClick={() => onDeleteRequest(task.id)}
              sx={{ flex: 1, py: 1.2, fontWeight: 700, borderRadius: 2 }}
            >
              Xóa
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={onSave}
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
