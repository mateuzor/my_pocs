import { Cart } from './cart';

export interface Logger {
  info(msg: string): void;
}

// Collaborators are passed in, so we can spy on them and assert on interactions.
export function checkout(cart: Cart, logger: Logger, onPaid: (total: number) => void): number {
  const total = cart.total;
  if (total === 0) throw new Error('empty cart');
  logger.info(`checkout total=${total}`);
  onPaid(total);
  return total;
}
