import React from "react";
import Slot from "./Slot";
import { TIME_SLOTS } from "../data/timeSlots";

const TimeSlots = ({ bookings, selectedDate, handleBooking }) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-5">⏰ Time Slots</h2>

      <div className="grid sm:grid-cols-2 gap-4">
        {TIME_SLOTS.map((time) => {
          const status =
            bookings[selectedDate]?.includes(time) ? "booked" : "available";

          return (
            <Slot
              key={time}
              time={time}
              status={status}
              onBook={() => handleBooking(time)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default TimeSlots;
