import { CircularProgress } from "@mui/material";
import "./Spinner.css";

export const Spinner = () => {
  return (
    <div className="loading-overlay">
      <div className="loading-message">
        <CircularProgress size="3rem" style={{ marginBottom: "1rem", color: "#fff" }} />
        <span>Loading data, please wait...</span>
      </div>
    </div>
  );
};