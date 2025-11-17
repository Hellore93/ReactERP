import { useState, useEffect } from "react";
import { Box, Button, TextField } from "@mui/material";

export function WorkDaySection({ selectedDay, onSave }) {
  const startButtonHide = selectedDay.id == undefined;
  const saveButtonHide = selectedDay.workEnd == undefined && !startButtonHide;
  const formDisabled = selectedDay.workEnd != null;
  const [formState, setFormState] = useState({
    workDate: "",
    workStart: "",
    workEnd: "",
    workDescription: "",
  });

  useEffect(() => {
    if (selectedDay) {
      console.log("selectedDay >>", selectedDay);
      const now = new Date();
      const data = {
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
  };

  const handleSave = () => {
    console.log("save work day", formState);
    onSave(formState)
  };

  return (
    <Box sx={{ mt: 2, minWidth: 340 }}>
      <div style={{ textAlign: "center" }}>
        {startButtonHide && (
          <Button variant="contained" onClick={handleSave}>
            Start day
          </Button>
        )}
        {saveButtonHide && (
          <Button variant="contained" color="success" onClick={handleSave}>
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
        />
      </Box>
    </Box>
  );
}
