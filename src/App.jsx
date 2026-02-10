import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Calendar from "./components/Calendar";
import TimeSlots from "./components/TimeSlots";
import { getBookings, saveBookings } from "./utils/localStorage";

function App() {

  const [selectedDate, setSelectedDate] = useState("");
  const [bookings, setBookings] = useState({});
  const [showBookingToast, setShowBookingToast] = useState(false);
  const [showUndo, setShowUndo] = useState(false);
  const [backupBookings, setBackupBookings] = useState(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [confirmType, setConfirmType] = useState(null);

  useEffect(() => {
    setBookings(getBookings());
  }, []);

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

  const clearAllBookings = () => {
    setBackupBookings(bookings);
    localStorage.removeItem("appointments");
    setBookings({});
    setShowUndo(true);
    setTimeout(() => setShowUndo(false), 5000);
  };

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

  const undoClear = () => {
    if (!backupBookings) return;
    setBookings(backupBookings);
    saveBookings(backupBookings);
    setShowUndo(false);
  };

  return (
    <div className="min-h-screen bg-black text-white">

      {/* TOASTS */}
      <AnimatePresence>
        {showBookingToast && (
          <motion.div
            initial={{ y: -120 }}
            animate={{ y: 40 }}
            exit={{ y: -120 }}
            className="fixed left-1/2 -translate-x-1/2 bg-emerald-500 px-6 py-3 rounded-xl z-50"
          >
            Appointment Booked ✓
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showUndo && (
          <motion.div
            initial={{ y: 120 }}
            animate={{ y: -40 }}
            exit={{ y: 120 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-emerald-600 px-6 py-3 rounded-xl z-50"
          >
            Cleared —
            <button onClick={undoClear} className="ml-2 underline">Undo</button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* HEADING */}
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8
        bg-gradient-to-r from-purple-400 via-blue-400 to-emerald-400
        bg-clip-text text-transparent">
          Appointment Booking
        </h1>

        {/* TOOLBAR */}
        <div className="flex justify-center mb-10">
          <div className="flex flex-wrap gap-4 bg-white/5 border border-white/10 backdrop-blur-md px-6 py-4 rounded-2xl">

            <button
              onClick={() => setConfirmType("all")}
              className="px-5 py-2 bg-red-600 rounded-xl hover:bg-red-700"
            >
              Clear All
            </button>

            <button
              onClick={() => setConfirmType("date")}
              disabled={!selectedDate}
              className="px-5 py-2 bg-orange-500 rounded-xl disabled:bg-gray-600"
            >
              Clear Selected Date
            </button>

            <button
              onClick={() => setHistoryOpen(true)}
              className="px-5 py-2 bg-blue-600 rounded-xl hover:bg-blue-700"
            >
              Booking History
            </button>

          </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid md:grid-cols-[340px_1fr] gap-8 items-start">

          {/* CALENDAR PANEL */}
          <div className="flex justify-center">
            <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6 w-full max-w-[320px]">
              <Calendar
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
              />
            </div>
          </div>

          {/* TIMESLOT PANEL */}
          <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6 min-h-[420px]">
            {selectedDate ? (
              <TimeSlots
                bookings={bookings}
                selectedDate={selectedDate}
                handleBooking={handleBooking}
              />
            ) : (
              <div className="h-full flex items-center justify-center opacity-60">
                Select a date from calendar
              </div>
            )}
          </div>

        </div>

      </div>

      {/* CONFIRM MODAL */}
      <AnimatePresence>
        {confirmType && (
          <motion.div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
            <div className="bg-white text-black p-6 rounded-xl text-center">
              <p className="mb-4 font-semibold">Confirm Clear?</p>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => {
                    confirmType === "all"
                      ? clearAllBookings()
                      : clearSelectedDateBookings();
                    setConfirmType(null);
                  }}
                  className="bg-red-600 text-white px-4 py-2 rounded"
                >
                  Yes
                </button>

                <button
                  onClick={() => setConfirmType(null)}
                  className="bg-gray-300 px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
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
            className="fixed right-0 top-0 h-full w-[320px] bg-slate-900 p-6 z-50 overflow-y-auto"
          >
            <h2 className="text-xl mb-6 font-bold">Booking History</h2>

            {Object.entries(bookings).map(([date, slots]) => (
              <div key={date} className="mb-4">
                <p className="font-semibold text-blue-400">{date}</p>
                {slots.map((slot, i) => (
                  <div key={i} className="text-sm bg-white/10 p-2 rounded mt-1">
                    {slot}
                  </div>
                ))}
              </div>
            ))}

            <button
              onClick={() => setHistoryOpen(false)}
              className="mt-6 w-full bg-red-600 py-2 rounded-xl"
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
