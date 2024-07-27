import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/authRoutes';

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use('/api/auth', authRoutes);

export default app;