import { Router } from 'express';
import { reconnectController } from '../controllers/reconnectController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

// Public discovery endpoints
router.get('/devices', reconnectController.getDevices);
router.get('/devices/:id', reconnectController.getDeviceById);

// Protected user device management & requests
router.post('/devices', authenticate, reconnectController.createDevice);
router.put('/devices/:id', authenticate, reconnectController.updateDevice);
router.delete('/devices/:id', authenticate, reconnectController.deleteDevice);
router.get('/my-listings', authenticate, reconnectController.getMyListings);

router.post('/requests', authenticate, reconnectController.requestDevice);
router.post('/devices/:deviceId/request', authenticate, reconnectController.requestDevice);
router.get('/my-requests', authenticate, reconnectController.getMyRequests);
router.get('/incoming-requests', authenticate, reconnectController.getIncomingRequests);
router.patch('/requests/:id/respond', authenticate, reconnectController.respondToRequest);
router.patch('/devices/:id/complete', authenticate, reconnectController.completeDevice);

export default router;
