import { observer } from 'mobx-react-lite'
import { reactionStore } from '../stores/ReactionStore'

const ReactionView = observer(() => {
  const store = reactionStore

  return (
    <div style={{ padding: '1.5rem', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '1rem', fontFamily: 'sans-serif' }}>
      <h3>MobX — autorun / reaction / when</h3>
      <p style={{ color: '#555', fontSize: '0.9rem' }}>Change temperature and watch the reaction log below.</p>

      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginTop: '0.75rem' }}>
        <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{store.temperature}°C</span>
        <input
          type="range"
          min={0}
          max={110}
          value={store.temperature}
          onChange={e => store.setTemperature(Number(e.target.value))}
          style={{ flex: 1 }}
        />
        <button onClick={() => store.clearLogs()}>Clear</button>
      </div>

      <div style={{ marginTop: '1rem', maxHeight: '160px', overflowY: 'auto', background: '#1a202c', borderRadius: '6px', padding: '0.75rem' }}>
        {store.logs.length === 0
          ? <span style={{ color: '#718096', fontSize: '0.85rem' }}>Move the slider to see reactions fire...</span>
          : store.logs.slice().reverse().map((log, i) => (
              <div key={i} style={{ color: '#a0aec0', fontSize: '0.8rem', fontFamily: 'monospace', marginBottom: '0.2rem' }}>{log}</div>
            ))
        }
      </div>
    </div>
  )
})

export default ReactionView
