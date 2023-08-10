import { EPS } from "./Consts";

export function dateToString(date: Date) {
  const day = date.getUTCDate();
  const dayStr = day < 10 ? "0" + String(day) : String(day);
  const month = date.getUTCMonth() + 1;
  const monthStr = month < 10 ? "0" + String(month) : String(month);
  const yearStr = String(date.getUTCFullYear());
  return yearStr + "-" + monthStr + "-" + dayStr;
}

export function approximatelyEquals(x: number, y: number) {
  const numerator = Math.abs(x - y);
  if (numerator < EPS) {
    return true;
  }
  const denominator = Math.abs(x + y);
  if (denominator < EPS) {
    return numerator < EPS;
  } else {
    return numerator / denominator < EPS;
  }
}
