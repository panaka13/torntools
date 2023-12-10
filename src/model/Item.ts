export class Item {
  id: number;
  name: string;
  price: number;

  constructor(id: number, name: string, price: number) {
    this.id = id;
    this.name = name;
    this.price = price;
  }
}

export function parseItems(json: any): Item[] {
  const items: Item[] = [];
  for (const [key, value] of Object.entries<any>(json)) {
    const id = parseInt(key);
    const item = new Item(id, value.name, value.market_value);
    items.push(item);
  }
  return items;
}
