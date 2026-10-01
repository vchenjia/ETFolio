import express from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import etfRoutes from './routes/etfRoutes.js'
import cookieParser from 'cookie-parser';


const app = express();
app.use(cookieParser());
app.use(cors({ origin: [process.env.FRONTEND_URL!, 'http://localhost:5173'], credentials: true }));
app.use(express.json());

app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/etf', etfRoutes);

app.use(errorHandler);

export default app;