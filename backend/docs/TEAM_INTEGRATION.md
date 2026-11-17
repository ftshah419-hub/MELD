# MELD — Team Integration Guide (Backend)

Welcome to the MELD Backend Architecture. This document explains how Person 2 (User Backend) and Person 3 (Admin Backend) can build and mount their module functionality seamlessly without conflicting with shared foundation infrastructure.

---

## 1. Team Ownership Boundaries

| Member | Domain | Owns | Protected Files |
| :--- | :--- | :--- | :--- |
| **Person 1** | **Shared Foundation** | Server, DB, Auth, Payments, Uploads, Middleware, Coordinated Models | `server.js`, `app.js`, `config/`, `middleware/`, `models/`, `utils/`, `services/`, `routes/index.js` |
| **Person 2** | **User Backend** | User Profile, 5 Module Workflows (Wisdom, Craft, ReConnect, Books, Food) | `routes/userRoutes.js`, `controllers/userController.js`, `routes/wisdomLoopRoutes.js`, `routes/craftRoutes.js`, etc. |
| **Person 3** | **Admin Backend** | Admin Management, Analytics, Moderation, Complaints, Reports | `routes/adminRoutes.js`, `controllers/adminController.js` |

---

## 2. Instructions for Person 2 — User Module Backend

### Step 1: Create Your Controller and Routes
Inside `backend/controllers/` and `backend/routes/`:
- Create `backend/controllers/userController.js`
- Create `backend/routes/userRoutes.js`
- Create module routes:
  - `backend/routes/wisdomLoopRoutes.js`
  - `backend/routes/craftRoutes.js`
  - `backend/routes/reconnectRoutes.js`
  - `backend/routes/bookBridgeRoutes.js`
  - `backend/routes/secondServeRoutes.js`

### Step 2: Use Shared Utilities and Middleware
You do not need to write custom authentication or error-handling boilerplate. Reuse the shared foundation:

```javascript
import { Router } from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { User } from '../models/User.js';
import { MentorProfile } from '../models/MentorProfile.js';

const router = Router();

// Example: Get user profile (Protected)
router.get('/profile', authenticate, asyncHandler(async (req, res) => {
  // req.user is automatically populated by authenticate middleware
  const user = await User.findById(req.user.id);
  return sendResponse(res, 200, 'User profile retrieved', { user: user.toSafeObject() });
}));

export default router;
```

### Step 3: Mount Your Routes in `backend/routes/index.js`
In `backend/routes/index.js`, replace the placeholder stub with your imported router:
```javascript
import userRoutes from './userRoutes.js';
import wisdomLoopRoutes from './wisdomLoopRoutes.js';
// ...
router.use('/user', authenticate, userRoutes);
router.use('/wisdom-loop', wisdomLoopRoutes);
```

---

## 3. Instructions for Person 3 — Admin Module Backend

### Step 1: Create Admin Controller and Routes
- Create `backend/controllers/adminController.js`
- Create `backend/routes/adminRoutes.js`

### Step 2: Guarding Endpoints with Admin Authorization
All admin endpoints must be protected using `authenticate` and `authorizeRoles('ADMIN')`:

```javascript
import { Router } from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendResponse } from '../utils/apiResponse.js';
import { User } from '../models/User.js';
import { AdminAuditLog } from '../models/AdminAuditLog.js';

const router = Router();

// Apply admin guard across all admin routes:
router.use(authenticate, authorizeRoles('ADMIN'));

// Example: Get all users with status
router.get('/users', asyncHandler(async (req, res) => {
  const users = await User.find().select('-passwordHash').sort({ createdAt: -1 });
  
  // Log admin action for compliance
  await AdminAuditLog.create({
    adminId: req.user.id,
    action: 'VIEW_ALL_USERS',
    targetType: 'USER',
    details: { count: users.length },
    ipAddress: req.ip
  });

  return sendResponse(res, 200, 'User list retrieved for administration', { users });
}));

export default router;
```

### Step 3: Mount in `backend/routes/index.js`
In `backend/routes/index.js`:
```javascript
import adminRoutes from './adminRoutes.js';
// Replace the adminPlaceholder:
router.use('/admin', authenticate, authorizeRoles('ADMIN'), adminRoutes);
```

---

## 4. Handling Image Uploads in Your Modules

To upload images for Products, Devices, Books, or Food Donations:

```javascript
import { uploadSingleImage, uploadMultipleImages } from '../middleware/uploadMiddleware.js';
import { cloudinaryService } from '../services/cloudinaryService.js';

router.post('/products', authenticate, uploadSingleImage, asyncHandler(async (req, res) => {
  let imageData = null;
  if (req.file) {
    imageData = await cloudinaryService.uploadImageBuffer(req.file.buffer, 'meld/crafts');
  }
  // save product with imageData.url and imageData.publicId
}));
```

---

## 5. Absolute Collaboration Rules

1. Never bypass the `authenticate` or `authorizeRoles` middleware.
2. Never trust prices or roles sent in client HTTP request bodies.
3. Never modify the core `Users`, `Payments`, or `Sessions` collections without consulting Person 1.
4. Always wrap async controller logic with `asyncHandler`.
5. Return standardized responses via `sendResponse(res, status, message, data)`.
