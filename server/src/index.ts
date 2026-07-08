import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Server status health check
app.get('/status', (req, res) => {
  res.json({
    status: 'ok',
    message: 'ResQNet API Server is running',
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(`[server] Server starting in ${process.env.NODE_ENV || 'development'} mode`);
  console.log(`[server] Health status available at http://localhost:${PORT}/status`);
});
