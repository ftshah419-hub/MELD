import { Router } from 'express';
import authRoutes from './authRoutes.js';
import paymentRoutes from './paymentRoutes.js';
import uploadRoutes from './uploadRoutes.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

// Person 2: User Module Routes
import userRoutes from './userRoutes.js';
import wisdomLoopRoutes from './wisdomLoopRoutes.js';
import craftRoutes from './craftRoutes.js';
import reconnectRoutes from './reconnectRoutes.js';
import bookBridgeRoutes from './bookBridgeRoutes.js';
import secondServeRoutes from './secondServeRoutes.js';

const router = Router();

// ==========================================
// PERSON 1: SHARED FOUNDATION ROUTES
// ==========================================

router.use('/auth', authRoutes);
router.use('/payments', paymentRoutes);
router.use('/uploads', uploadRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'MELD API Server is active and healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// ==========================================
// PERSON 2: USER MODULE INTEGRATION HOOKS
// ==========================================

// Integration mounting points for Person 2
router.use('/user', authenticate, userRoutes);
router.use('/wisdom-loop', wisdomLoopRoutes);
router.use('/craft', craftRoutes);
router.use('/reconnect', reconnectRoutes);
router.use('/book-bridge', bookBridgeRoutes);
router.use('/second-serve', secondServeRoutes);

// ==========================================
// PERSON 3: ADMIN MODULE INTEGRATION HOOKS
// ==========================================

const adminPlaceholder = Router();
adminPlaceholder.use((req, res) => {
  res.status(501).json({
    success: false,
    message: 'Admin Dashboard APIs are pending Person 3 integration. Drop routes in backend/routes/adminRoutes.js.',
    owner: 'Person 3 — Admin Backend'
  });
});

// Admin routes guarded by authenticate and authorizeRoles('ADMIN')
router.use('/admin', authenticate, authorizeRoles('ADMIN'), adminPlaceholder);

export default router;
