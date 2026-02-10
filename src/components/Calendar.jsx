import React, { useState } from "react";

const Calendar = ({ selectedDate, setSelectedDate }) => {

  const today = new Date();

  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const formatDate = (date) =>
    date.toISOString().split("T")[0];

  const days = [];

  for (let i = 0; i < firstDay; i++) days.push(null);

  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(year, month, i));
  }

  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  return (
    <div className="mb-10">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">

        <button
          onClick={() => setMonth(m => m === 0 ? 11 : m - 1)}
          className="px-3 py-1 bg-white/10 rounded"
        >
          ←
        </button>

        <div className="flex gap-3 items-center">

          <select
            value={month}
            onChange={e => setMonth(Number(e.target.value))}
            className="bg-black border border-white/20 px-2 py-1 rounded"
          >
            {monthNames.map((m, i) => (
              <option key={i} value={i}>{m}</option>
            ))}
          </select>

          <select
            value={year}
            onChange={e => setYear(Number(e.target.value))}
            className="bg-black border border-white/20 px-2 py-1 rounded"
          >
            {Array.from({ length: 10 }, (_, i) => today.getFullYear() - 5 + i)
              .map(y => (
                <option key={y}>{y}</option>
              ))}
          </select>

        </div>

        <button
          onClick={() => setMonth(m => m === 11 ? 0 : m + 1)}
          className="px-3 py-1 bg-white/10 rounded"
        >
          →
        </button>

      </div>

      {/* WEEK HEADERS */}
      <div className="grid grid-cols-7 text-center text-sm mb-2 opacity-70">
        {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => (
          <div key={d}>{d}</div>
        ))}
      </div>

      {/* DAYS */}
      <div className="grid grid-cols-7 gap-3">
        {days.map((date, i) => {

          if (!date) return <div key={i}></div>;

          const iso = formatDate(date);
          const isToday = formatDate(today) === iso;
          const isSelected = selectedDate === iso;
          const isPast = date < new Date().setHours(0,0,0,0);

         return (
  <button
    key={i}
    disabled={isPast}
    onClick={() => setSelectedDate(iso)}
    className={`flex items-center justify-center h-10 rounded border transition
      ${isSelected && "bg-blue-600 border-blue-600"}
      ${isToday && !isSelected && "border-emerald-400"}
      ${isPast && "opacity-30 cursor-not-allowed"}
      ${!isSelected && !isPast && "bg-white/5 hover:bg-white/10"}
    `}
  >
    {date.getDate()}
  </button>
);

        })}
      </div>

    </div>
  );
};

export default Calendar;
