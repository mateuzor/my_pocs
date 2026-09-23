import { render, screen, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { server } from '../test/server';
import { UserList } from './UserList';

describe('UserList (async + msw)', () => {
  it('shows loading, then the users', async () => {
    render(<UserList />);
    // The loading state is synchronous, so getBy is fine here.
    expect(screen.getByText(/loading users/i)).toBeInTheDocument();

    // WHY: findBy = getBy + waitFor. Use it when the element appears after async work.
    expect(await screen.findByText('Ada Lovelace')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
  });

  it('shows an error when the API fails', async () => {
    // server.use prepends a one-off handler for this test only (reset in setup.ts).
    server.use(http.get('/api/users', () => new HttpResponse(null, { status: 500 })));
    render(<UserList />);
    expect(await screen.findByRole('alert')).toHaveTextContent('Failed: HTTP 500');
  });

  it('waitFor retries an assertion until it passes', async () => {
    render(<UserList />);
    await waitFor(() => expect(screen.getByRole('list', { name: 'users' })).toBeInTheDocument());
  });
});
