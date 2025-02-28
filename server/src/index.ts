import { config } from 'dotenv';
config({ path: './.env' });
import express from 'express';
import passport from 'passport';
import authRoutes from './routes/auth';

require('./strategies/google');

const app = express();

app.use(passport.initialize());
app.use('/api/auth', authRoutes);

export default app;