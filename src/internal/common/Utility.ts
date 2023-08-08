export function dateToString(date: Date) {
  let day = date.getUTCDate();
  let dayStr = day < 10 ? "0" + String(day) : String(day);
  let month = date.getUTCMonth() + 1;
  let monthStr = month < 10 ? "0" + String(month) : String(month);
  let yearStr = String(date.getUTCFullYear());
  return yearStr + "-" + monthStr + "-" + dayStr;
}
