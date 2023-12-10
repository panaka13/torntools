import { getStocks } from "../internal/client/TornLogClient";
import { itemCollection } from "../internal/collection/ItemCollection";
import { parseStocks } from "../model/Stock";

export async function getStockBlock() {
  if (itemCollection.isExpired()) {
    await itemCollection.update();
  }
  const api = process.env.REACT_APP_TORNPUBLICKEY;
  if (api === undefined) {
    return ["no TORN_PUBLIC_KEY", null];
  }
  const [error, json] = await getStocks(api);
  if (error !== null) {
    return [error, null];
  }
  return [null, parseStocks(json)];
}
