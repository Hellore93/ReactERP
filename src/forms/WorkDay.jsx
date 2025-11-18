import { useState, useEffect } from "react";
import { Box, Button, TextField } from "@mui/material";

export function WorkDaySection({ selectedDay, onSave }) {
  const startButtonHide = selectedDay.id == undefined;
  const saveButtonHide =
    selectedDay.workEnd == undefined &&
    !startButtonHide &&
    new Date().toISOString().slice(0, 10) == selectedDay.workDate;

  const formDisabled = selectedDay.workEnd != null;

  const [formState, setFormState] = useState({
    workDate: "",
    workStart: "",
    workEnd: "",
    workDescription: "",
  });

  const [errors, setErrors] = useState({
    workDescription: "",
  });

  useEffect(() => {
    if (selectedDay) {
      const now = new Date();
      const data = {
        id: selectedDay.id ?? "",
        workDate: selectedDay.workDate ?? now.toISOString().slice(0, 10),
        workDescription: selectedDay.workDescription ?? "",
        workEnd: selectedDay.workEnd ?? "",
        workStart: selectedDay.workStart ?? now.toTimeString().slice(0, 5),
      };
      setFormState(data);
    }
  }, [selectedDay]);

  const updateField = (field) => (e) => {
    setFormState((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateDescription = () => {
    if (!formState.workDescription || formState.workDescription.trim().length < 10) {
      setErrors((prev) => ({
        ...prev,
        workDescription: "Opis musi mieć minimum 10 znaków.",
      }));
      return false;
    }
    return true;
  };

  const handleStarSave = () => {
    onSave(formState);
  };

  const handleEndSave = () => {
    if (!validateDescription()) return;

    const end = new Date().toTimeString().slice(0, 5);

    const payload = {
      ...formState,
      workEnd: end,
    };

    setFormState((prev) => ({
      ...prev,
      workEnd: end,
    }));

    onSave(payload);
  };

  return (
    <Box sx={{ mt: 2, minWidth: 310 }}>
      <div style={{ textAlign: "center" }}>
        {startButtonHide && (
          <Button variant="contained" onClick={handleStarSave}>
            Start day
          </Button>
        )}
        {saveButtonHide && (
          <Button variant="contained" color="success" onClick={handleEndSave}>
            End day
          </Button>
        )}
      </div>
      <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          label="Data pracy"
          type="date"
          disabled
          InputLabelProps={{ shrink: true }}
          value={formState.workDate}
        />

        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            label="Start"
            type="time"
            disabled
            InputLabelProps={{ shrink: true }}
            fullWidth
            value={formState.workStart}
          />
          <TextField
            label="Koniec"
            type="time"
            disabled
            InputLabelProps={{ shrink: true }}
            fullWidth
            value={formState.workEnd}
          />
        </Box>

        <TextField
          label="Opis pracy"
          multiline
          disabled={formDisabled}
          minRows={2}
          value={formState.workDescription}
          onChange={updateField("workDescription")}
          error={!!errors.workDescription}
          helperText={errors.workDescription}
        />
      </Box>
    </Box>
  );
}
