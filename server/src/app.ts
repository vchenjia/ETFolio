import express from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/authRoutes';
import cookieParser from 'cookie-parser';

const app = express();
app.use(cookieParser());
app.use(cors({ origin: [process.env.FRONTEND_URL!, 'http://localhost:5173'], credentials: true }));
app.use(express.json());
app.use(authRoutes)

app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
});

// Routes will mount here later, e.g.:
app.use('/api/auth', authRoutes);

app.use(errorHandler);

export default app;