/**
 * ============================================================
 *  DELETE CONFIRM DIALOG - Hộp thoại xác nhận xóa task
 * ============================================================
 *
 * REDUX STATE ĐƯỢC DÙNG:
 *  ┌─────────────────────────────────────────────────────┐
 *  │  READ (useAppSelector):                             │
 *  │    • selectDeleteDialog → { open, taskId }          │
 *  │                                                     │
 *  │  WRITE (dispatch):                                  │
 *  │    • closeDeleteDialog() → đóng dialog, không xóa   │
 *  │    • softDeleteTask(taskId) → đánh dấu deleted=true │
 *  │    • closeDrawer() → đóng Drawer nếu đang mở       │
 *  └─────────────────────────────────────────────────────┘
 *
 * LUỒNG XÓA TASK HOÀN CHỈNH:
 *  1. TaskItem/TaskDrawer → click Xóa
 *     → dispatch(openDeleteDialog(taskId))
 *     → state.ui.deleteDialog = { open: true, taskId }
 *     → Dialog hiển thị
 *
 *  2a. User click "Hủy bỏ"
 *     → dispatch(closeDeleteDialog())
 *     → state.ui.deleteDialog = { open: false, taskId: null }
 *     → Dialog đóng, task KHÔNG bị xóa
 *
 *  2b. User click "Chắc chắn xóa"
 *     → dispatch(softDeleteTask(taskId)) → task.deleted = true
 *     → dispatch(closeDrawer())          → đóng Drawer (nếu đang mở task đó)
 *     → dispatch(closeDeleteDialog())    → đóng Dialog
 *     → Task biến mất khỏi danh sách hiện tại
 *     → Task xuất hiện trong tab "Deleted" (thùng rác)
 * ============================================================
 */

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";

// Redux
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  selectDeleteDialog,
  closeDeleteDialog,
  closeDrawer,
} from "../store/slices/uiSlice";
import { softDeleteTask } from "../store/slices/tasksSlice";

export function DeleteConfirmDialog() {
  // ── Lấy dữ liệu từ Redux store ──────────────────────────
  const dispatch = useAppDispatch();
  const deleteDialog = useAppSelector(selectDeleteDialog);

  /**
   * handleConfirmDelete - Thực hiện xóa sau khi user xác nhận
   *
   * Luồng:
   *  1. softDeleteTask → đánh dấu task.deleted = true trong tasksSlice
   *  2. closeDrawer → đóng Drawer nếu đang xem task vừa xóa
   *  3. closeDeleteDialog → đóng hộp thoại xác nhận
   */
  const handleConfirmDelete = () => {
    if (deleteDialog.taskId !== null) {
      dispatch(softDeleteTask(deleteDialog.taskId)); // Xóa mềm task
      dispatch(closeDrawer()); // Đóng Drawer (task vừa xóa có thể đang mở)
    }
    dispatch(closeDeleteDialog()); // Đóng dialog
  };

  return (
    <Dialog
      open={deleteDialog.open}
      onClose={() => dispatch(closeDeleteDialog())}
      PaperProps={{
        sx: { borderRadius: 4, p: 1, minWidth: { xs: 300, sm: 400 } },
      }}
    >
      <DialogTitle sx={{ fontWeight: 800, fontSize: "1.3rem" }}>
        Xác nhận xóa
      </DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ color: "#374151" }}>
          Bạn có chắc chắn muốn xóa công việc này không? Task này sẽ được
          chuyển vào nằm trong thẻ thùng rác "Deleted".
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ pb: 1, px: 3 }}>
        {/* Hủy bỏ → chỉ đóng dialog, không xóa task */}
        <Button
          onClick={() => dispatch(closeDeleteDialog())}
          sx={{ color: "#6b7280", fontWeight: 700 }}
        >
          Hủy bỏ
        </Button>
        {/* Xác nhận xóa → thực hiện xóa mềm */}
        <Button
          onClick={handleConfirmDelete}
          color="error"
          variant="contained"
          sx={{ fontWeight: 700, boxShadow: "none", borderRadius: 2 }}
        >
          Chắc chắn xóa
        </Button>
      </DialogActions>
    </Dialog>
  );
}
