import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import { setupSwagger } from './config/swagger';
import router from './routes';
import { errorHandler } from './middleware/error.middleware';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

setupSwagger(app);

// Routes
app.use('/api', router);

// Error handler
app.use(errorHandler);

export default app;
