import { createApp, db } from './app';

db.set(1, { id: 1, name: 'Ada Lovelace', email: 'ada@example.com' });

createApp().listen(3001, () => console.log('UserService on http://localhost:3001'));
