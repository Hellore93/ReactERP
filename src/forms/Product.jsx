import { ModalCustom } from "../elements/ModalCustom";
import {
  Box,
  Button,
  TextField,
  Snackbar,
  Alert,
  IconButton,
  MenuItem
} from "@mui/material";
import { useState, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";

export const Product = ({ closeEvent, clickedProduct, onSave, picklists }) => {
  const [formDisabled, setFormDisabled] = useState(true);
  const [formState, setFormState] = useState({});
  const [initialState, setInitialState] = useState({});
  const [errors, setErrors] = useState({});
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(formState.pictureUrl || "");

  useEffect(() => {
    if (clickedProduct) {
      const data = {
        id: clickedProduct.id ?? null,
        name: clickedProduct.name ?? "",
        description: clickedProduct.description ?? "",
        quantityOwned: clickedProduct.quantityOwned ?? "",
        quantityRequested: clickedProduct.quantityRequested ?? "",
        pictureUrl: clickedProduct.pictureUrl ?? "",
        unit: clickedProduct.unit ?? ""
      };

      setFormState(data);
      setInitialState(data);
      setFormDisabled(true);
    } else {
      const emptyData = {
        name: "",
        description: "",
      };

      setFormState(emptyData);
      setInitialState(emptyData);
      setFormDisabled(false);
    }
  }, [clickedProduct]);

  const updateField = (field, value) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };
  const handleEdit = () => setFormDisabled(false);
  const handleSave = () => {
    if (!validate()) return;
    onSave(formState, imageFile);
  };
  const hasChanges =
    JSON.stringify(formState) !== JSON.stringify(initialState) || imageFile;

  const validate = () => {
    const newErrors = {};

    if (!formState.name || !formState.name.trim()) {
      newErrors.name = "To pole jest wymagane";
    }
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setToastMessage("Uzupełnij wymagane pola przed zapisem.");
      setToastOpen(true);
      return false;
    }

    return true;
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const imageSrc = previewUrl || formState?.pictureUrl || "";
  const isSaveButtonVisible = !formDisabled || imageFile;

  return (
    <>
      <ModalCustom
        isOpen={true}
        closeEvent={closeEvent}
        title="Product"
        actions={
          <>
            {isSaveButtonVisible && (
              <Button
                variant="contained"
                color="success"
                onClick={handleSave}
                disabled={!hasChanges}
              >
                Save
              </Button>
            )}
            {!isSaveButtonVisible && (
              <Button variant="contained" color="success" onClick={handleEdit}>
                Edit
              </Button>
            )}
            <Button variant="contained" onClick={closeEvent}>
              Close
            </Button>
          </>
        }
      >
        {imageSrc && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center", // <-- centrowanie w poziomie
              marginBottom: "1rem",
            }}
          >
            <Box
              sx={{
                position: "relative", // dla X
                display: "inline-block",
              }}
            >
              <img
                src={previewUrl || formState.pictureUrl}
                alt={formState.name}
                style={{
                  maxWidth: "8rem",
                  borderRadius: "6px",
                  display: "block",
                }}
              />

              <IconButton
                size="small"
                onClick={() => {
                  setPreviewUrl("");
                  setImageFile(null);
                  setFormState((prev) => ({ ...prev, pictureUrl: "" }));
                }}
                sx={{
                  position: "absolute",
                  top: 4,
                  right: 4,
                  background: "rgba(0,0,0,0.6)",
                  color: "white",
                  width: 24,
                  height: 24,
                  "&:hover": {
                    background: "rgba(0,0,0,0.8)",
                  },
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        )}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "1rem",
          }}
        >
          <Button variant="outlined" component="label">
            Choice Picture
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleImageChange}
            />
          </Button>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Name"
            value={formState.name}
            disabled={formDisabled}
            error={!!errors.name}
            helperText={errors.name}
            fullWidth
            required
            onChange={(e) => updateField("name", e.target.value)}
          />

          <TextField
            label="Description"
            value={formState.description}
            disabled={formDisabled}
            fullWidth
            multiline
            onChange={(e) => updateField("description", e.target.value)}
          />

          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="Quantity"
              type="number"
              disabled={formDisabled}
              fullWidth
              value={formState.quantityOwned}
              onChange={(e) => updateField("quantityOwned", e.target.value)}
            />

            <TextField
            select
            label="Unit"
            value={formState.unit ?? ""}
            disabled={formDisabled}
            fullWidth
            onChange={(e) => updateField("unit", e.target.value)}
          >
            {picklists.unit.map((u) => (
              <MenuItem key={u} value={u}>
                {u}
              </MenuItem>
            ))}
          </TextField>

            {/* <TextField
              label="Requested Quantity"
              type="number"
              disabled={formDisabled}
              fullWidth
              value={formState.quantityRequested}
              onChange={(e) => updateField("quantityRequested", e.target.value)}
            /> */}
          </Box>
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
};
