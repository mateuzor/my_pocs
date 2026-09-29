export interface User {
  id: number;
  name: string;
  email: string;
}

// The consumer: a thin HTTP client used by some frontend/service.
export class UserClient {
  constructor(private readonly baseUrl: string) {}

  async getUser(id: number): Promise<User> {
    const res = await fetch(`${this.baseUrl}/users/${id}`, {
      headers: { Accept: 'application/json' },
    });
    if (res.status === 404) throw new Error('User not found');
    if (!res.ok) throw new Error(`Unexpected status ${res.status}`);
    return res.json() as Promise<User>;
  }
}
