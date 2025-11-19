import { useMemo, useState, useEffect } from "react";
import { Button } from "@mui/material";
import { useObjectStore } from "../store/DataStore";
import { WorkDaySection } from "../forms/WorkDay";
import { WorkSpreadsheet } from "../pages/WorkSpreadsheet";

function buildMonthMatrix(year, monthIndex) {
  const firstDay = new Date(year, monthIndex, 1);
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const firstWeekday = (firstDay.getDay() + 6) % 7;

  const weeks = [];
  let currentDay = 1;
  let week = new Array(7).fill(null);

  for (let i = firstWeekday; i < 7 && currentDay <= daysInMonth; i++) {
    week[i] = currentDay++;
  }
  weeks.push(week);

  while (currentDay <= daysInMonth) {
    week = new Array(7).fill(null);
    for (let i = 0; i < 7 && currentDay <= daysInMonth; i++) {
      week[i] = currentDay++;
    }
    weeks.push(week);
  }

  return weeks;
}

export default function Home({ user }) {
  const {
    items: days,
    loadWorkingHour,
    insert,
    update,
    initialized,
  } = useObjectStore("WorkDay");

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonthIndex = now.getMonth();
  const currentDay = now.getDate();
  const isAdmin = user.profile === "admin";

  const [monthIndex, setMonthIndex] = useState(currentMonthIndex);
  const [year, setYear] = useState(currentYear);
  const [selectedDay, setSelectedDay] = useState(null);
  const [currentUser] = useState(user);

  useEffect(() => {
    if (!initialized) loadWorkingHour(currentUser.id);
  }, [initialized, loadWorkingHour, currentUser.id]);

  const workDayByDate = useMemo(() => {
    const map = new Map();
    days.forEach((rec) => {
      map.set(rec.workDate, rec);
    });
    return map;
  }, [days]);

  const monthNames = [
    "styczeń",
    "luty",
    "marzec",
    "kwiecień",
    "maj",
    "czerwiec",
    "lipiec",
    "sierpień",
    "wrzesień",
    "październik",
    "listopad",
    "grudzień",
  ];

  const monthOptions = useMemo(() => {
    const opts = [];
    const maxMonthsBack = 24;
    const cursor = new Date(currentYear, currentMonthIndex, 1);

    for (let i = 0; i < maxMonthsBack; i++) {
      const y = cursor.getFullYear();
      const m = cursor.getMonth();

      opts.push({
        year: y,
        monthIndex: m,
        value: `${y}-${String(m).padStart(2, "0")}`,
        label: `${monthNames[m]} ${y}`,
      });
      cursor.setMonth(cursor.getMonth() - 1);
    }

    return opts;
  }, [currentYear, currentMonthIndex]);

  const weeks = useMemo(
    () => buildMonthMatrix(year, monthIndex),
    [year, monthIndex]
  );

  const baseCellStyle = {
    border: "1px solid #ddd",
    width: "2.5rem",
    height: "2.5rem",
    textAlign: "center",
    padding: "0.25rem",
    cursor: "pointer",
  };

  const handleSaveDay = async (form) => {
    if (form.workEnd == "") {
      delete form.id;
      delete form.workEnd;
    }
    let record;
    if (form.id == undefined) {
      record = await insert({
        ...form,
        userId: currentUser.id,
      });
    } else {
      record = await update(form);
    }
    setSelectedDay(record);
    loadWorkingHour(currentUser.id);
  };

  return (
    <section>
      <h1>Work progress</h1>

      <div
        style={{
          marginTop: "2rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.75rem",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            alignItems: "center",
          }}
        >
          <select
            value={`${year}-${String(monthIndex).padStart(2, "0")}`}
            onChange={(e) => {
              const [yStr, mStr] = e.target.value.split("-");
              const y = Number(yStr);
              const m = Number(mStr);
              setYear(y);
              setMonthIndex(m);
            }}
            style={{
              padding: "0.6rem 0.5rem",
              borderRadius: "0.375rem",
              border: "1px solid #ccc",
            }}
          >
            {monthOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <Button
            type="button"
            variant="contained"
            onClick={() => {
              setYear(currentYear);
              setMonthIndex(currentMonthIndex);
            }}
          >
            Current month
          </Button>
        </div>

        <table
          style={{
            borderCollapse: "collapse",
            minWidth: "310px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}
        >
          <thead>
            <tr>
              {["pon", "wto", "śro", "czw", "pią", "sob", "nie"].map((d, i) => {
                const isWeekend = i === 5 || i === 6;
                return (
                  <th
                    key={d}
                    style={{
                      ...baseCellStyle,
                      backgroundColor: "#f3f4f6",
                      color: isWeekend ? "red" : "#111827",
                    }}
                  >
                    {d}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {weeks.map((week, wi) => (
              <tr key={wi}>
                {week.map((day, di) => {
                  const isWeekend = di === 5 || di === 6;
                  const isToday =
                    day &&
                    year === currentYear &&
                    monthIndex === currentMonthIndex &&
                    day === currentDay;

                  let cellStyle = { ...baseCellStyle };

                  if (isWeekend) {
                    cellStyle.color = "red";
                  } else {
                    cellStyle.color = "#111827";
                  }

                  if (isToday) {
                    cellStyle.border = "2px solid #16a34a";
                  }

                  let workDayRecord = null;
                  if (day) {
                    const dateStr = `${year}-${String(monthIndex + 1).padStart(
                      2,
                      "0"
                    )}-${String(day).padStart(2, "0")}`;
                    workDayRecord = workDayByDate.get(dateStr);
                    if (workDayRecord && !isToday) {
                      cellStyle.backgroundColor = "#3b82f6";
                      if (workDayRecord.workEnd == null) {
                        cellStyle.backgroundColor = "#969696ff";
                      }
                      cellStyle.color = "white";
                      cellStyle.fontWeight = "bold";
                    }
                  }

                  return (
                    <td
                      key={di}
                      style={cellStyle}
                      onClick={() =>
                        setSelectedDay(
                          !workDayRecord && isToday ? {} : workDayRecord
                        )
                      }
                    >
                      {day ?? ""}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
        {!isAdmin && selectedDay && (
          <WorkDaySection selectedDay={selectedDay} onSave={handleSaveDay} />
        )}
        {isAdmin && <WorkSpreadsheet year={year} monthIndex={monthIndex} />}
      </div>
    </section>
  );
}
