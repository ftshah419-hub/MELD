import mongoose from 'mongoose';
import { Product } from '../models/Product.js';
import { Order } from '../models/Order.js';
import { ArtisanProfile } from '../models/ArtisanProfile.js';
import { User } from '../models/User.js';
import { Notification } from '../models/Notification.js';
import { paymentService } from '../services/paymentService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/ApiError.js';

export const craftController = {
  /**
   * Browse craft products with search, categories, and price filters
   */
  getProducts: asyncHandler(async (req, res) => {
    if (mongoose.connection.readyState !== 1) {
      const fallbackProducts = [
        {
          _id: 'p1',
          title: 'Hand-thrown Terracotta Water Urn',
          category: 'Pottery',
          price: 850,
          stock: 12,
          craftOrigin: 'Alwar, Rajasthan',
          artisanName: 'Bhanwar Lal Kumhar',
          artisanStory: 'Crafted using porous natural river clay.',
          materials: ['Terracotta', 'Natural Red Ochre'],
          images: ['https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80']
        },
        {
          _id: 'p2',
          title: 'Ikat Silk-Cotton Stole',
          category: 'Handloom',
          price: 1850,
          stock: 7,
          craftOrigin: 'Pochampally, Telangana',
          artisanName: 'Lakshmi & Weaver Collective',
          artisanStory: 'Tie-dyed warp yarns aligned by hand on ancestral pit looms.',
          materials: ['Mulberry Silk', 'Organic Cotton'],
          images: ['https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=600&q=80']
        }
      ];
      return sendResponse(res, 200, 'Craft products retrieved successfully', {
        products: fallbackProducts,
        total: fallbackProducts.length,
        page: 1,
        pages: 1
      });
    }

    const {
      search,
      category,
      minPrice,
      maxPrice,
      artisanId,
      inStock,
      sort = 'newest',
      limit = 24,
      page = 1
    } = req.query;

    const filter = { status: 'ACTIVE' };

    if (category && category !== 'all') {
      filter.category = new RegExp(`^${category}$`, 'i');
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (artisanId) {
      filter.artisanId = artisanId;
    }

    if (inStock === 'true') {
      filter.stock = { $gt: 0 };
    }

    let sortOptions = { createdAt: -1 };
    if (sort === 'price_asc') sortOptions = { price: 1 };
    if (sort === 'price_desc') sortOptions = { price: -1 };
    if (sort === 'stock') sortOptions = { stock: -1 };

    const skip = (Number(page) - 1) * Number(limit);

    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate('artisanId', 'fullName profileImage')
        .sort(sortOptions)
        .skip(skip)
        .limit(Number(limit)),
      Product.countDocuments(filter)
    ]);

    let results = products;
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      results = products.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q) ||
          p.artisanId?.fullName?.toLowerCase().includes(q)
      );
    }

    return sendResponse(res, 200, 'Products retrieved successfully', {
      products: results,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit))
    });
  }),

  /**
   * Get single product detail by ID
   */
  getProductById: asyncHandler(async (req, res) => {
    const { id } = req.params;

    const product = await Product.findById(id).populate(
      'artisanId',
      'fullName email profileImage bio'
    );

    if (!product) {
      throw ApiError.notFound('Craft product not found.');
    }

    // Fetch artisan profile for heritage story
    const artisanProfile = await ArtisanProfile.findOne({ userId: product.artisanId?._id });

    return sendResponse(res, 200, 'Product details retrieved', {
      product,
      artisanProfile: artisanProfile || null
    });
  }),

  /**
   * Create an order with authoritative price calculation and Razorpay order initialization
   */
  createOrder: asyncHandler(async (req, res) => {
    const buyerId = req.user.id || req.user._id;
    const { items, shippingAddress } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      throw ApiError.badRequest('Order items are required.');
    }

    if (!shippingAddress || !shippingAddress.street || !shippingAddress.city) {
      throw ApiError.badRequest('Complete shipping address (street, city, state, postalCode) is required.');
    }

    // 1. Authoritative server-side stock & price verification
    let verifiedTotal = 0;
    const verifiedItems = [];

    for (const item of items) {
      const prod = await Product.findById(item.productId);
      if (!prod || prod.status !== 'ACTIVE') {
        throw ApiError.badRequest(`Product "${item.productId}" is not available.`);
      }

      const qty = Number(item.quantity) || 1;
      if (qty > prod.stock) {
        throw ApiError.badRequest(
          `Requested quantity (${qty}) for "${prod.title}" exceeds available stock (${prod.stock}).`
        );
      }

      verifiedTotal += prod.price * qty;
      verifiedItems.push({
        productId: prod._id,
        quantity: qty,
        priceAtPurchase: prod.price
      });
    }

    // 2. Create pending internal Order
    const order = await Order.create({
      buyerId,
      items: verifiedItems,
      totalAmount: verifiedTotal,
      shippingAddress,
      paymentStatus: 'PENDING',
      orderStatus: 'PLACED'
    });

    // 3. Initiate payment order via shared payment service
    const paymentOrder = await paymentService.createPaymentOrder({
      userId: buyerId,
      paymentType: 'PRODUCT_PURCHASE',
      module: 'CRAFT_TO_CART',
      amount: verifiedTotal,
      orderId: order._id,
      notes: {
        orderId: order._id.toString(),
        itemCount: verifiedItems.length.toString()
      }
    });

    order.paymentId = paymentOrder.paymentId;
    await order.save();

    return sendResponse(res, 201, 'Order created and payment initialized', {
      order,
      paymentOrder
    });
  }),

  /**
   * Verify completed Razorpay payment and fulfill order
   */
  verifyOrderPayment: asyncHandler(async (req, res) => {
    const buyerId = req.user.id || req.user._id;
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    if (!orderId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      throw ApiError.badRequest('orderId, razorpayOrderId, razorpayPaymentId, and signature are required.');
    }

    const order = await Order.findOne({ _id: orderId, buyerId }).populate('items.productId');
    if (!order) {
      throw ApiError.notFound('Order not found or unauthorized.');
    }

    // Verify cryptographic signature via shared payment service, or handle dev simulation safely
    let verifyResult;
    if (razorpaySignature.startsWith('simulated_') && process.env.NODE_ENV !== 'production') {
      const payment = await Payment.findOne({ razorpayOrderId });
      if (payment) {
        payment.status = 'SUCCESS';
        payment.razorpayPaymentId = razorpayPaymentId;
        payment.razorpaySignature = razorpaySignature;
        await payment.save();
      }
      verifyResult = { payment: payment || { status: 'SUCCESS' } };
    } else {
      verifyResult = await paymentService.verifyPayment({
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature
      });
    }

    if (order.paymentStatus !== 'COMPLETED') {
      order.paymentStatus = 'COMPLETED';
      order.orderStatus = 'PROCESSING';
      await order.save();

      // Decrement product stock safely
      for (const item of order.items) {
        const prod = await Product.findById(item.productId?._id || item.productId);
        if (prod) {
          prod.stock = Math.max(0, prod.stock - item.quantity);
          if (prod.stock === 0) {
            prod.status = 'OUT_OF_STOCK';
          }
          await prod.save();

          // Increment artisan sales metrics
          await ArtisanProfile.findOneAndUpdate(
            { userId: prod.artisanId },
            { $inc: { totalSales: item.quantity * prod.price } }
          );

          // Notify artisan
          await Notification.create({
            userId: prod.artisanId,
            title: 'New Craft Order Received!',
            message: `Someone purchased ${item.quantity}x of "${prod.title}". Order ID: ${order._id}.`,
            type: 'ORDER',
            link: '/user/craft-to-cart/orders'
          });
        }
      }

      // Notify buyer
      await Notification.create({
        userId: buyerId,
        title: 'Payment Successful — Order Confirmed',
        message: `Your payment of ₹${order.totalAmount} was verified. Order #${order._id} is now processing.`,
        type: 'PAYMENT',
        link: '/user/craft-to-cart/orders'
      });
    }

    return sendResponse(res, 200, 'Payment verified and order confirmed', {
      order,
      payment: verifyResult.payment
    });
  }),

  /**
   * Get user's own artisan profile
   */
  getArtisanProfile: asyncHandler(async (req, res) => {
    const userId = req.user.id || req.user._id;

    const profile = await ArtisanProfile.findOne({ userId });

    return sendResponse(res, 200, 'Artisan profile retrieved', {
      artisanProfile: profile || null,
      isArtisan: !!profile && profile.verificationStatus === 'VERIFIED'
    });
  }),

  /**
   * Apply / update artisan profile
   */
  saveArtisanProfile: asyncHandler(async (req, res) => {
    const userId = req.user.id || req.user._id;
    const { craftSpecialty, region, heritageStory } = req.body;

    if (!craftSpecialty || !region) {
      throw ApiError.badRequest('Craft specialty and region are required.');
    }

    let profile = await ArtisanProfile.findOne({ userId });

    if (profile) {
      profile.craftSpecialty = craftSpecialty.trim();
      profile.region = region.trim();
      profile.heritageStory = heritageStory ? heritageStory.trim() : '';
      profile.verificationStatus = 'VERIFIED'; // Community verification auto-approved
      await profile.save();
    } else {
      profile = await ArtisanProfile.create({
        userId,
        craftSpecialty: craftSpecialty.trim(),
        region: region.trim(),
        heritageStory: heritageStory ? heritageStory.trim() : '',
        verificationStatus: 'VERIFIED' // Community verification auto-approved
      });
    }

    return sendResponse(res, 201, 'Artisan profile saved successfully', { artisanProfile: profile });
  }),

  /**
   * Artisan: Get own products
   */
  getMyArtisanProducts: asyncHandler(async (req, res) => {
    const userId = req.user.id || req.user._id;

    const products = await Product.find({ artisanId: userId }).sort({ createdAt: -1 });

    return sendResponse(res, 200, 'Artisan products retrieved', { products });
  }),

  /**
   * Artisan: Add new craft product
   */
  createProduct: asyncHandler(async (req, res) => {
    const userId = req.user.id || req.user._id;
    const { title, description, price, stock, category, images } = req.body;

    if (!title || !description || !price || !category) {
      throw ApiError.badRequest('Title, description, price, and category are required.');
    }

    if (Number(price) < 1) {
      throw ApiError.badRequest('Price must be at least 1 INR.');
    }

    // Auto-create basic artisan profile if not existing
    let artisan = await ArtisanProfile.findOne({ userId });
    if (!artisan) {
      artisan = await ArtisanProfile.create({
        userId,
        craftSpecialty: category,
        region: 'Local Artisan Hub',
        verificationStatus: 'VERIFIED'
      });
    }

    const formattedImages = Array.isArray(images) && images.length > 0
      ? images.map((img) => (typeof img === 'string' ? { url: img, publicId: null } : img))
      : [{ url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80', publicId: null }];

    const product = await Product.create({
      artisanId: userId,
      title: title.trim(),
      description: description.trim(),
      price: Number(price),
      stock: Number(stock) || 1,
      category: category.trim(),
      images: formattedImages,
      status: 'ACTIVE'
    });

    return sendResponse(res, 201, 'Product created successfully', { product });
  }),

  /**
   * Artisan: Update own product
   */
  updateProduct: asyncHandler(async (req, res) => {
    const userId = req.user.id || req.user._id;
    const { id } = req.params;
    const { title, description, price, stock, category, images, status } = req.body;

    const product = await Product.findOne({ _id: id, artisanId: userId });
    if (!product) {
      throw ApiError.notFound('Product not found or unauthorized.');
    }

    if (title) product.title = title.trim();
    if (description) product.description = description.trim();
    if (price !== undefined) product.price = Number(price);
    if (stock !== undefined) product.stock = Number(stock);
    if (category) product.category = category.trim();
    if (status) product.status = status;
    if (images && Array.isArray(images)) {
      product.images = images.map((img) => (typeof img === 'string' ? { url: img, publicId: null } : img));
    }

    await product.save();

    return sendResponse(res, 200, 'Product updated successfully', { product });
  }),

  /**
   * Artisan: Delete / archive own product
   */
  deleteProduct: asyncHandler(async (req, res) => {
    const userId = req.user.id || req.user._id;
    const { id } = req.params;

    const product = await Product.findOneAndDelete({ _id: id, artisanId: userId });
    if (!product) {
      throw ApiError.notFound('Product not found or unauthorized.');
    }

    return sendResponse(res, 200, 'Product deleted successfully');
  }),

  /**
   * Artisan: Get incoming orders for artisan's products
   */
  getArtisanOrders: asyncHandler(async (req, res) => {
    const userId = req.user.id || req.user._id;

    // Find all products owned by artisan
    const products = await Product.find({ artisanId: userId }).select('_id');
    const productIds = products.map((p) => p._id);

    const orders = await Order.find({
      'items.productId': { $in: productIds }
    })
      .populate('items.productId')
      .populate('buyerId', 'fullName email phone')
      .sort({ createdAt: -1 });

    return sendResponse(res, 200, 'Artisan incoming orders retrieved', { orders });
  }),

  /**
   * Artisan: Update order fulfillment status
   */
  updateOrderStatus: asyncHandler(async (req, res) => {
    const userId = req.user.id || req.user._id;
    const { id } = req.params;
    const { orderStatus } = req.body;

    const allowed = ['PROCESSING', 'SHIPPED', 'DELIVERED'];
    if (!allowed.includes(orderStatus)) {
      throw ApiError.badRequest(`Invalid order status. Allowed: ${allowed.join(', ')}`);
    }

    const order = await Order.findById(id).populate('items.productId');
    if (!order) {
      throw ApiError.notFound('Order not found.');
    }

    // Verify artisan owns at least one product in this order
    const isOwner = order.items.some((item) => item.productId?.artisanId?.toString() === userId.toString());
    if (!isOwner && req.user.role !== 'ADMIN') {
      throw ApiError.forbidden('Unauthorized to update this order.');
    }

    order.orderStatus = orderStatus;
    await order.save();

    // Notify buyer
    await Notification.create({
      userId: order.buyerId,
      title: `Order #${order._id} ${orderStatus}`,
      message: `Your order status has been updated to "${orderStatus}".`,
      type: 'ORDER',
      link: '/user/craft-to-cart/orders'
    });

    return sendResponse(res, 200, 'Order status updated successfully', { order });
  })
};

export default craftController;
