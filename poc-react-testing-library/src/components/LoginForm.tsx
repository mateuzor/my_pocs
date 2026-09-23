import { FormEvent, useState } from 'react';

export interface LoginValues {
  email: string;
  password: string;
}

export function LoginForm({ onSubmit }: { onSubmit: (v: LoginValues) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<string[]>([]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const next: string[] = [];
    if (!/^\S+@\S+\.\S+$/.test(email)) next.push('Enter a valid email');
    if (password.length < 8) next.push('Password must have at least 8 characters');
    setErrors(next);
    if (next.length === 0) onSubmit({ email, password });
  }

  return (
    <form onSubmit={handleSubmit} noValidate aria-label="login">
      <label htmlFor="email">Email</label>
      <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

      <label htmlFor="password">Password</label>
      <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

      {errors.length > 0 && (
        <ul role="alert">
          {errors.map((m) => (
            <li key={m}>{m}</li>
          ))}
        </ul>
      )}

      <button type="submit">Sign in</button>
    </form>
  );
}
