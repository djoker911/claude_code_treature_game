import bcrypt from 'bcryptjs';
import { getDb, persist } from './db';

function makeToken(username: string): string {
  return btoa(`${username}:${Date.now()}`);
}

function usernameFromToken(token: string): string | null {
  try {
    return atob(token).split(':')[0] || null;
  } catch {
    return null;
  }
}

function currentUsername(): string | null {
  const token = localStorage.getItem('token');
  return token ? usernameFromToken(token) : null;
}

export const api = {
  async signup(username: string, password: string) {
    const db = await getDb();
    const existing = db.exec('SELECT id FROM users WHERE username = ?', [username]);
    if (existing.length > 0 && existing[0].values.length > 0) {
      throw new Error('Username already taken');
    }
    const hash = await bcrypt.hash(password, 10);
    db.run('INSERT INTO users (username, password_hash) VALUES (?, ?)', [username, hash]);
    await persist();
    return { username, token: makeToken(username) };
  },

  async signin(username: string, password: string) {
    const db = await getDb();
    const result = db.exec('SELECT password_hash FROM users WHERE username = ?', [username]);
    if (result.length === 0 || result[0].values.length === 0) {
      throw new Error('Invalid username or password');
    }
    const hash = result[0].values[0][0] as string;
    const valid = await bcrypt.compare(password, hash);
    if (!valid) throw new Error('Invalid username or password');
    return { username, token: makeToken(username) };
  },

  async saveScore(score: number, result: 'win' | 'tie' | 'loss') {
    const username = currentUsername();
    if (!username) throw new Error('Not authenticated');
    const db = await getDb();
    const userResult = db.exec('SELECT id FROM users WHERE username = ?', [username]);
    if (userResult.length === 0 || userResult[0].values.length === 0) {
      throw new Error('User not found');
    }
    const userId = userResult[0].values[0][0] as number;
    db.run('INSERT INTO scores (user_id, score, result) VALUES (?, ?, ?)', [userId, score, result]);
    await persist();
    return { success: true };
  },

  async getScores() {
    const username = currentUsername();
    if (!username) return [];
    const db = await getDb();
    const userResult = db.exec('SELECT id FROM users WHERE username = ?', [username]);
    if (userResult.length === 0 || userResult[0].values.length === 0) return [];
    const userId = userResult[0].values[0][0] as number;
    const result = db.exec(
      'SELECT score, result, created_at FROM scores WHERE user_id = ? ORDER BY created_at DESC LIMIT 10',
      [userId]
    );
    if (result.length === 0) return [];
    return result[0].values.map(([score, res, created_at]) => ({
      score: score as number,
      result: res as 'win' | 'tie' | 'loss',
      played_at: created_at as number,
    }));
  },
};
