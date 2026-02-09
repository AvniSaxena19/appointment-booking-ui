const KEY = "appointments";

export const getBookings = () => {
  const data = localStorage.getItem(KEY);
  return data ? JSON.parse(data) : {};
};

export const saveBookings = (bookings) => {
  localStorage.setItem(KEY, JSON.stringify(bookings));
};
