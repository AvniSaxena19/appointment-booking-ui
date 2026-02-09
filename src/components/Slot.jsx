import { motion } from "framer-motion";

const Slot = ({ time, status, onBook }) => {
  const isBooked = status === "booked";

  return (
    <motion.button
      whileHover={!isBooked ? { scale: 1.05 } : {}}
      whileTap={!isBooked ? { scale: 0.97 } : {}}
      disabled={isBooked}
      onClick={onBook}
      className={`relative p-5 rounded-xl font-semibold overflow-hidden
      ${
        isBooked
          ? "bg-red-500/70 cursor-not-allowed"
          : "bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg"
      }`}
    >
      {!isBooked && (
        <div className="absolute inset-0 opacity-0 hover:opacity-100 transition bg-white/10" />
      )}

      <div className="text-lg">{time}</div>
      <div className="text-sm opacity-90">
        {isBooked ? "Booked" : "Available"}
      </div>
    </motion.button>
  );
};

export default Slot;
