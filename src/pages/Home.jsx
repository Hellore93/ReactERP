import { useMemo, useState } from "react";

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

export default function Home() {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonthIndex = now.getMonth();
  const currentDay = now.getDate();

  const [monthIndex, setMonthIndex] = useState(currentMonthIndex);
  const year = currentYear;

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
  };

  return (
    <section>
      <h1>Home</h1>

      <div
        style={{
          marginTop: "2rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.75rem",
        }}
      >
        <select
          value={monthIndex}
          onChange={(e) => setMonthIndex(parseInt(e.target.value, 10))}
          style={{
            padding: "0.25rem 0.5rem",
            borderRadius: "0.375rem",
            border: "1px solid #ccc",
          }}
        >
          {monthNames.map((name, idx) => (
            <option key={name} value={idx}>
              {name} {year}
            </option>
          ))}
        </select>

        <table
          style={{
            borderCollapse: "collapse",
            minWidth: "280px",
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

                  if (isToday) {
                    cellStyle.backgroundColor = "#16a34a";
                    cellStyle.color = "white";
                    cellStyle.fontWeight = "bold";
                  } else if (isWeekend) {
                    cellStyle.color = "red";
                  } else {
                    cellStyle.color = "#111827";
                  }

                  return (
                    <td key={di} style={cellStyle}>
                      {day ?? ""}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
