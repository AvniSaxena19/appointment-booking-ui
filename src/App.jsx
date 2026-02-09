import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Calendar from "./components/Calendar";
import TimeSlots from "./components/TimeSlots";
import { getBookings, saveBookings } from "./utils/localStorage";

function App() {

  const [selectedDate, setSelectedDate] = useState("");
  const [bookings, setBookings] = useState({});

  const [confirmType, setConfirmType] = useState(null);
  const [historyOpen, setHistoryOpen] = useState(false);

  const [showUndo, setShowUndo] = useState(false);
  const [backupBookings, setBackupBookings] = useState(null);

  const [showBookingToast, setShowBookingToast] = useState(false);

  useEffect(() => {
    setBookings(getBookings());
  }, []);

  // ================= BOOK SLOT =================
  const handleBooking = (time) => {
    if (!selectedDate) return;

    const updated = { ...bookings };

    if (!updated[selectedDate]) updated[selectedDate] = [];
    updated[selectedDate].push(time);

    setBookings(updated);
    saveBookings(updated);

    setShowBookingToast(true);
    setTimeout(() => setShowBookingToast(false), 2500);
  };

  // ================= CLEAR ALL =================
  const clearAllBookings = () => {
    setBackupBookings(bookings);

    localStorage.removeItem("appointments");
    setBookings({});

    setShowUndo(true);
    setTimeout(() => setShowUndo(false), 5000);
  };

  // ================= CLEAR DATE =================
  const clearSelectedDateBookings = () => {
    if (!selectedDate) return;

    setBackupBookings(bookings);

    const updated = { ...bookings };
    delete updated[selectedDate];

    setBookings(updated);
    saveBookings(updated);

    setShowUndo(true);
    setTimeout(() => setShowUndo(false), 5000);
  };

  // ================= UNDO =================
  const undoClear = () => {
    if (!backupBookings) return;

    setBookings(backupBookings);
    saveBookings(backupBookings);
    setShowUndo(false);
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">

      {/* BACKGROUND GLOW */}
      <div className="absolute w-[600px] h-[600px] bg-purple-600/30 blur-[150px] rounded-full top-[-200px] left-[-200px]" />
      <div className="absolute w-[500px] h-[500px] bg-blue-600/30 blur-[150px] rounded-full bottom-[-200px] right-[-200px]" />

      {/* BOOKING TOAST */}
      <AnimatePresence>
        {showBookingToast && (
          <motion.div
            initial={{ y: -100 }}
            animate={{ y: 40 }}
            exit={{ y: -100 }}
            className="fixed left-1/2 -translate-x-1/2 bg-emerald-500 px-6 py-3 rounded-xl font-semibold shadow-xl z-50"
          >
            ✅ Appointment Booked
          </motion.div>
        )}
      </AnimatePresence>

      {/* CLEAR TOAST */}
      <AnimatePresence>
        {showUndo && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: -40 }}
            exit={{ y: 100 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-emerald-600 px-6 py-3 rounded-xl font-semibold shadow-xl z-50"
          >
            Cleared Successfully —
            <button onClick={undoClear} className="ml-3 underline font-bold">
              Undo
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-5xl mx-auto px-6 py-12 relative z-10">

        <h1 className="text-5xl font-bold text-center mb-10 bg-gradient-to-r from-purple-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent">
          Appointment Booking
        </h1>

        {/* BUTTONS */}
        <div className="flex flex-wrap gap-4 justify-center mb-8">

          <button
            onClick={() => setConfirmType("all")}
            className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 font-semibold"
          >
            🗑 Clear All
          </button>

          <button
            disabled={!selectedDate}
            onClick={() => setConfirmType("date")}
            className={`px-5 py-2 rounded-xl font-semibold
            ${selectedDate ? "bg-orange-500 hover:bg-orange-600" : "bg-gray-600 cursor-not-allowed"}`}
          >
            🧹 Clear Selected Date
          </button>

          <button
            onClick={() => setHistoryOpen(true)}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold"
          >
            📜 Booking History
          </button>

        </div>

        {/* MAIN CARD */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          <Calendar
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />

          {selectedDate && (
            <TimeSlots
              bookings={bookings}
              selectedDate={selectedDate}
              handleBooking={handleBooking}
            />
          )}
        </div>

      </div>

      {/* CONFIRM POPUP */}
      <AnimatePresence>
        {confirmType && (
          <motion.div
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          >
            <motion.div className="bg-white text-black rounded-2xl p-8 w-[350px] text-center">
              <h2 className="text-xl font-bold mb-4">Confirm Clear?</h2>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => {
                    confirmType === "all"
                      ? clearAllBookings()
                      : clearSelectedDateBookings();
                    setConfirmType(null);
                  }}
                  className="px-5 py-2 bg-red-600 text-white rounded-lg"
                >
                  Yes
                </button>

                <button
                  onClick={() => setConfirmType(null)}
                  className="px-5 py-2 bg-gray-300 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HISTORY DRAWER */}
      <AnimatePresence>
        {historyOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            className="fixed right-0 top-0 h-full w-[350px] bg-slate-900 p-6 shadow-2xl z-50 overflow-y-auto"
          >
            <h2 className="text-2xl font-bold mb-6">Booking History</h2>

            {Object.keys(bookings).length === 0 && (
              <p className="text-gray-400">No Bookings Yet</p>
            )}

            {Object.entries(bookings).map(([date, slots]) => (
              <div key={date} className="mb-6">
                <h3 className="font-semibold text-lg mb-2 text-blue-400">
                  {date}
                </h3>

                <ul className="space-y-2">
                  {slots.map((slot, i) => (
                    <li key={i} className="bg-white/10 px-3 py-2 rounded-lg">
                      {slot}
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <button
              onClick={() => setHistoryOpen(false)}
              className="mt-6 w-full bg-red-600 hover:bg-red-700 py-2 rounded-xl font-semibold"
            >
              Close
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default App;
