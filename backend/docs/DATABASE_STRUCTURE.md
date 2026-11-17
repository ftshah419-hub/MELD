# MELD — MongoDB & Mongoose Database Structure

This document outlines the complete Mongoose schema implementation conforming to the official MELD ER diagram.

---

## 1. Core Collections

### 1. `Users` (`models/User.js`)
Stores all account identities (both community members and administrators).

| Field | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Primary Key | Auto-generated identifier |
| `fullName` | String | Required, Trim, 2-100 chars | Display name |
| `email` | String | Required, Unique, Lowercase, Indexed | Normalized login email |
| `passwordHash` | String | Required, `select: false` | bcrypt hashed password |
| `role` | String | Enum: `['USER', 'ADMIN']`, Default: `'USER'` | Access control tier |
| `profileImage` | Object | `{ url: String, publicId: String }` | Avatar from Cloudinary |
| `phone` | String | Optional, Trim | Contact telephone |
| `bio` | String | Max 500 chars | Personal introduction |
| `accountStatus`| String | Enum: `['ACTIVE', 'SUSPENDED', 'INACTIVE']` | Moderation status |
| `lastLogin` | Date | Default: null | Timestamp of most recent login |
| `createdAt` | Date | Timestamp | Account creation date |
| `updatedAt` | Date | Timestamp | Last update date |

### 2. `Sessions` (`models/Session.js`)
Maintains server-side session tokens with MongoDB TTL auto-cleanup.

| Field | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Primary Key | Session ID |
| `userId` | ObjectId | Ref: `'User'`, Required, Indexed | Session owner |
| `token` | String | Required, Unique, Indexed | Signed JWT token |
| `userAgent` | String | Optional | Browser / client identifier |
| `ipAddress` | String | Optional | Request client IP |
| `isValid` | Boolean | Default: `true` | Session validity state |
| `expiresAt` | Date | Required, TTL Index (`expires: 0`) | Automatic expiration timestamp |

### 3. `Payments` (`models/Payment.js`)
Consolidated transaction ledger for Craft to Cart purchases and voluntary contributions.

| Field | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Primary Key | Internal payment identifier |
| `userId` | ObjectId | Ref: `'User'`, Required, Indexed | Initiating community member |
| `paymentType` | String | Enum: `['PRODUCT_PURCHASE', 'VOLUNTARY_CONTRIBUTION']` | Purpose of transaction |
| `module` | String | Enum: `['WISDOM_LOOP', 'CRAFT_TO_CART', 'RECONNECT', 'BOOK_BRIDGE', 'SECOND_SERVE']` | Associated initiative |
| `orderId` | ObjectId | Ref: `'Order'`, Optional | Populated for Craft to Cart purchases |
| `contributionId`| ObjectId | Optional | Voluntary contribution reference |
| `razorpayOrderId`| String | Required, Unique, Indexed | Razorpay gateway order identifier |
| `razorpayPaymentId`| String | Indexed, Default: null | Razorpay transaction payment ID |
| `razorpaySignature`| String | Default: null | Cryptographic HMAC signature |
| `amount` | Number | Required, Min: 1 | Transaction amount in INR |
| `currency` | String | Default: `'INR'` | Currency code |
| `status` | String | Enum: `['PENDING', 'SUCCESS', 'FAILED', 'REFUNDED']` | Transaction lifecycle status |
| `receiptNumber` | String | Optional | Internal receipt code |
| `notes` | Map of String | Default: `{}` | Custom metadata |

### 4. `Notifications` (`models/Notification.js`)
User-targeted activity alerts across all initiatives.

| Field | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `userId` | ObjectId | Ref: `'User'`, Required, Indexed | Recipient user |
| `title` | String | Required, Trim | Brief alert headline |
| `message` | String | Required | Notification body copy |
| `type` | String | Enum: `['AUTH', 'REQUEST', 'ORDER', 'PAYMENT', 'SYSTEM']` | Categorical tag |
| `isRead` | Boolean | Default: `false`, Indexed | Read state |
| `link` | String | Optional | In-app navigation route |

### 5. `AdminAuditLogs` (`models/AdminAuditLog.js`)
Immutable audit trail for compliance, moderation, and administrative changes.

| Field | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `adminId` | ObjectId | Ref: `'User'`, Required, Indexed | Performing administrator |
| `action` | String | Required, Indexed | Descriptive action key |
| `targetType` | String | Enum: `['USER', 'PRODUCT', 'DEVICE', 'BOOK', 'FOOD', 'REQUEST', 'PAYMENT', 'SYSTEM']` | Target entity collection |
| `targetId` | ObjectId | Optional | Target document ID |
| `details` | Mixed | Default: `{}` | State diff / rationale |
| `ipAddress` | String | Optional | Admin client IP |
| `createdAt` | Date | Timestamp | Log occurrence time |

---

## 2. Coordinated Module Models

These models match the supplied ER diagram and are pre-built for Person 2 and Person 3:

1. **`MentorProfile` (`models/MentorProfile.js`):** `userId`, `expertiseAreas`, `yearsOfExperience`, `title`, `bio`, `availability`, `status` (`PENDING`, `APPROVED`, `REJECTED`, `INACTIVE`), `rating`.
2. **`ArtisanProfile` (`models/ArtisanProfile.js`):** `userId`, `craftSpecialty`, `region`, `heritageStory`, `verificationStatus` (`PENDING`, `VERIFIED`, `REJECTED`), `totalSales`.
3. **`Product` (`models/Product.js`):** `artisanId`, `title`, `description`, `price`, `stock`, `category`, `images`, `status` (`DRAFT`, `ACTIVE`, `OUT_OF_STOCK`, `ARCHIVED`).
4. **`Order` (`models/Order.js`):** `buyerId`, `items` (productId, quantity, priceAtPurchase), `totalAmount`, `shippingAddress`, `paymentId`, `paymentStatus`, `orderStatus`.
5. **`DeviceListing` (`models/DeviceListing.js`):** `donorId`, `title`, `deviceType`, `brand`, `modelName`, `condition`, `specifications`, `images`, `status` (`AVAILABLE`, `MATCHED`, `UNDER_REPAIR`, `REHOMED`, `RECYCLED`), `recipientId`.
6. **`BookListing` (`models/BookListing.js`):** `donorId`, `title`, `author`, `isbn`, `genre`, `condition`, `images`, `status` (`AVAILABLE`, `REQUESTED`, `CIRCULATING`, `DONATED`), `recipientId`.
7. **`FoodDonation` (`models/FoodDonation.js`):** `donorId`, `title`, `foodType`, `quantityServings`, `cookedAt`, `bestBefore`, `dietaryType`, `pickupAddress`, `images`, `status` (`AVAILABLE`, `CLAIMED`, `PICKED_UP`, `DELIVERED`, `EXPIRED`), `claimedByNgoId`.
8. **`Request` (`models/Request.js`):** Polymorphic model linking `requesterId`, `module`, `targetType`, `targetId`, `requestType`, `message`, `status`, `responseNote`.
