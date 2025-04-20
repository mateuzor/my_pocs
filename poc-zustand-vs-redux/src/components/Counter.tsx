interface Props {
  count: number;
  clicks: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
  asyncIncrement: () => void;
}

export default function Counter({
  count,
  clicks,
  increment,
  decrement,
  reset,
  asyncIncrement,
}: Props) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Contador: {count}</h2>
      <p className="text-sm">Cliques totais: {clicks}</p>
      <div className="space-x-2">
        <button onClick={increment}>+1</button>
        <button onClick={decrement}>-1</button>
        <button onClick={reset}>Reset</button>
        <button onClick={asyncIncrement}>+1 Async</button>
      </div>
    </div>
  );
}
