import { type Item, parseItems } from "../../model/Item";
import { getItems } from "../client/TornLogClient";
import { Collection } from "./Collection";

class ItemCollection extends Collection {
  idToIndex: Map<number, number>;
  nameToIndex: Map<string, number>;
  items: Item[];

  constructor() {
    super();
    this.idToIndex = new Map<number, number>();
    this.nameToIndex = new Map<string, number>();
    this.items = [];
  }

  public get(index: number) {
    if (index < 0 || index > this.items.length) {
      return null;
    }
    return this.items[index];
  }

  public findByID(id: number) {
    const index = this.idToIndex.get(id);
    if (index === undefined) {
      return null;
    }
    return this.items[index];
  }

  public findByName(name: string) {
    const index = this.nameToIndex.get(name);
    if (index === undefined) {
      return null;
    }
    return this.items[index];
  }

  public async update() {
    const tornPublicKey = process.env.REACT_APP_TORNPUBLICKEY;
    if (tornPublicKey === undefined) {
      return false;
    }
    const [error, json] = await getItems(tornPublicKey);
    if (error !== null) {
      return false;
    }
    this.items = parseItems(json);
    for (let i = 0; i < this.items.length; i++) {
      this.nameToIndex.set(this.items[i].name, i);
      this.idToIndex.set(this.items[i].id, i);
    }
    super.updateTime();
    return true;
  }
}

export const itemCollection = new ItemCollection();
