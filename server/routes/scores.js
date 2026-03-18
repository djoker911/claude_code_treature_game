import { Router } from 'express';
import db from '../db.js';
import { requireAuth } from './auth.js';

const router = Router();

router.post('/', requireAuth, (req, res) => {
  const { score, result } = req.body;
  if (score === undefined || !['win', 'tie', 'loss'].includes(result)) {
    return res.status(400).json({ error: 'score and result required' });
  }
  db.prepare('INSERT INTO scores (user_id, score, result) VALUES (?, ?, ?)').run(req.user.id, score, result);
  res.json({ ok: true });
});

router.get('/', requireAuth, (req, res) => {
  const rows = db.prepare(
    'SELECT score, result, played_at FROM scores WHERE user_id = ? ORDER BY played_at DESC LIMIT 20'
  ).all(req.user.id);
  res.json(rows);
});

export default router;
