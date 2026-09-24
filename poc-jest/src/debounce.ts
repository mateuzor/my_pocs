// Time-based code: perfect target for jest fake timers.
export function debounce<A extends unknown[]>(fn: (...args: A) => void, ms: number) {
  let timer: ReturnType<typeof setTimeout> | undefined;
  return (...args: A) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

export function retry<T>(op: () => Promise<T>, attempts: number, delayMs: number): Promise<T> {
  return op().catch((err) => {
    if (attempts <= 1) throw err;
    return new Promise<T>((resolve) => setTimeout(resolve, delayMs)).then(() => retry(op, attempts - 1, delayMs));
  });
}
