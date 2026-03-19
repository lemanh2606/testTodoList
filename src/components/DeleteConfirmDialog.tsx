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

// Hộp thoại xác nhận trước khi xóa công việc
export function DeleteConfirmDialog() {
  const dispatch = useAppDispatch();
  const deleteDialog = useAppSelector(selectDeleteDialog);

  // Thực hiện xóa mềm (chuyển vào thùng rác)
  const handleConfirmDelete = () => {
    if (deleteDialog.taskId !== null) {
      dispatch(softDeleteTask(deleteDialog.taskId));
      dispatch(closeDrawer());
    }
    dispatch(closeDeleteDialog());
  };

  return (
    <Dialog
      open={deleteDialog.open}
      onClose={() => dispatch(closeDeleteDialog())}
      PaperProps={{ sx: { borderRadius: 4, p: 1, minWidth: { xs: 300, sm: 400 } } }}
    >
      <DialogTitle sx={{ fontWeight: 800, fontSize: "1.3rem" }}>Xác nhận xóa</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ color: "#374151" }}>
          Bạn có chắc chắn muốn xóa công việc này không? Task này sẽ được chuyển vào thẻ thùng rác "Deleted".
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ pb: 1, px: 3 }}>
        <Button onClick={() => dispatch(closeDeleteDialog())} sx={{ color: "#6b7280", fontWeight: 700 }}>Hủy bỏ</Button>
        <Button onClick={handleConfirmDelete} color="error" variant="contained" sx={{ fontWeight: 700, boxShadow: "none", borderRadius: 2 }}>Chắc chắn xóa</Button>
      </DialogActions>
    </Dialog>
  );
}
