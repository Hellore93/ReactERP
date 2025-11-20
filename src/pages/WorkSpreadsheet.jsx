import { useState, useEffect, useMemo } from "react";
import { Box, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { QueryService } from "../services/QueryService";

export function WorkSpreadsheet({ year, monthIndex }) {
  const [hours, setHours] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [selectedUser, setSelectedUser] = useState("all");

  const getData = async () => {
    const hoursResp = await QueryService.getWorkingHoursByUserAndMonth(
      year,
      monthIndex
    );
    const profilesResp = await QueryService.getAllRecordsByObjectName(
      "Profiles"
    );

    setHours(hoursResp);
    setProfiles(profilesResp);
  };

  useEffect(() => {
    getData();
  }, [year, monthIndex]);

  const enriched = useMemo(() => {
    return hours
      .map((h) => ({
        ...h,
        user: profiles.find((p) => p.id === h.userId) || null,
      }))
      .filter((row) => {
        if (selectedUser === "all") return true;
        return row.userId === selectedUser;
      })
      .sort((a, b) => new Date(a.workDate) - new Date(b.workDate));
  }, [hours, profiles, selectedUser]);

  const calculateDuration = (start, end) => {
    if (!start || !end) return "-";

    const s = new Date(`2000-01-01T${start}`);
    const e = new Date(`2000-01-01T${end}`);
    const diffMinutes = (e - s) / 1000 / 60;

    let hours = Math.floor(diffMinutes / 60);
    let minutes = Math.round(diffMinutes % 60);
    if (minutes === 60) {
      hours += 1;
      minutes = 0;
    }

    return `${hours}h ${String(minutes).padStart(2, "0")}m`;
  };

  const getTotalDurationLabel = (rows) => {
    let totalMinutes = 0;

    rows.forEach((row) => {
      if (!row.workStart || !row.workEnd) return;

      const s = new Date(`2000-01-01T${row.workStart}`);
      const e = new Date(`2000-01-01T${row.workEnd}`);
      totalMinutes += (e - s) / 1000 / 60;
    });

    if (totalMinutes <= 0) return "-";

    let hours = Math.floor(totalMinutes / 60);
    let minutes = Math.round(totalMinutes % 60);

    if (minutes === 60) {
      hours += 1;
      minutes = 0;
    }

    return `${hours}h ${String(minutes).padStart(2, "0")}m`;
  };

  return (
    <Box
      sx={{
        mt: 4,
        maxWidth: 900,
        mx: "auto",
        px: { xs: 1, md: 0 },
        width: "100%",
      }}
    >
      <h2>
        Timesheet – {monthIndex + 1}/{year}
      </h2>

      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Worker</InputLabel>
        <Select
          label="Pracownik"
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
        >
          <MenuItem value="all">All</MenuItem>
          {profiles.map((p) => (
            <MenuItem key={p.id} value={p.id}>
              {p.name} {p.lastname}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <div
        style={{
          width: "100%",
          overflowX: "auto",
          borderRadius: "8px",
          boxShadow: "0 3px 10px rgba(0,0,0,0.05)",
          background: "white",
        }}
      >
        <table
          style={{
            width: "100%",
            minWidth: "650px",
            borderCollapse: "collapse",
            background: "white",
          }}
        >
          <thead style={{ background: "#f3f4f6" }}>
            <tr>
              <th style={thStyle}>Data</th>
              <th style={thStyle}>Start</th>
              <th style={thStyle}>End</th>
              <th style={thStyle}>Working time</th>
              <th style={thStyle}>Worker</th>
              <th style={thStyle}>Description</th>
            </tr>
          </thead>
          <tbody>
            {enriched.map((row) => (
              <tr key={row.id}>
                <td style={tdStyle}>{row.workDate}</td>
                <td style={tdStyle}>{row.workStart || "-"}</td>
                <td style={tdStyle}>{row.workEnd || "-"}</td>
                <td style={tdStyle}>
                  {calculateDuration(row.workStart, row.workEnd)}
                </td>
                <td style={tdStyle}>
                  {row.user ? `${row.user.name} ${row.user.lastname}` : "–"}
                </td>
                <td style={tdStyle}>{row.workDescription}</td>
              </tr>
            ))}

            {enriched.length === 0 && (
              <tr>
                <td
                  colSpan="5"
                  style={{ textAlign: "center", padding: "1rem" }}
                >
                  Brak danych w tym miesiącu
                </td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr>
              <td style={footerTdStyle} colSpan={3}></td>
              <td style={footerTdStyle}>
                <strong>{getTotalDurationLabel(enriched)}</strong>
              </td>
              <td style={footerTdStyle} colSpan={2}></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </Box>
  );
}

const thStyle = {
  padding: "8px 6px",
  borderBottom: "1px solid #ddd",
  textAlign: "left",
  fontWeight: "bold",
  fontSize: "0.85rem",
};

const tdStyle = {
  padding: "6px 6px",
  borderBottom: "1px solid #eee",
  fontSize: "0.85rem",
};

const footerTdStyle = {
  ...tdStyle,
  backgroundColor: "#f3f4f6",
  fontWeight: "bold",
};
