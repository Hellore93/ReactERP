import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export const ModalCustom = ({
  isOpen,
  closeEvent,
  title,
  children,
  actions,
  maxWidth = "sm",
  fullWidth = true,
}) => {
  return (
    <Dialog
      open={isOpen}
      onClose={closeEvent}
      fullWidth={fullWidth}
      maxWidth={maxWidth}
    >
      {title && (
        <DialogTitle
          sx={{ m: 0, p: 2, textAlign: "center", position: "relative" }}
        >
          {title}
          <IconButton
            aria-label="close"
            onClick={closeEvent}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
      )}

      <DialogContent dividers>{children}</DialogContent>

      <DialogActions sx={{ justifyContent: "center" }}>
        {actions ? (
          actions
        ) : (
          <Button onClick={closeEvent} variant="outlined">
            Zamknij
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};