import type { Item } from "../../model/Item";
import { getItems } from "../client/TornLogClient";
import { Collection } from "./Collection";

class ItemCollection extends Collection {
  items: Map<number, Item>;

  constructor() {
    super();
    this.items = new Map<number, Item>();
  }

  public get(key: number) {
    return this.items.get(key);
  }

  public async update() {
    const tornPublicKey = process.env.REACT_APP_TORNPUBLICKEY;
    if (tornPublicKey === undefined) {
      return false;
    }
    await getItems(tornPublicKey);
    super.updateTime();
    return true;
  }
}

export const itemCollection = new ItemCollection();
