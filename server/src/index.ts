import { config } from 'dotenv';
config({ path: './.env' });
import express from 'express';
import passport from 'passport';
import authRoutes from './routes/auth';
import videoRouter from './routes/video';
import fileUpload from 'express-fileupload';

require('./strategies/google');

const app = express();

app.use(express.json());
app.use(fileUpload());
app.use(passport.initialize());
app.use('/api/auth', authRoutes);
app.use('/api/video', videoRouter);

export default app;