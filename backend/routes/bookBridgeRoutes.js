import { Router } from 'express';
import { bookBridgeController } from '../controllers/bookBridgeController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

// Public discovery endpoints
router.get('/books', bookBridgeController.getBooks);
router.get('/books/:id', bookBridgeController.getBookById);

// Protected user book management & requests
router.post('/books', authenticate, bookBridgeController.createBook);
router.put('/books/:id', authenticate, bookBridgeController.updateBook);
router.delete('/books/:id', authenticate, bookBridgeController.deleteBook);
router.get('/my-listings', authenticate, bookBridgeController.getMyListings);

router.post('/requests', authenticate, bookBridgeController.requestBook);
router.post('/books/:bookId/request', authenticate, bookBridgeController.requestBook);
router.get('/my-requests', authenticate, bookBridgeController.getMyRequests);
router.get('/incoming-requests', authenticate, bookBridgeController.getIncomingRequests);
router.patch('/requests/:id/respond', authenticate, bookBridgeController.respondToRequest);
router.patch('/books/:id/complete', authenticate, bookBridgeController.completeBook);

export default router;
