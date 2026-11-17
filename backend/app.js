import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';

import routes from './routes/index.js';
import notFoundMiddleware from './middleware/notFoundMiddleware.js';
import errorMiddleware from './middleware/errorMiddleware.js';

const app = express();

// 1. Security HTTP Headers
// Disable CSP on REST API to allow client Vite HMR and browser extensions to operate without eval violations
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' }
  })
);

// 2. Cross-Origin Resource Sharing (CORS) with Credentials
const baseOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173'
];

const envOrigins = (process.env.CLIENT_URL || '')
  .split(',')
  .map((url) => url.trim().replace(/\/$/, ''))
  .filter(Boolean);

const isOriginAllowed = (origin) => {
  if (!origin) return true; // Mobile apps, Postman, curl, server-to-server
  if (baseOrigins.includes(origin)) return true;
  if (envOrigins.includes(origin)) return true;
  try {
    const url = new URL(origin);
    if (url.hostname.endsWith('.vercel.app') || url.hostname === 'vercel.app') {
      return true;
    }
  } catch {
    // Malformed origin
  }
  return false;
};

app.use(
  cors({
    origin: (origin, callback) => {
      if (isOriginAllowed(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked for origin: ${origin}`), false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-razorpay-signature', 'X-Requested-With']
  })
);

// 3. HTTP Request Logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

// 4. Body Parsers (with raw body buffer extraction for Razorpay webhook verification)
app.use(
  express.json({
    limit: '10mb',
    verify: (req, res, buf) => {
      if (req.originalUrl && req.originalUrl.includes('/payments/webhook')) {
        req.rawBody = buf.toString();
      }
    }
  })
);
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 5. Cookie Parser with Session Secret
app.use(cookieParser(process.env.SESSION_SECRET || 'meld_cookie_secret_fallback'));

// 6. Rate Limiting on Authentication Routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 auth requests per 15 min
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many login or registration requests from this IP. Please try again after 15 minutes.'
  }
});
app.use('/api/auth', authLimiter);

// 7. Mount Central API Routes
app.use('/api', routes);

// 8. 404 Catch-All Middleware
app.use(notFoundMiddleware);

// 9. Centralized Error Handling Middleware
app.use(errorMiddleware);

export default app;
