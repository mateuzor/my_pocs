import { Cart, CartBadge, FirstItemEditor } from './components/Cart';
import { UserProfile } from './components/UserProfile';

// NO PROVIDER in this app. Jotai works out-of-the-box without wrapping in a
// <Provider>. If you DO need scoped stores (e.g. per-route or per-test),
// `<Provider>` creates an isolated atom store; otherwise atoms live in a
// module-level default store.

export function App() {
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: '2rem', maxWidth: 800 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Jotai POC</h1>
        <CartBadge />
      </header>

      <Cart />
      <FirstItemEditor />

      <hr style={{ margin: '2rem 0' }} />

      <UserProfile />
    </div>
  );
}
