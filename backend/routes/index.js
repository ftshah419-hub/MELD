import { Router } from 'express';
import authRoutes from './authRoutes.js';
import paymentRoutes from './paymentRoutes.js';
import uploadRoutes from './uploadRoutes.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

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

// Helper placeholder router for Person 2
const createUserModulePlaceholder = (moduleName, filename) => {
  const stub = Router();
  stub.use((req, res) => {
    res.status(501).json({
      success: false,
      message: `${moduleName} is pending Person 2 integration. Drop routes in backend/routes/${filename}.`,
      owner: 'Person 2 — User Backend'
    });
  });
  return stub;
};

// Integration mounting points for Person 2
router.use('/user', authenticate, createUserModulePlaceholder('User Dashboard & Profile APIs', 'userRoutes.js'));
router.use('/wisdom-loop', createUserModulePlaceholder('Wisdom Loop Mentorship Module', 'wisdomLoopRoutes.js'));
router.use('/craft', createUserModulePlaceholder('Craft to Cart Marketplace Module', 'craftRoutes.js'));
router.use('/reconnect', createUserModulePlaceholder('ReConnect Electronics Reuse Module', 'reconnectRoutes.js'));
router.use('/book-bridge', createUserModulePlaceholder('Book Bridge Library Module', 'bookBridgeRoutes.js'));
router.use('/second-serve', createUserModulePlaceholder('Second Serve Food Rescue Module', 'secondServeRoutes.js'));

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
