import { observer } from 'mobx-react-lite'
import { postStore } from '../stores/PostStore'

const PostView = observer(() => {
  const store = postStore

  return (
    <div style={{ padding: '1.5rem', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '1rem', fontFamily: 'sans-serif' }}>
      <h3>MobX — async action with runInAction</h3>
      <p style={{ color: '#555', fontSize: '0.9rem' }}>Mutations after await must be wrapped in runInAction.</p>

      <button
        onClick={() => store.fetchPosts()}
        disabled={store.status === 'loading'}
        style={{ padding: '0.4rem 1rem', marginTop: '0.5rem' }}
      >
        {store.status === 'loading' ? 'Loading...' : 'Fetch Posts'}
      </button>

      {store.status === 'error' && (
        <p style={{ color: '#e53e3e', marginTop: '0.5rem' }}>{store.error}</p>
      )}

      {store.status === 'done' && (
        <ul style={{ listStyle: 'none', padding: 0, marginTop: '0.75rem' }}>
          {store.posts.map(post => (
            <li key={post.id} style={{ padding: '0.5rem 0', borderBottom: '1px solid #eee', fontSize: '0.9rem' }}>
              <strong>{post.title}</strong>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
})

export default PostView
