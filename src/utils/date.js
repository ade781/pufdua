
export function diffToTarget(targetISO, now = new Date()) {
  const target = new Date(targetISO);
  const distance = target - now;
  const clamp = (n) => (n < 0 ? 0 : n);
  const days = clamp(Math.floor(distance / (1000 * 60 * 60 * 24)));
  const hours = clamp(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
  const minutes = clamp(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)));
  const seconds = clamp(Math.floor((distance % (1000 * 60)) / 1000));
  return { distance, days, hours, minutes, seconds };
}
export function formatDateID(date) {
  return new Date(date).toLocaleString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}
