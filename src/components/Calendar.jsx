import { motion } from "framer-motion";

const Calendar = ({ selectedDate, setSelectedDate }) => {
  const today = new Date();

  const getNext7Days = () => {
    let days = [];
    for (let i = 0; i < 7; i++) {
      let d = new Date();
      d.setDate(today.getDate() + i);
      days.push(d.toISOString().split("T")[0]);
    }
    return days;
  };

  return (
    <div className="mb-10">
      <h2 className="text-2xl font-semibold mb-6">📅 Select Date</h2>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {getNext7Days().map((date) => (
          <motion.button
            whileHover={{ scale: 1.05 }}
            key={date}
            onClick={() => setSelectedDate(date)}
            className={`p-4 rounded-xl border font-medium transition
            ${
              selectedDate === date
                ? "bg-blue-600 border-blue-600 shadow-lg"
                : "bg-white/5 border-white/10 hover:bg-white/10"
            }`}
          >
            {date}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
