import { useForm } from '@tanstack/react-form';

// Async validation: the validator returns a Promise.
// onChangeAsyncDebounceMs debounces the check so it doesn't fire on every keystroke.
// The field shows a "Checking..." state while the async validator is running.

// Simulates an API call that checks if a username is already taken
async function checkUsernameAvailability(username: string): Promise<string | undefined> {
  await new Promise(r => setTimeout(r, 700)); // simulate network latency
  const taken = ['admin', 'root', 'test', 'user'];
  return taken.includes(username.toLowerCase()) ? `"${username}" is already taken` : undefined;
}

export function FormAsync() {
  const form = useForm({
    defaultValues: { username: '', password: '', confirmPassword: '' },
    onSubmit: async ({ value }) => {
      await new Promise(r => setTimeout(r, 500));
      alert(`Registered:\n${JSON.stringify({ username: value.username }, null, 2)}`);
    },
  });

  return (
    <div style={{ padding: '1.5rem' }}>
      <h2>TanStack Form — Async Validation</h2>
      <p style={{ color: '#555', fontSize: '0.9rem' }}>
        Username availability is checked against the server after 500ms of inactivity.
        Try: <code>admin</code>, <code>root</code>, <code>test</code>, <code>user</code>.
      </p>

      <form
        style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: 400 }}
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        {/* Username — async availability check */}
        <form.Field
          name="username"
          validators={{
            onChange: ({ value }) =>
              !value.trim() ? 'Username is required' :
              value.length < 3 ? 'At least 3 characters' : undefined,
            onChangeAsync: async ({ value }) => checkUsernameAvailability(value),
            // Wait 500ms after the last keystroke before firing the async check
            onChangeAsyncDebounceMs: 500,
          }}
        >
          {(field) => (
            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '4px' }}>
                Username
              </label>
              <input
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                style={{ width: '100%', padding: '0.4rem 0.75rem', boxSizing: 'border-box' }}
              />
              {/* isValidating is true while the async validator is in-flight */}
              {field.state.meta.isValidating && (
                <span style={{ color: '#718096', fontSize: '0.8rem' }}>Checking availability...</span>
              )}
              {!field.state.meta.isValidating && field.state.meta.errors.length > 0 && (
                <span style={{ color: 'red', fontSize: '0.8rem' }}>
                  {field.state.meta.errors[0]}
                </span>
              )}
              {!field.state.meta.isValidating && field.state.meta.errors.length === 0 && field.state.value.length >= 3 && (
                <span style={{ color: 'green', fontSize: '0.8rem' }}>✓ Available</span>
              )}
            </div>
          )}
        </form.Field>

        {/* Password */}
        <form.Field
          name="password"
          validators={{
            onChange: ({ value }) =>
              !value ? 'Password is required' :
              value.length < 6 ? 'At least 6 characters' : undefined,
          }}
        >
          {(field) => (
            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '4px' }}>
                Password
              </label>
              <input
                type="password"
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                style={{ width: '100%', padding: '0.4rem 0.75rem', boxSizing: 'border-box' }}
              />
              {field.state.meta.errors.length > 0 && (
                <span style={{ color: 'red', fontSize: '0.8rem' }}>
                  {field.state.meta.errors[0]}
                </span>
              )}
            </div>
          )}
        </form.Field>

        {/* Confirm password — cross-field validation via form.getFieldValue */}
        <form.Field
          name="confirmPassword"
          validators={{
            onChangeListenTo: ['password'],
            onChange: ({ value, fieldApi }) => {
              const password = fieldApi.form.getFieldValue('password');
              if (!value) return 'Please confirm your password';
              if (value !== password) return 'Passwords do not match';
              return undefined;
            },
          }}
        >
          {(field) => (
            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '4px' }}>
                Confirm password
              </label>
              <input
                type="password"
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                style={{ width: '100%', padding: '0.4rem 0.75rem', boxSizing: 'border-box' }}
              />
              {field.state.meta.errors.length > 0 && (
                <span style={{ color: 'red', fontSize: '0.8rem' }}>
                  {field.state.meta.errors[0]}
                </span>
              )}
            </div>
          )}
        </form.Field>

        <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
          {([canSubmit, isSubmitting]) => (
            <button
              type="submit"
              disabled={!canSubmit}
              style={{ padding: '0.5rem 1.25rem', alignSelf: 'flex-start' }}
            >
              {isSubmitting ? 'Registering...' : 'Register'}
            </button>
          )}
        </form.Subscribe>
      </form>
    </div>
  );
}
