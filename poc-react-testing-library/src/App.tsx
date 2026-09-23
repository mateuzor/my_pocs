import { LoginForm } from './components/LoginForm';
import { UserList } from './components/UserList';
import { Counter } from './components/Counter';

export function App() {
  return (
    <main>
      <h1>Testing Library playground</h1>
      <LoginForm onSubmit={(v) => alert(`Hello ${v.email}`)} />
      <Counter />
      <UserList />
    </main>
  );
}
