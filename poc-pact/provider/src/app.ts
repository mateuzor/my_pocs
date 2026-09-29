import express from 'express';

export interface UserRecord {
  id: number;
  name: string;
  email: string;
}

// Injectable repository so provider states can swap data without a real DB.
export const db = new Map<number, UserRecord>();

export function createApp() {
  const app = express();

  app.get('/users/:id', (req, res) => {
    const user = db.get(Number(req.params.id));
    if (!user) return res.status(404).json({ error: 'not found' });
    res.json(user);
  });

  return app;
}
