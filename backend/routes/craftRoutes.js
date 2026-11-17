import { Router } from 'express';
import { craftController } from '../controllers/craftController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

// Public discovery endpoints
router.get('/products', craftController.getProducts);
router.get('/products/:id', craftController.getProductById);

// Protected shopping & checkout endpoints
router.post('/orders', authenticate, craftController.createOrder);
router.post('/orders/verify', authenticate, craftController.verifyOrderPayment);

// Protected artisan studio endpoints
router.get('/artisan-profile', authenticate, craftController.getArtisanProfile);
router.post('/artisan-profile', authenticate, craftController.saveArtisanProfile);
router.get('/artisan/products', authenticate, craftController.getMyArtisanProducts);
router.post('/artisan/products', authenticate, craftController.createProduct);
router.put('/artisan/products/:id', authenticate, craftController.updateProduct);
router.delete('/artisan/products/:id', authenticate, craftController.deleteProduct);
router.get('/artisan/orders', authenticate, craftController.getArtisanOrders);
router.patch('/artisan/orders/:id/status', authenticate, craftController.updateOrderStatus);

export default router;
