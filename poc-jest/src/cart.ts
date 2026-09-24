export interface Item {
  sku: string;
  price: number; // in cents, to avoid floating point errors
  qty: number;
}

export class Cart {
  private items = new Map<string, Item>();

  add(item: Item): void {
    if (item.qty <= 0) throw new RangeError('qty must be positive');
    const current = this.items.get(item.sku);
    this.items.set(item.sku, current ? { ...current, qty: current.qty + item.qty } : { ...item });
  }

  remove(sku: string): boolean {
    return this.items.delete(sku);
  }

  get total(): number {
    let sum = 0;
    for (const i of this.items.values()) sum += i.price * i.qty;
    return sum;
  }

  toJSON(): Item[] {
    return [...this.items.values()].sort((a, b) => a.sku.localeCompare(b.sku));
  }
}
