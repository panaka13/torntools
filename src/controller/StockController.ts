import type { Stock } from "../model/Stock";

export async function getStockBlock(api: string) {
  const stocks: Stock[] = [];
  stocks.push({ id: 1, acrym: "TSB" });
  return [null, stocks];
}
