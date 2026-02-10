import { useState, FormEvent } from 'react';

function App() {
  const [form, setForm] = useState({ name: '', email: '' });
  const [errors, setErrors] = useState({ name: '', email: '' });

  const validate = (field: string, value: string) => {
    let error = '';
    if (field === 'name' && value.length < 3) error = 'Name must be 3+ chars';
    if (field === 'email' && !value.includes('@')) error = 'Invalid email';
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    validate(field, value);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!errors.name && !errors.email) alert('Valid! ' + JSON.stringify(form));
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Controlled Form with Validation</h1>
      <p>Real-time validation</p>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>Name:</label>
          <input 
            value={form.name} 
            onChange={e => handleChange('name', e.target.value)}
            style={{ marginLeft: '10px', padding: '5px', borderColor: errors.name ? 'red' : '#ccc' }}
          />
          {errors.name && <p style={{ color: 'red', fontSize: '12px' }}>{errors.name}</p>}
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Email:</label>
          <input 
            value={form.email} 
            onChange={e => handleChange('email', e.target.value)}
            style={{ marginLeft: '10px', padding: '5px', borderColor: errors.email ? 'red' : '#ccc' }}
          />
          {errors.email && <p style={{ color: 'red', fontSize: '12px' }}>{errors.email}</p>}
        </div>
        <button type="submit" style={{ padding: '8px 16px' }}>Submit</button>
      </form>
    </div>
  );
}

export default App;
