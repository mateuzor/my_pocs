import { useForm } from '@tanstack/react-form';

// TanStack Form is headless — it manages form state, validation, and submission
// but provides zero UI. You own all the markup.
// Field validation runs on change/blur depending on which validator you attach.

interface FormValues {
  name: string;
  email: string;
  age: string;
}

export function FormBasic() {
  const form = useForm<FormValues>({
    defaultValues: { name: '', email: '', age: '' },
    onSubmit: async ({ value }) => {
      // Simulates a brief API call
      await new Promise(r => setTimeout(r, 600));
      alert(`Submitted:\n${JSON.stringify(value, null, 2)}`);
    },
  });

  return (
    <div style={{ padding: '1.5rem' }}>
      <h2>TanStack Form — Sync Validation</h2>
      <p style={{ color: '#555', fontSize: '0.9rem' }}>
        Each field validates independently on change. The submit button is disabled
        until all fields pass. No library components — you write the inputs.
      </p>

      <form
        style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: 400 }}
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        {/* Name field */}
        <form.Field
          name="name"
          validators={{
            onChange: ({ value }) =>
              !value.trim() ? 'Name is required' :
              value.trim().length < 2 ? 'At least 2 characters' : undefined,
          }}
        >
          {(field) => (
            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '4px' }}>
                Name
              </label>
              <input
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

        {/* Email field */}
        <form.Field
          name="email"
          validators={{
            onChange: ({ value }) =>
              !value.trim() ? 'Email is required' :
              !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'Invalid email format' : undefined,
          }}
        >
          {(field) => (
            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '4px' }}>
                Email
              </label>
              <input
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

        {/* Age field */}
        <form.Field
          name="age"
          validators={{
            onChange: ({ value }) => {
              const n = Number(value);
              if (!value.trim()) return 'Age is required';
              if (isNaN(n) || n < 1 || n > 120) return 'Enter a valid age (1–120)';
              return undefined;
            },
          }}
        >
          {(field) => (
            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '4px' }}>
                Age
              </label>
              <input
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

        {/* form.Subscribe reads form-level state reactively */}
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
        >
          {([canSubmit, isSubmitting]) => (
            <button
              type="submit"
              disabled={!canSubmit}
              style={{ padding: '0.5rem 1.25rem', alignSelf: 'flex-start' }}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          )}
        </form.Subscribe>
      </form>
    </div>
  );
}
