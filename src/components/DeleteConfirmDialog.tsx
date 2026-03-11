import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";

interface DeleteConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteConfirmDialog({
  open,
  onClose,
  onConfirm,
}: DeleteConfirmDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
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
        <Button onClick={onClose} sx={{ color: "#6b7280", fontWeight: 700 }}>
          Hủy bỏ
        </Button>
        <Button
          onClick={onConfirm}
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
