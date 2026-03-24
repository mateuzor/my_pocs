import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';

// A simple form component used only in this test file.
// Testing an inline component avoids coupling these tests to production code.
function SearchForm({ onSearch }: { onSearch: (q: string) => void }) {
  const [value, setValue] = useState('');
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSearch(value); }}>
      <input
        placeholder="Search..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        aria-label="search input"
      />
      <button type="submit">Search</button>
    </form>
  );
}

function AsyncList() {
  const [items, setItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 50));
    setItems(['React', 'TypeScript', 'Vite']);
    setLoading(false);
  };

  return (
    <div>
      <button onClick={load}>Load Items</button>
      {loading && <p>Loading...</p>}
      {items.map((item) => <p key={item}>{item}</p>)}
    </div>
  );
}

describe('User interactions with userEvent', () => {

  it('types into an input using userEvent', async () => {
    // userEvent.setup() simulates real browser events (focus, keydown, input, keyup).
    // More realistic than fireEvent which only fires a single synthetic event.
    const user = userEvent.setup();
    const handleSearch = vi.fn();

    render(<SearchForm onSearch={handleSearch} />);

    const input = screen.getByRole('textbox', { name: /search input/i });
    await user.type(input, 'hello world');
    expect(input).toHaveValue('hello world');
  });

  it('calls onSearch with the typed value on submit', async () => {
    const user = userEvent.setup();
    const handleSearch = vi.fn();

    render(<SearchForm onSearch={handleSearch} />);

    await user.type(screen.getByRole('textbox'), 'react hooks');
    await user.click(screen.getByRole('button', { name: /search/i }));

    expect(handleSearch).toHaveBeenCalledWith('react hooks');
  });

  it('shows items after async load', async () => {
    const user = userEvent.setup();
    render(<AsyncList />);

    await user.click(screen.getByRole('button', { name: /load items/i }));

    // waitFor polls until the assertion passes — use it for async DOM updates
    await waitFor(() => {
      expect(screen.getByText('React')).toBeInTheDocument();
    });

    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('Vite')).toBeInTheDocument();
  });
});
