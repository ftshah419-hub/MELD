import { Router } from 'express';
import {
  getDashboardOverview,
  getPlatformSettings,
  updatePlatformSettings
} from '../controllers/adminController.js';
import {
  getUsers,
  getUserDetails,
  updateUserStatus
} from '../controllers/adminUserController.js';
import {
  getPendingVerifications,
  reviewMentor,
  reviewArtisan,
  reviewProduct,
  reviewListing
} from '../controllers/adminModerationController.js';
import {
  getReports,
  getReportDetails,
  updateReportStatus,
  createReport
} from '../controllers/adminReportController.js';
import {
  getPayments,
  getPaymentDetails,
  getContributions
} from '../controllers/adminPaymentController.js';
import {
  getWisdomLoopData,
  getCraftToCartData,
  getReConnectData,
  getBookBridgeData,
  getSecondServeData,
  getRequests,
  getOrders
} from '../controllers/adminModuleController.js';
import {
  getAnalytics,
  exportReportCsv
} from '../controllers/adminAnalyticsController.js';
import { getAuditLogs } from '../controllers/adminAuditController.js';
import {
  getAdminNotifications,
  markNotificationRead,
  broadcastAnnouncement
} from '../controllers/adminNotificationController.js';
import {
  validateIdParam,
  validateUserStatusUpdate,
  validateModerationDecision,
  validateReportStatusUpdate,
  validatePagination
} from '../validators/adminValidator.js';

const router = Router();

// ==========================================
// 1. DASHBOARD & SYSTEM GOVERNANCE
// ==========================================
router.get('/dashboard', getDashboardOverview);
router.get('/settings', getPlatformSettings);
router.put('/settings', updatePlatformSettings);

// ==========================================
// 2. USER MANAGEMENT
// ==========================================
router.get('/users', validatePagination, getUsers);
router.get('/users/:id', validateIdParam('id'), getUserDetails);
router.patch('/users/:id/status', validateIdParam('id'), validateUserStatusUpdate, updateUserStatus);

// ==========================================
// 3. MODERATION & VERIFICATION QUEUE
// ==========================================
router.get('/moderation/queue', getPendingVerifications);
router.patch('/mentors/:id/review', validateIdParam('id'), validateModerationDecision, reviewMentor);
router.patch('/artisans/:id/review', validateIdParam('id'), validateModerationDecision, reviewArtisan);
router.patch('/products/:id/review', validateIdParam('id'), validateModerationDecision, reviewProduct);
router.patch('/listings/:type/:id/status', validateIdParam('id'), reviewListing);

// ==========================================
// 4. REPORTS & COMPLAINTS
// ==========================================
router.get('/reports', validatePagination, getReports);
router.post('/reports', createReport);
router.get('/reports/:id', validateIdParam('id'), getReportDetails);
router.patch('/reports/:id/status', validateIdParam('id'), validateReportStatusUpdate, updateReportStatus);

// ==========================================
// 5. TRANSACTIONS, PAYMENTS & CONTRIBUTIONS
// ==========================================
router.get('/payments', validatePagination, getPayments);
router.get('/payments/:id', validateIdParam('id'), getPaymentDetails);
router.get('/contributions', validatePagination, getContributions);
router.get('/orders', validatePagination, getOrders);

// ==========================================
// 6. MODULE-SPECIFIC ADMINISTRATION
// ==========================================
router.get('/wisdom-loop', getWisdomLoopData);
router.get('/craft-to-cart', getCraftToCartData);
router.get('/reconnect', getReConnectData);
router.get('/book-bridge', getBookBridgeData);
router.get('/second-serve', getSecondServeData);
router.get('/requests', validatePagination, getRequests);

// ==========================================
// 7. ANALYTICS & AUDIT TRAILS
// ==========================================
router.get('/analytics', getAnalytics);
router.get('/analytics/export', exportReportCsv);
router.get('/audit-logs', validatePagination, getAuditLogs);

// ==========================================
// 8. NOTIFICATIONS & BROADCASTS
// ==========================================
router.get('/notifications', validatePagination, getAdminNotifications);
router.patch('/notifications/:id/read', validateIdParam('id'), markNotificationRead);
router.post('/notifications/broadcast', broadcastAnnouncement);

export default router;
