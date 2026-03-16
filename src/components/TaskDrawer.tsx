/**
 * ============================================================
 *  TASK DRAWER - Panel bên phải để xem/chỉnh sửa task
 * ============================================================
 *
 * REDUX STATE ĐƯỢC DÙNG:
 *  ┌─────────────────────────────────────────────────────┐
 *  │  READ (useAppSelector):                             │
 *  │    • selectIsDrawerOpen → isDrawerOpen              │
 *  │    • selectSelectedTask → selectedTask              │
 *  │                                                     │
 *  │  WRITE (dispatch):                                  │
 *  │    • closeDrawer() → đóng Drawer                    │
 *  │    • updateSelectedTask(task) → cập nhật local edit │
 *  │    • updateTask(task) → lưu task vào store          │
 *  │    • openDeleteDialog(taskId) → mở dialog xóa      │
 *  └─────────────────────────────────────────────────────┘
 *
 * LUỒNG KHI USER SỬA VÀ LƯU:
 *  1. TaskItem click → dispatch(openDrawer(task)) → selectedTask = {...task}
 *  2. User gõ sửa text → dispatch(updateSelectedTask({...selectedTask, text}))
 *     (chỉ cập nhật local copy trong state.ui.selectedTask, KHÔNG ảnh hưởng state.tasks)
 *  3. User click "Lưu Thay Đổi" → dispatch(updateTask(selectedTask))
 *     → tasksSlice cập nhật task gốc trong state.tasks
 *     → dispatch(closeDrawer()) → Drawer đóng
 *
 * Tại sao cần 2 bước (updateSelectedTask rồi mới updateTask)?
 *  → Cho phép người dùng sửa và hủy (Cancel) mà không ảnh hưởng dữ liệu gốc
 *  → selectedTask trong uiSlice là "bản nháp" của task đang sửa
 * ============================================================
 */

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

export function TaskDrawer() {
  // ── Lấy dữ liệu từ Redux store ──────────────────────────
  const dispatch = useAppDispatch();
  const isDrawerOpen = useAppSelector(selectIsDrawerOpen);
  const selectedTask = useAppSelector(selectSelectedTask);

  /**
   * handleSave - Lưu các thay đổi từ Drawer vào store chính
   *
   * Luồng:
   *  dispatch(updateTask(selectedTask)) → tasksSlice cập nhật task gốc
   *  dispatch(closeDrawer()) → đóng Drawer
   */
  const handleSave = () => {
    if (selectedTask) {
      dispatch(updateTask(selectedTask)); // Lưu vào state.tasks
      dispatch(closeDrawer());            // Đóng Drawer
    }
  };

  return (
    <Drawer
      anchor="right"
      open={isDrawerOpen}
      // Đóng khi click overlay phía sau
      onClose={() => dispatch(closeDrawer())}
      PaperProps={{
        sx: { width: { xs: "100%", sm: 400 }, p: 4, bgcolor: "#ffffff" },
      }}
    >
      {/* ── Header Drawer ────────────────────────────────── */}
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
          onClick={() => dispatch(closeDrawer())}
          sx={{ bgcolor: "#f3f4f6" }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider sx={{ mb: 4 }} />

      {/* ── Form chỉnh sửa (chỉ hiển thị khi có task được chọn) ── */}
      {selectedTask && (
        <Box
          sx={{ display: "flex", flexDirection: "column", gap: 3.5, flex: 1 }}
        >
          {/* ── Tên công việc ─────────────────────────────────
              onChange → dispatch(updateSelectedTask({...selectedTask, text}))
              → Cập nhật local copy (state.ui.selectedTask)
              → Chưa ảnh hưởng state.tasks (task gốc)
          ─────────────────────────────────────────────────── */}
          <TextField
            label="Tên công việc"
            variant="outlined"
            fullWidth
            multiline
            rows={3}
            value={selectedTask.text}
            onChange={(e) =>
              dispatch(
                updateSelectedTask({ ...selectedTask, text: e.target.value })
              )
            }
          />

          {/* ── Danh mục ──────────────────────────────────────
              onChange → dispatch(updateSelectedTask({...selectedTask, categoryId}))
              → Cập nhật local copy (state.ui.selectedTask)
          ─────────────────────────────────────────────────── */}
          <TextField
            select
            label="Danh mục List (Category)"
            value={selectedTask.categoryId}
            onChange={(e) =>
              dispatch(
                updateSelectedTask({
                  ...selectedTask,
                  categoryId: e.target.value,
                })
              )
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

          {/* ── Actions ───────────────────────────────────────*/}
          <Box
            sx={{ display: "flex", gap: 2, alignItems: "center", mt: "auto" }}
          >
            {/* Nút Xóa → mở Dialog xác nhận xóa */}
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => dispatch(openDeleteDialog(selectedTask.id))}
              sx={{ flex: 1, py: 1.2, fontWeight: 700, borderRadius: 2 }}
            >
              Xóa
            </Button>

            {/* Nút Lưu → cập nhật task gốc trong store */}
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
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
