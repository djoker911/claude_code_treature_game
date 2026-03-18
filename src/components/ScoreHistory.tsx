import { useEffect, useState } from 'react';
import { api } from '../lib/api';

interface ScoreEntry {
  score: number;
  result: 'win' | 'tie' | 'loss';
  played_at: number;
}

const resultStyles: Record<string, string> = {
  win: 'bg-green-100 text-green-800 border border-green-300',
  tie: 'bg-amber-100 text-amber-800 border border-amber-300',
  loss: 'bg-red-100 text-red-800 border border-red-300',
};

export default function ScoreHistory() {
  const [scores, setScores] = useState<ScoreEntry[]>([]);

  useEffect(() => {
    api.getScores().then(setScores).catch(() => {});
  }, []);

  if (scores.length === 0) return null;

  return (
    <div className="mt-6 w-full max-w-md">
      <h3 className="text-lg text-amber-900 mb-2 text-center">Score History</h3>
      <div className="max-h-48 overflow-y-auto space-y-1">
        {scores.map((s, i) => (
          <div key={i} className="flex items-center justify-between px-3 py-1.5 bg-amber-200/60 rounded-lg">
            <span className="text-amber-800 text-sm">
              {new Date(s.played_at * 1000).toLocaleDateString()}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${resultStyles[s.result]}`}>
              {s.result}
            </span>
            <span className={`text-sm font-medium ${s.score >= 0 ? 'text-green-700' : 'text-red-700'}`}>
              ${s.score}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
