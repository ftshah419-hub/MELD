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

// Requests endpoints (supporting both /requests and /my-requests)
router.get('/requests', userController.getMyRequests);
router.get('/my-requests', userController.getMyRequests);
router.patch('/requests/:id/cancel', userController.cancelRequest);
router.patch('/my-requests/:id/cancel', userController.cancelRequest);

// Orders endpoints (Craft to Cart - supporting both /orders and /my-orders)
router.get('/orders', userController.getMyOrders);
router.get('/my-orders', userController.getMyOrders);
router.get('/orders/:id', userController.getOrderById);
router.get('/my-orders/:id', userController.getOrderById);
router.patch('/orders/:id/cancel', userController.cancelOrder);
router.patch('/my-orders/:id/cancel', userController.cancelOrder);

// Voluntary Contributions endpoints (supporting both /contributions and /my-contributions)
router.get('/contributions', userController.getMyContributions);
router.get('/my-contributions', userController.getMyContributions);
router.post('/contributions', userController.createContribution);
router.post('/contributions/verify', userController.verifyContribution);

// Notifications endpoints
router.get('/notifications', userController.getNotifications);
// Specific actions must come before parameterized :id routes
router.patch('/notifications/read-all', userController.markAllNotificationsRead);
router.patch('/notifications/all/read', userController.markAllNotificationsRead);
router.patch('/notifications/mark-all-read', userController.markAllNotificationsRead);
router.patch('/notifications/:id/read', userController.markNotificationRead);

export default router;
