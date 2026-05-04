export const dateFormat = (date) => {
  return new Date(date).toLocaleString('en-US', {
    weekday: 'short',   // Mon, Tue
    month: 'long',      // January
    day: 'numeric',     // 5
    hour: 'numeric',    // 10 AM
    minute: 'numeric'   // 30
  });
};