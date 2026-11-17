import { Router } from 'express';
import { secondServeController } from '../controllers/secondServeController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

// Public discovery endpoints
router.get('/donations', secondServeController.getDonations);
router.get('/donations/:id', secondServeController.getDonationById);

// Protected food donation management & rescue claims
router.post('/donations', authenticate, secondServeController.createDonation);
router.put('/donations/:id', authenticate, secondServeController.updateDonation);
router.delete('/donations/:id', authenticate, secondServeController.deleteDonation);
router.get('/my-donations', authenticate, secondServeController.getMyDonations);

// Claims / Requests (supporting both /requests and /claims /donations/:id/claim)
router.post('/requests', authenticate, secondServeController.requestFood);
router.post('/donations/:id/claim', authenticate, secondServeController.requestFood);

router.get('/my-requests', authenticate, secondServeController.getMyRequests);
router.get('/my-claims', authenticate, secondServeController.getMyRequests);

router.get('/incoming-requests', authenticate, secondServeController.getIncomingRequests);
router.get('/incoming-claims', authenticate, secondServeController.getIncomingRequests);

router.patch('/requests/:id/respond', authenticate, secondServeController.respondToRequest);
router.patch('/claims/:id/respond', authenticate, secondServeController.respondToRequest);

router.patch('/donations/:id/complete', authenticate, secondServeController.completeDonation);

export default router;
