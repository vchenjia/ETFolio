import express from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/authRoutes';
const app = express();

app.use(cors());
app.use(express.json());
app.use(authRoutes)
app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
});

// Routes will mount here later, e.g.:
app.use('/api/auth/register', authRoutes);

app.use(errorHandler);

export default app;