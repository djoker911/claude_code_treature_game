const getToken = () => localStorage.getItem('token');

async function request(path: string, options: RequestInit = {}) {
  const token = getToken();
  const res = await fetch(path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : {};
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export const api = {
  signup: (username: string, password: string) =>
    request('/api/auth/signup', { method: 'POST', body: JSON.stringify({ username, password }) }),

  signin: (username: string, password: string) =>
    request('/api/auth/signin', { method: 'POST', body: JSON.stringify({ username, password }) }),

  saveScore: (score: number, result: 'win' | 'tie' | 'loss') =>
    request('/api/scores', { method: 'POST', body: JSON.stringify({ score, result }) }),

  getScores: () => request('/api/scores'),
};
