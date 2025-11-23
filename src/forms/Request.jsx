import { useState } from "react";
import { ModalCustom } from "../elements/ModalCustom";
import {
  Box,
  Button,
  TextField,
  Snackbar,
  Alert,
  IconButton,
  MenuItem,
} from "@mui/material";

export function Request({ closeEvent, users, onSave }) {
  const [formState, setFormState] = useState({});
  const [errors, setErrors] = useState({});
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const handleSave = () => {
    if (!validate()) return;
    onSave(formState);
    console.log("save", formState);
  };

  const updateField = (field, value) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formState.title || !formState.title.trim()) {
      newErrors.title = "To pole jest wymagane";
    }
    if (!formState.description || !formState.description.trim()) {
      newErrors.description = "To pole jest wymagane";
    }
    if (!formState.recipient || !formState.recipient.trim()) {
      newErrors.recipient = "To pole jest wymagane";
    }
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setToastMessage("Please fill required inputs");
      setToastOpen(true);
      return false;
    }

    return true;
  };

  return (
    <>
      <ModalCustom
        isOpen={true}
        closeEvent={closeEvent}
        title="Request"
        actions={
          <>
            <Button variant="contained" color="success" onClick={handleSave}>
              Save
            </Button>

            <Button variant="contained" onClick={closeEvent}>
              Close
            </Button>
          </>
        }
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "1rem",
          }}
        >
          <TextField
            label="Title"
            error={!!errors.title}
            helperText={errors.title}
            fullWidth
            required
            onChange={(e) => updateField("title", e.target.value)}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "1rem",
          }}
        >
          <TextField
            label="Description"
            error={!!errors.description}
            helperText={errors.description}
            fullWidth
            required
            onChange={(e) => updateField("description", e.target.value)}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "1rem",
          }}
        >
          <TextField
            select
            label="User"
            error={!!errors.recipient}
            helperText={errors.recipient}
            fullWidth
            required
            onChange={(e) => updateField("recipient", e.target.value)}
          >
            {users.map((u) => (
              <MenuItem key={u.id} value={u.id}>
                {u.name} {u.lastname}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </ModalCustom>
      <Snackbar
        open={toastOpen}
        autoHideDuration={3000}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity="warning"
          variant="filled"
          onClose={() => setToastOpen(false)}
        >
          {toastMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
