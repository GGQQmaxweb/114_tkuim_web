// Week09/server/app.js
import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { router as signupRouter } from './routes/signup.js';

config();

const app = express();
const PORT = process.env.PORT || 3001;

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CORS
app.use(cors({ origin: process.env.ALLOWED_ORIGIN?.split(',') ?? '*' }));

app.use(express.json());

// Serve client folder (HTML, JS, CSS)
app.use(express.static(path.join(__dirname, '../client')));

// API router
app.use('/api/signup', signupRouter);

// Serve the signup page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/signup_form.html'));
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('[Server Error]', error.message);
  res.status(500).json({ error: 'Server Error' });
});

app.listen(PORT, () => {
  console.log(`Server ready on http://localhost:${PORT}`);
});
