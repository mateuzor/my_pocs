import { observer } from 'mobx-react-lite'
import { counterStore } from '../stores/CounterStore'

// observer() makes the component re-render whenever any observable it reads changes.
// Only the specific observables accessed during render are tracked — nothing more.
const CounterView = observer(() => {
  const store = counterStore

  return (
    <div style={{ padding: '1.5rem', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '1rem', fontFamily: 'sans-serif' }}>
      <h3>MobX — observable / action / computed</h3>

      <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0.5rem 0' }}>
        {store.count}
        <span style={{ fontSize: '1rem', color: store.isPositive ? '#38a169' : '#e53e3e', marginLeft: '0.5rem' }}>
          {store.isPositive ? 'positive' : 'non-positive'}
        </span>
      </p>

      <p style={{ color: '#718096', fontSize: '0.9rem' }}>Doubled: <strong>{store.doubled}</strong></p>

      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.75rem', flexWrap: 'wrap' }}>
        <button onClick={() => store.decrement()}>− {store.step}</button>
        <button onClick={() => store.increment()}>+ {store.step}</button>
        <button onClick={() => store.reset()}>Reset</button>
        <label style={{ marginLeft: '0.5rem', fontSize: '0.9rem' }}>
          Step:
          <input
            type="number"
            value={store.step}
            min={1}
            onChange={e => store.setStep(Number(e.target.value))}
            style={{ width: '50px', marginLeft: '0.4rem', padding: '0.2rem' }}
          />
        </label>
      </div>
    </div>
  )
})

export default CounterView
