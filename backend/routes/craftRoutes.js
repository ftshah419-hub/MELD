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

// Product creation & management (supporting both /products and /artisan/products)
router.post('/products', authenticate, craftController.createProduct);
router.post('/artisan/products', authenticate, craftController.createProduct);
router.get('/my-products', authenticate, craftController.getMyArtisanProducts);
router.get('/artisan/products', authenticate, craftController.getMyArtisanProducts);
router.put('/products/:id', authenticate, craftController.updateProduct);
router.put('/artisan/products/:id', authenticate, craftController.updateProduct);
router.delete('/products/:id', authenticate, craftController.deleteProduct);
router.delete('/artisan/products/:id', authenticate, craftController.deleteProduct);

// Artisan orders fulfillment (supporting both /artisan/orders and /artisan-orders)
router.get('/artisan/orders', authenticate, craftController.getArtisanOrders);
router.get('/artisan-orders', authenticate, craftController.getArtisanOrders);
router.patch('/artisan/orders/:id/status', authenticate, craftController.updateOrderStatus);
router.patch('/artisan-orders/:id/status', authenticate, craftController.updateOrderStatus);

export default router;
