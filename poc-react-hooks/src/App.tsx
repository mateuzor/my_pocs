import { useContext, useState, useRef, useId, useDeferredValue, useMemo, useTransition, useSyncExternalStore } from 'react';
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

// Custom hook using useSyncExternalStore to subscribe to window width
function useWindowWidth() {
  const width = useSyncExternalStore(
    // subscribe function - called when component mounts
    (callback) => {
      window.addEventListener('resize', callback);
      return () => window.removeEventListener('resize', callback);
    },
    // getSnapshot function - returns current value
    () => window.innerWidth,
    // getServerSnapshot (optional) - for SSR
    () => 0
  );
  return width;
}

// Custom hook to subscribe to localStorage
function useLocalStorage(key: string) {
  const value = useSyncExternalStore(
    (callback) => {
      // Listen to storage events from other tabs/windows
      window.addEventListener('storage', callback);
      // Custom event for same-tab updates
      window.addEventListener('local-storage', callback);
      return () => {
        window.removeEventListener('storage', callback);
        window.removeEventListener('local-storage', callback);
      };
    },
    () => localStorage.getItem(key),
    () => null // SSR
  );
  return value;
}

function UseSyncExternalStoreDemo() {
  const windowWidth = useWindowWidth();
  const storedValue = useLocalStorage('demo-key');
  const [inputValue, setInputValue] = useState('');

  const handleSave = () => {
    localStorage.setItem('demo-key', inputValue);
    // Dispatch custom event to notify same-tab listeners
    window.dispatchEvent(new Event('local-storage'));
    setInputValue('');
  };

  const handleClear = () => {
    localStorage.removeItem('demo-key');
    window.dispatchEvent(new Event('local-storage'));
  };

  // Determine screen size category
  let sizeCategory = 'Mobile';
  if (windowWidth >= 1024) sizeCategory = 'Desktop';
  else if (windowWidth >= 768) sizeCategory = 'Tablet';

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>useSyncExternalStore Example</h1>

      {/* Window Width Demo */}
      <div style={{
        marginBottom: '30px',
        padding: '20px',
        backgroundColor: '#e3f2fd',
        borderRadius: '8px'
      }}>
        <h2>Window Width Subscription</h2>
        <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#1976d2' }}>
          {windowWidth}px
        </p>
        <p style={{ fontSize: '18px', color: '#666' }}>
          Screen Category: <strong>{sizeCategory}</strong>
        </p>
        <p style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>
          Try resizing your browser window to see the value update in real-time!
        </p>
      </div>

      {/* localStorage Demo */}
      <div style={{
        marginBottom: '30px',
        padding: '20px',
        backgroundColor: '#f3e5f5',
        borderRadius: '8px'
      }}>
        <h2>localStorage Subscription</h2>
        <div style={{ marginBottom: '15px' }}>
          <p style={{ marginBottom: '10px' }}>Current stored value:</p>
          <div style={{
            padding: '15px',
            backgroundColor: 'white',
            borderRadius: '4px',
            border: '2px solid #9c27b0',
            minHeight: '40px',
            fontFamily: 'monospace'
          }}>
            {storedValue || <em style={{ color: '#999' }}>(empty)</em>}
          </div>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter a value..."
            style={{
              padding: '10px',
              fontSize: '16px',
              width: '100%',
              boxSizing: 'border-box',
              marginBottom: '10px'
            }}
          />
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={handleSave}
              disabled={!inputValue}
              style={{
                padding: '10px 20px',
                cursor: inputValue ? 'pointer' : 'not-allowed',
                backgroundColor: inputValue ? '#9c27b0' : '#ccc',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                flex: 1
              }}
            >
              Save to localStorage
            </button>
            <button
              onClick={handleClear}
              disabled={!storedValue}
              style={{
                padding: '10px 20px',
                cursor: storedValue ? 'pointer' : 'not-allowed',
                backgroundColor: storedValue ? '#d32f2f' : '#ccc',
                color: 'white',
                border: 'none',
                borderRadius: '4px'
              }}
            >
              Clear
            </button>
          </div>
        </div>

        <p style={{ fontSize: '14px', color: '#666' }}>
          💡 Open this page in another tab and change the value there - this tab will update automatically!
        </p>
      </div>

      {/* Explanation */}
      <div style={{ marginTop: '40px', textAlign: 'left' }}>
        <h3>How useSyncExternalStore works:</h3>
        <ul>
          <li><strong>External stores:</strong> Synchronizes React state with external data sources</li>
          <li><strong>subscribe:</strong> Function that registers a listener and returns cleanup</li>
          <li><strong>getSnapshot:</strong> Returns the current value from the external store</li>
          <li><strong>getServerSnapshot:</strong> Optional snapshot for SSR (server-side rendering)</li>
          <li><strong>Automatic updates:</strong> Component re-renders when external store changes</li>
          <li><strong>React 18:</strong> Works with concurrent features and tearing prevention</li>
        </ul>

        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#fff3cd', borderRadius: '4px' }}>
          <strong>Use cases:</strong>
          <ul style={{ marginTop: '10px', marginBottom: 0 }}>
            <li>Browser APIs (window size, online status, geolocation)</li>
            <li>External state management libraries (Redux, MobX, Zustand)</li>
            <li>WebSocket connections</li>
            <li>localStorage/sessionStorage</li>
            <li>Any mutable external data source</li>
          </ul>
        </div>

        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
          <strong>Before React 18:</strong>
          <p style={{ marginTop: '10px', marginBottom: 0 }}>
            Libraries had to use useEffect + useState to sync with external stores, which could cause tearing
            in concurrent mode. useSyncExternalStore provides a safe, built-in way to do this.
          </p>
        </div>
      </div>
    </div>
  );
}

function UseTransitionDemo() {
  const [isPending, startTransition] = useTransition();
  const [tab, setTab] = useState<'about' | 'posts' | 'contact'>('about');

  // Function to generate expensive content
  function ExpensivePostList() {
    const items = [];
    // Simulate expensive rendering with many items
    for (let i = 0; i < 500; i++) {
      items.push(
        <div key={i} style={{
          padding: '15px',
          marginBottom: '10px',
          backgroundColor: '#f9f9f9',
          borderRadius: '4px',
          border: '1px solid #ddd'
        }}>
          <h4 style={{ margin: '0 0 8px 0' }}>Post Title #{i + 1}</h4>
          <p style={{ margin: 0, color: '#666' }}>
            This is post content #{i + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>
        </div>
      );
    }
    return <div>{items}</div>;
  }

  function handleTabChange(newTab: 'about' | 'posts' | 'contact') {
    // Using startTransition to make tab switching non-blocking
    startTransition(() => {
      setTab(newTab);
    });
  }

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>useTransition Example</h1>

      {/* Tab Navigation */}
      <div style={{ marginBottom: '30px', display: 'flex', gap: '10px', borderBottom: '2px solid #ddd', paddingBottom: '10px' }}>
        <button
          onClick={() => handleTabChange('about')}
          disabled={isPending}
          style={{
            padding: '10px 20px',
            cursor: isPending ? 'wait' : 'pointer',
            backgroundColor: tab === 'about' ? '#4CAF50' : '#f0f0f0',
            color: tab === 'about' ? 'white' : 'black',
            border: 'none',
            borderRadius: '4px',
            fontWeight: tab === 'about' ? 'bold' : 'normal',
            opacity: isPending ? 0.6 : 1
          }}
        >
          About
        </button>
        <button
          onClick={() => handleTabChange('posts')}
          disabled={isPending}
          style={{
            padding: '10px 20px',
            cursor: isPending ? 'wait' : 'pointer',
            backgroundColor: tab === 'posts' ? '#4CAF50' : '#f0f0f0',
            color: tab === 'posts' ? 'white' : 'black',
            border: 'none',
            borderRadius: '4px',
            fontWeight: tab === 'posts' ? 'bold' : 'normal',
            opacity: isPending ? 0.6 : 1
          }}
        >
          Posts (Slow) {isPending && '⏳'}
        </button>
        <button
          onClick={() => handleTabChange('contact')}
          disabled={isPending}
          style={{
            padding: '10px 20px',
            cursor: isPending ? 'wait' : 'pointer',
            backgroundColor: tab === 'contact' ? '#4CAF50' : '#f0f0f0',
            color: tab === 'contact' ? 'white' : 'black',
            border: 'none',
            borderRadius: '4px',
            fontWeight: tab === 'contact' ? 'bold' : 'normal',
            opacity: isPending ? 0.6 : 1
          }}
        >
          Contact
        </button>
      </div>

      {isPending && (
        <div style={{ padding: '15px', backgroundColor: '#fff3cd', borderRadius: '4px', marginBottom: '20px' }}>
          ⏳ Loading content... (UI stays responsive)
        </div>
      )}

      {/* Tab Content */}
      <div style={{
        opacity: isPending ? 0.7 : 1,
        transition: 'opacity 0.2s',
        maxHeight: '500px',
        overflowY: 'auto',
        border: '1px solid #ddd',
        padding: '20px',
        borderRadius: '4px'
      }}>
        {tab === 'about' && (
          <div>
            <h2>About Tab</h2>
            <p>This is a lightweight tab that renders quickly.</p>
            <p>Notice how switching to this tab is instant, even when coming from the slow Posts tab.</p>
          </div>
        )}

        {tab === 'posts' && (
          <div>
            <h2>Posts Tab (Expensive Rendering)</h2>
            <p style={{ marginBottom: '20px' }}>This tab renders 500 post items, simulating expensive rendering.</p>
            <ExpensivePostList />
          </div>
        )}

        {tab === 'contact' && (
          <div>
            <h2>Contact Tab</h2>
            <p>Email: contact@example.com</p>
            <p>Phone: (555) 123-4567</p>
            <p>Address: 123 Main St, City, State 12345</p>
          </div>
        )}
      </div>

      <div style={{ marginTop: '40px', textAlign: 'left' }}>
        <h3>How useTransition works:</h3>
        <ul>
          <li><strong>Non-blocking updates:</strong> State updates wrapped in startTransition don't block the UI</li>
          <li><strong>isPending flag:</strong> Indicates when a transition is in progress</li>
          <li><strong>User feedback:</strong> Can show loading states while keeping UI responsive</li>
          <li><strong>Priority:</strong> Urgent updates (like typing) interrupt non-urgent transitions</li>
          <li><strong>React 18 Concurrent:</strong> Works with concurrent rendering features</li>
        </ul>

        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e3f2fd', borderRadius: '4px' }}>
          <strong>Try it:</strong> Click the "Posts (Slow)" tab. Notice how:
          <ul style={{ marginTop: '10px' }}>
            <li>The button clicks still work immediately</li>
            <li>The previous tab content stays visible while loading</li>
            <li>The isPending indicator shows loading state</li>
            <li>You can click other tabs while Posts is loading</li>
          </ul>
        </div>

        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
          <strong>useTransition vs useDeferredValue:</strong>
          <ul style={{ marginTop: '10px' }}>
            <li><strong>useTransition:</strong> Wraps state update code - use when you control the setState call</li>
            <li><strong>useDeferredValue:</strong> Wraps state value - use when you receive value from props/context</li>
            <li>Both achieve non-blocking updates with different APIs</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function UseDeferredValueDemo() {
  const [input, setInput] = useState('');
  const deferredInput = useDeferredValue(input);

  // Simulate expensive computation
  const filteredItems = useMemo(() => {
    const items = Array.from({ length: 10000 }, (_, i) => `Item ${i + 1}`);

    // Simulate slow filtering
    const start = Date.now();
    while (Date.now() - start < 50) {
      // Artificial delay
    }

    return items.filter(item =>
      item.toLowerCase().includes(deferredInput.toLowerCase())
    );
  }, [deferredInput]);

  const isStale = input !== deferredInput;

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>useDeferredValue Example</h1>

      <div style={{ marginBottom: '30px' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Search items..."
          style={{
            padding: '12px',
            fontSize: '16px',
            width: '100%',
            boxSizing: 'border-box',
            border: '2px solid #4CAF50'
          }}
        />
        <p style={{ marginTop: '10px', color: '#666' }}>
          {isStale ? '⏳ Updating results...' : '✓ Results up to date'}
        </p>
      </div>

      <div style={{
        maxHeight: '400px',
        overflowY: 'auto',
        border: '1px solid #ddd',
        padding: '15px',
        opacity: isStale ? 0.6 : 1,
        transition: 'opacity 0.2s'
      }}>
        <p><strong>Found {filteredItems.length} items</strong></p>
        {filteredItems.slice(0, 50).map((item, index) => (
          <div key={index} style={{ padding: '8px', borderBottom: '1px solid #eee' }}>
            {item}
          </div>
        ))}
        {filteredItems.length > 50 && (
          <p style={{ marginTop: '10px', color: '#666' }}>
            ...and {filteredItems.length - 50} more items
          </p>
        )}
      </div>

      <div style={{ marginTop: '40px', textAlign: 'left' }}>
        <h3>How useDeferredValue works:</h3>
        <ul>
          <li><strong>Defers updates:</strong> Shows stale value while new value is being computed</li>
          <li><strong>Non-blocking:</strong> Input remains responsive even with expensive operations</li>
          <li><strong>React 18 Concurrent:</strong> Works with concurrent rendering</li>
          <li><strong>Use case:</strong> Search filters, live previews, heavy computations</li>
          <li><strong>Difference from debounce:</strong> useDeferredValue lets React decide when to update based on available resources</li>
        </ul>

        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e3f2fd', borderRadius: '4px' }}>
          <strong>Try it:</strong> Type quickly in the search box. Notice how the input stays responsive while the list updates with a slight delay.
        </div>
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
      <UseSyncExternalStoreDemo />
      {/* Previous examples */}
      {/* <UseTransitionDemo /> */}
      {/* <UseDeferredValueDemo /> */}
      {/* <UseIdDemo /> */}
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
