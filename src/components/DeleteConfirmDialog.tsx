import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import { useTask } from "../contexts/TaskContext";

export function DeleteConfirmDialog() {
  const { deleteDialog, closeDeleteConfirm, confirmDelete } = useTask();

  return (
    <Dialog
      open={deleteDialog.open}
      onClose={closeDeleteConfirm}
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
        <Button
          onClick={closeDeleteConfirm}
          sx={{ color: "#6b7280", fontWeight: 700 }}
        >
          Hủy bỏ
        </Button>
        <Button
          onClick={confirmDelete}
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
