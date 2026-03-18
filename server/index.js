import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth.js';
import scoresRouter from './routes/scores.js';

const app = express();
const PORT = 3001;

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/scores', scoresRouter);

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
