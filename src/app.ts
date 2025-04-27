import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import { setupSwagger } from './config/swagger';
import router from './routes';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

setupSwagger(app);

// Routes
app.use('/api', router);

export default app;
