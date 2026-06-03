// A "heavy" component (imagine a charting lib inside). It is the DEFAULT export
// because React.lazy expects a module whose default is a component.
export default function Chart() {
  const bars = [40, 70, 30, 90, 55];
  return (
    <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end', height: 100 }}>
      {bars.map((h, i) => (
        <div key={i} style={{ width: 24, height: h, background: '#4f46e5' }} />
      ))}
    </div>
  );
}
