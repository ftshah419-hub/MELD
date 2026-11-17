import { Router } from 'express';
import { userController } from '../controllers/userController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

// Apply authentication middleware across all user profile & dashboard endpoints
router.use(authenticate);

// Profile endpoints
router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);

// Dashboard overview
router.get('/dashboard-summary', userController.getDashboardSummary);

// Requests endpoints
router.get('/requests', userController.getMyRequests);
router.patch('/requests/:id/cancel', userController.cancelRequest);

// Orders endpoints (Craft to Cart)
router.get('/orders', userController.getMyOrders);
router.get('/orders/:id', userController.getOrderById);
router.patch('/orders/:id/cancel', userController.cancelOrder);

// Voluntary Contributions endpoints
router.get('/contributions', userController.getMyContributions);
router.post('/contributions', userController.createContribution);
router.post('/contributions/verify', userController.verifyContribution);

// Notifications endpoints
router.get('/notifications', userController.getNotifications);
router.patch('/notifications/read-all', userController.markAllNotificationsRead);
router.patch('/notifications/:id/read', userController.markNotificationRead);

export default router;
