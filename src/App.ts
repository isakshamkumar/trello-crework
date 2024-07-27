import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/authRoutes';
import taskRoutes from './routes/taskRoutes';
const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/tasks', taskRoutes);

export default app;