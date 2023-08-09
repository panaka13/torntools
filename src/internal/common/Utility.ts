import { EPS } from "./Consts";

export function dateToString(date: Date) {
  let day = date.getUTCDate();
  let dayStr = day < 10 ? "0" + String(day) : String(day);
  let month = date.getUTCMonth() + 1;
  let monthStr = month < 10 ? "0" + String(month) : String(month);
  let yearStr = String(date.getUTCFullYear());
  return yearStr + "-" + monthStr + "-" + dayStr;
}

export function approximatelyEquals(x: number, y: number) {
  let numerator = Math.abs(x - y);
  if (numerator < EPS) {
    return true;
  }
  let denominator = Math.abs(x + y);
  if (denominator < EPS) {
    return numerator < EPS;
  } else {
    return numerator / denominator < EPS;
  }
}
