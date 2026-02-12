import { useContext, useState, useRef, useId } from 'react';
import "./App.css";
import Counter from "./components/Counter";
import LayoutEffectExample from "./components/LayoutEffectExample";
import NameInput from "./components/NameInput";
import { ThemeContext, ThemeProvider } from './contexts/ThemeContext';
import { AuthContext, AuthProvider } from './contexts/AuthContext';
import { TodoContext, TodoProvider } from './contexts/TodoContext';
import FancyInput, { FancyInputHandle } from './components/FancyInput';
import { useOnlineStatus, useUser } from './hooks/useOnlineStatus';

function ThemeDisplay() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('ThemeDisplay must be used within ThemeProvider');
  }

  const { theme, toggleTheme } = context;

  return (
    <div style={{
      padding: '40px',
      backgroundColor: theme === 'light' ? '#ffffff' : '#1a1a1a',
      color: theme === 'light' ? '#000000' : '#ffffff',
      minHeight: '100vh',
      transition: 'all 0.3s ease'
    }}>
      <h1>useContext - Theme Example</h1>
      <p>Current theme: <strong>{theme}</strong></p>

      <button
        onClick={toggleTheme}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          cursor: 'pointer',
          backgroundColor: theme === 'light' ? '#333' : '#fff',
          color: theme === 'light' ? '#fff' : '#333',
          border: 'none',
          borderRadius: '4px'
        }}
      >
        Toggle to {theme === 'light' ? 'Dark' : 'Light'} Mode
      </button>

      <div style={{ marginTop: '30px' }}>
        <h2>How useContext works:</h2>
        <ul style={{ textAlign: 'left', maxWidth: '600px' }}>
          <li>Creates shared state accessible anywhere in component tree</li>
          <li>No need to pass props through every level (prop drilling)</li>
          <li>Provider wraps components that need the context</li>
          <li>useContext hook accesses the context value</li>
        </ul>
      </div>
    </div>
  );
}

function AuthDemo() {
  const context = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!context) {
    throw new Error('AuthDemo must be used within AuthProvider');
  }

  const { user, login, logout, isAuthenticated } = context;

  return (
    <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>useContext - Auth Example</h1>

      {!isAuthenticated ? (
        <div>
          <h2>Login Form</h2>
          <div style={{ marginBottom: '15px' }}>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              style={{ marginLeft: '10px', padding: '8px', width: '200px' }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="demo123"
              style={{ marginLeft: '10px', padding: '8px', width: '200px' }}
            />
          </div>
          <button
            onClick={() => login(email, password)}
            style={{ padding: '10px 20px', cursor: 'pointer' }}
          >
            Login
          </button>
          <p style={{ marginTop: '15px', fontSize: '14px', color: '#666' }}>
            Hint: Use password "demo123"
          </p>
        </div>
      ) : (
        <div>
          <h2>Welcome, {user?.name}!</h2>
          <div style={{
            backgroundColor: '#f0f0f0',
            padding: '20px',
            borderRadius: '8px',
            marginBottom: '20px'
          }}>
            <p><strong>User Info:</strong></p>
            <p>ID: {user?.id}</p>
            <p>Name: {user?.name}</p>
            <p>Email: {user?.email}</p>
          </div>
          <button
            onClick={logout}
            style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: '#ff4444', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            Logout
          </button>
        </div>
      )}

      <div style={{ marginTop: '40px', textAlign: 'left' }}>
        <h3>Multiple Contexts Pattern:</h3>
        <ul>
          <li>Can nest multiple Context Providers</li>
          <li>Each context manages different concerns (theme, auth, etc)</li>
          <li>Components can use multiple contexts via multiple useContext calls</li>
          <li>Prevents prop drilling for cross-cutting concerns</li>
        </ul>
      </div>
    </div>
  );
}

function UseIdDemo() {
  // useId generates unique IDs for accessibility
  const emailId = useId();
  const passwordId = useId();
  const descriptionId = useId();

  const [formData, setFormData] = useState({ email: '', password: '' });

  return (
    <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>useId Example</h1>
      <p id={descriptionId} style={{ color: '#666', marginBottom: '30px' }}>
        useId generates unique, stable IDs for accessibility attributes
      </p>

      <form style={{ marginBottom: '30px' }}>
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor={emailId} style={{ display: 'block', marginBottom: '5px' }}>
            Email Address
          </label>
          <input
            id={emailId}
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            aria-describedby={descriptionId}
            style={{ padding: '10px', width: '100%', boxSizing: 'border-box' }}
          />
          <small style={{ display: 'block', marginTop: '5px', color: '#666' }}>
            Input ID: <code>{emailId}</code>
          </small>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label htmlFor={passwordId} style={{ display: 'block', marginBottom: '5px' }}>
            Password
          </label>
          <input
            id={passwordId}
            type="password"
            value={formData.password}
            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
            style={{ padding: '10px', width: '100%', boxSizing: 'border-box' }}
          />
          <small style={{ display: 'block', marginTop: '5px', color: '#666' }}>
            Input ID: <code>{passwordId}</code>
          </small>
        </div>

        <button type="submit" style={{ padding: '10px 20px', cursor: 'pointer' }}>
          Submit
        </button>
      </form>

      <div style={{ marginTop: '40px', textAlign: 'left' }}>
        <h3>Why useId is important:</h3>
        <ul>
          <li><strong>Accessibility:</strong> Links labels to inputs via htmlFor/id</li>
          <li><strong>Server-side rendering:</strong> IDs match between server and client (no hydration mismatch)</li>
          <li><strong>Unique:</strong> Guaranteed unique even with multiple instances of same component</li>
          <li><strong>Stable:</strong> Same ID on every render (unlike Math.random)</li>
          <li><strong>React 18+:</strong> Part of concurrent rendering features</li>
        </ul>

        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#fff3cd', borderRadius: '4px' }}>
          <strong>Note:</strong> Without useId, you'd need to manage IDs manually or use libraries like uuid. useId ensures IDs work correctly with SSR and Concurrent Features.
        </div>
      </div>
    </div>
  );
}

function DebugValueDemo() {
  const isOnline = useOnlineStatus();
  const [userId, setUserId] = useState(1);
  const { user, loading } = useUser(userId);

  return (
    <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>useDebugValue Example</h1>

      <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#f0f8ff', borderRadius: '8px' }}>
        <h2>Online Status</h2>
        <p style={{ fontSize: '18px' }}>
          Status: <strong style={{ color: isOnline ? 'green' : 'red' }}>
            {isOnline ? 'Online' : 'Offline'}
          </strong>
        </p>
        <p style={{ fontSize: '14px', color: '#666' }}>
          Open React DevTools to see "useOnlineStatus" hook with custom debug value
        </p>
      </div>

      <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#f0fff0', borderRadius: '8px' }}>
        <h2>User Data</h2>
        <div style={{ marginBottom: '15px' }}>
          <label>Select User ID: </label>
          <select value={userId} onChange={(e) => setUserId(Number(e.target.value))} style={{ padding: '5px' }}>
            <option value={1}>User 1</option>
            <option value={2}>User 2</option>
            <option value={3}>User 3</option>
          </select>
        </div>

        {loading ? (
          <p>Loading user...</p>
        ) : (
          <div>
            <p><strong>ID:</strong> {user?.id}</p>
            <p><strong>Name:</strong> {user?.name}</p>
          </div>
        )}

        <p style={{ fontSize: '14px', color: '#666', marginTop: '15px' }}>
          Open React DevTools to see "useUser" hook with formatted debug value
        </p>
      </div>

      <div style={{ marginTop: '40px', textAlign: 'left' }}>
        <h3>How useDebugValue works:</h3>
        <ul>
          <li><strong>Purpose:</strong> Adds custom labels to custom hooks in React DevTools</li>
          <li><strong>Visibility:</strong> Only visible in React DevTools, not in production</li>
          <li><strong>Performance:</strong> Formatter function only runs when DevTools is open</li>
          <li><strong>Best practice:</strong> Use in shared/library hooks for better debugging experience</li>
        </ul>
      </div>
    </div>
  );
}

function ImperativeDemo() {
  const inputRef = useRef<FancyInputHandle>(null);

  return (
    <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>useImperativeHandle + forwardRef</h1>

      <div style={{ marginBottom: '30px' }}>
        <FancyInput ref={inputRef} placeholder="Type something..." />
      </div>

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button
          onClick={() => inputRef.current?.focus()}
          style={{ padding: '10px 20px', cursor: 'pointer' }}
        >
          Focus Input
        </button>
        <button
          onClick={() => inputRef.current?.clear()}
          style={{ padding: '10px 20px', cursor: 'pointer' }}
        >
          Clear Input
        </button>
        <button
          onClick={() => inputRef.current?.setValue('Hello from parent!')}
          style={{ padding: '10px 20px', cursor: 'pointer' }}
        >
          Set Value
        </button>
        <button
          onClick={() => {
            const value = inputRef.current?.getValue();
            alert(`Current value: ${value}`);
          }}
          style={{ padding: '10px 20px', cursor: 'pointer' }}
        >
          Get Value
        </button>
      </div>

      <div style={{ marginTop: '40px', textAlign: 'left' }}>
        <h3>How it works:</h3>
        <ul>
          <li><strong>forwardRef:</strong> Allows parent to pass ref to child component</li>
          <li><strong>useImperativeHandle:</strong> Customizes what ref exposes to parent</li>
          <li><strong>Use case:</strong> Expose imperative methods (focus, clear, etc) to parent</li>
          <li><strong>Best practice:</strong> Use sparingly - prefer declarative props when possible</li>
        </ul>
      </div>
    </div>
  );
}

function TodoApp() {
  const context = useContext(TodoContext);
  const [inputText, setInputText] = useState('');

  if (!context) {
    throw new Error('TodoApp must be used within TodoProvider');
  }

  const { todos, dispatch } = context;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      dispatch({ type: 'ADD_TODO', text: inputText });
      setInputText('');
    }
  };

  const completedCount = todos.filter(t => t.completed).length;
  const activeCount = todos.length - completedCount;

  return (
    <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>useContext + useReducer - Todo List</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: '30px' }}>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Add a new todo..."
          style={{ padding: '10px', width: '70%', fontSize: '16px' }}
        />
        <button
          type="submit"
          style={{ padding: '10px 20px', marginLeft: '10px', cursor: 'pointer' }}
        >
          Add
        </button>
      </form>

      <div style={{ marginBottom: '20px' }}>
        <span>Active: {activeCount}</span>
        <span style={{ marginLeft: '20px' }}>Completed: {completedCount}</span>
        {completedCount > 0 && (
          <button
            onClick={() => dispatch({ type: 'CLEAR_COMPLETED' })}
            style={{ marginLeft: '20px', padding: '5px 10px', cursor: 'pointer' }}
          >
            Clear Completed
          </button>
        )}
      </div>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {todos.map(todo => (
          <li
            key={todo.id}
            style={{
              padding: '15px',
              marginBottom: '10px',
              backgroundColor: '#f5f5f5',
              borderRadius: '4px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => dispatch({ type: 'TOGGLE_TODO', id: todo.id })}
                style={{ marginRight: '10px' }}
              />
              <span style={{
                textDecoration: todo.completed ? 'line-through' : 'none',
                color: todo.completed ? '#999' : '#000'
              }}>
                {todo.text}
              </span>
            </div>
            <button
              onClick={() => dispatch({ type: 'DELETE_TODO', id: todo.id })}
              style={{ padding: '5px 10px', cursor: 'pointer', backgroundColor: '#ff4444', color: 'white', border: 'none', borderRadius: '4px' }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {todos.length === 0 && (
        <p style={{ textAlign: 'center', color: '#999' }}>No todos yet. Add one above!</p>
      )}

      <div style={{ marginTop: '40px', textAlign: 'left' }}>
        <h3>useContext + useReducer Pattern:</h3>
        <ul>
          <li>useReducer manages complex state logic (like Redux)</li>
          <li>Context makes the state and dispatch available globally</li>
          <li>Reducer centralizes state updates with predictable actions</li>
          <li>Perfect for global state management without external libraries</li>
        </ul>
      </div>
    </div>
  );
}

function App() {
  return (
    <div>
      <UseIdDemo />
      {/* Previous examples */}
      {/* <DebugValueDemo /> */}
      {/* <ImperativeDemo /> */}
      {/* <TodoProvider><TodoApp /></TodoProvider> */}
      {/* <AuthProvider><AuthDemo /></AuthProvider> */}
      {/* <ThemeProvider><ThemeDisplay /></ThemeProvider> */}
      {/* <NameInput />
      <Counter />
      <LayoutEffectExample /> */}
    </div>
  );
}

export default App;
