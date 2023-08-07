export function dateToString(date: Date) {
  let day = date.getUTCDay();
  let dayStr = day < 0 ? "0" + String(day) : String(day);
  let month = date.getUTCDay();
  let monthStr = day < 0 ? "0" + String(month) : String(month);
  let yearStr = String(date.getUTCFullYear());
  return yearStr + "-" + monthStr + "-" + dayStr;
}
