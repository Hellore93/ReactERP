import { Dialog, Box, Typography, Button } from "@mui/material";

export function ConfirmDialog({
  open,
  title = "Confirm",
  message,
  confirmText = "OK",
  cancelText = "NO",
  onConfirm,
  onCancel,
}) {
  const handleClose = (confirmed) => {
    if (confirmed) {
      onConfirm?.();
    } else {
      onCancel?.();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => handleClose(false)}
      PaperProps={{
        sx: {
          borderRadius: "18px",
          minWidth: 280,
          maxWidth: 360,
          m: 0,
          p: 0,
        },
      }}
    >
      <Box sx={{ p: 2.5, pb: 1.5 }}>
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: 600, textAlign: "center", mb: 1 }}
        >
          {title}
        </Typography>
        <Typography
          variant="body2"
          sx={{ textAlign: "center", color: "text.secondary" }}
        >
          {message}
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          borderTop: "1px solid #eee",
          "& > button": { flex: 1, borderRadius: 0 },
        }}
      >
        <Button
          onClick={() => handleClose(false)}
          sx={{
            py: 1.2,
            borderRight: "1px solid #eee",
            color: "text.primary",
          }}
        >
          {cancelText}
        </Button>
        <Button
          onClick={() => handleClose(true)}
          sx={{
            py: 1.2,
            color: "#1976d2",
            fontWeight: 600,
          }}
        >
          {confirmText}
        </Button>
      </Box>
    </Dialog>
  );
}
