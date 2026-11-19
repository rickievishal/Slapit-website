import express from 'express';
import cors from 'cors';
import path from 'path';
import { env } from './config/env';
import productRoutes from './routes/productRoutes';
import categoryRoutes from './routes/categoryRoutes';
import authRoutes from './routes/authRoutes';
import orderRoutes from './routes/orderRoutes';
import uploadRoutes from './routes/uploadRoutes';
import seoRoutes from './routes/seoRoutes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

const app = express();

// Middlewares
const allowedOrigins = [
  env.CLIENT_URL,
  'https://slapitposters.itsmevishal.in',
  'https://slapit-website.vercel.app',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Static uploads folder
app.use(
  '/uploads',
  express.static(path.resolve(__dirname, '../uploads'))
);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ success: true, status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/seo', seoRoutes);

// Routes
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);

// Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
