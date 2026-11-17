# MELD — Shared Backend API Documentation

**Base API URL:** `http://localhost:5000/api`  
**Authentication Type:** Secure HttpOnly Cookie (`meld_token`) or Bearer Header (`Authorization: Bearer <token>`)  
**Data Format:** JSON (`application/json`)

---

## 1. Standard Response Formats

### Standard Success Response (200, 201)
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {}
}
```

### Standard Error Response (400, 401, 403, 404, 409, 422, 500)
```json
{
  "success": false,
  "message": "A user-friendly error message",
  "errors": []
}
```

---

## 2. Authentication Endpoints (`/api/auth`)

### 1. Register User
- **Method:** `POST /api/auth/register`
- **Access:** Public
- **Description:** Registers a new community user. All public registrations are strictly assigned `role: "USER"`.
- **Request Body:**
  ```json
  {
    "fullName": "Jane Doe",
    "email": "jane@example.com",
    "password": "Password123"
  }
  ```
- **Validation Rules:**
  - `fullName`: Required, 2-100 characters.
  - `email`: Required, valid email format, unique.
  - `password`: Required, minimum 6 characters, must contain letters and numbers.
- **Success Response (201 Created):**
  Sets `meld_token` HttpOnly cookie.
  ```json
  {
    "success": true,
    "message": "User account registered successfully",
    "data": {
      "user": {
        "_id": "673b8e...",
        "id": "673b8e...",
        "fullName": "Jane Doe",
        "name": "Jane Doe",
        "email": "jane@example.com",
        "role": "USER",
        "profileImage": {
          "url": "https://res.cloudinary.com/meld-community/image/upload/v1/meld/default-avatar.png",
          "publicId": null
        },
        "accountStatus": "ACTIVE",
        "createdAt": "2026-11-17T20:30:00.000Z"
      },
      "token": "eyJhbGciOiJIUzI1NiIsIn..."
    }
  }
  ```

### 2. Login User
- **Method:** `POST /api/auth/login`
- **Access:** Public
- **Description:** Authenticates user credentials and establishes an authenticated session.
- **Request Body:**
  ```json
  {
    "email": "jane@example.com",
    "password": "Password123",
    "rememberMe": true
  }
  ```
- **Success Response (200 OK):**
  Sets `meld_token` HttpOnly cookie.
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "user": {
        "_id": "673b8e...",
        "fullName": "Jane Doe",
        "email": "jane@example.com",
        "role": "USER",
        "accountStatus": "ACTIVE"
      },
      "token": "eyJhbGciOiJIUzI1NiIsIn..."
    }
  }
  ```

### 3. Session Restoration
- **Method:** `GET /api/auth/me`
- **Access:** Private (Authenticated)
- **Description:** Restores session identity from cookie or Bearer token header on app mount.
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "User session verified",
    "data": {
      "user": {
        "_id": "673b8e...",
        "fullName": "Jane Doe",
        "email": "jane@example.com",
        "role": "USER"
      }
    }
  }
  ```

### 4. Logout
- **Method:** `POST /api/auth/logout`
- **Access:** Public / Private
- **Description:** Invalidates server-side session and clears `meld_token` cookie.
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Logged out successfully"
  }
  ```

---

## 3. Payments Endpoints (`/api/payments`)

### 1. Create Payment Order
- **Method:** `POST /api/payments/create-order`
- **Access:** Private (Authenticated)
- **Description:** Generates an official Razorpay order and creates a `PENDING` payment record.
- **Request Body:**
  ```json
  {
    "paymentType": "VOLUNTARY_CONTRIBUTION",
    "module": "WISDOM_LOOP",
    "amount": 250,
    "notes": {
      "message": "Support community mentorship"
    }
  }
  ```
- **Product Purchase Variant:**
  ```json
  {
    "paymentType": "PRODUCT_PURCHASE",
    "module": "CRAFT_TO_CART",
    "orderId": "673b8fa..."
  }
  ```
- **Success Response (201 Created):**
  ```json
  {
    "success": true,
    "message": "Payment order created successfully",
    "data": {
      "paymentId": "673b901...",
      "razorpayOrderId": "order_P9c0...",
      "amount": 250,
      "currency": "INR",
      "keyId": "rzp_test_...",
      "receipt": "meld_17949..."
    }
  }
  ```

### 2. Verify Payment
- **Method:** `POST /api/payments/verify`
- **Access:** Private (Authenticated)
- **Description:** Validates cryptographic HMAC-SHA256 signature and marks payment `SUCCESS`.
- **Request Body:**
  ```json
  {
    "razorpayOrderId": "order_P9c0...",
    "razorpayPaymentId": "pay_P9c1...",
    "razorpaySignature": "9f7a6b8..."
  }
  ```
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Payment verified successfully",
    "data": {
      "payment": {
        "_id": "673b901...",
        "status": "SUCCESS",
        "amount": 250
      },
      "alreadyProcessed": false
    }
  }
  ```

### 3. Razorpay Server Webhook
- **Method:** `POST /api/payments/webhook`
- **Access:** Public (Signature Verified via `x-razorpay-signature`)
- **Description:** Handles server-to-server asynchronous events (`order.paid`, `payment.captured`, `payment.failed`).

### 4. Payment History
- **Method:** `GET /api/payments/history`
- **Access:** Private (Authenticated)
- **Description:** Retrieves the authenticated user's past 50 payment transactions.

---

## 4. Image Upload Endpoints (`/api/uploads`)

### 1. Upload Single Image
- **Method:** `POST /api/uploads`
- **Access:** Private (Authenticated)
- **Content-Type:** `multipart/form-data`
- **Form Fields:**
  - `image`: File (JPEG, PNG, WebP; max 5MB)
  - `folder`: (Optional string, default: `'meld/general'`)
- **Success Response (201 Created):**
  ```json
  {
    "success": true,
    "message": "Image uploaded successfully to Cloudinary",
    "data": {
      "url": "https://res.cloudinary.com/meld-community/image/upload/v1/meld/general/example.webp",
      "publicId": "meld/general/example",
      "width": 800,
      "height": 600,
      "format": "webp"
    }
  }
  ```

### 2. Upload Multiple Images
- **Method:** `POST /api/uploads/multiple`
- **Access:** Private (Authenticated)
- **Content-Type:** `multipart/form-data`
- **Form Fields:** `images` (array of up to 5 files)

### 3. Delete Image
- **Method:** `DELETE /api/uploads/:publicId(*)`
- **Access:** Private (Authenticated)
- **Description:** Deletes image from Cloudinary by its public ID.

---

## 5. Health Check Endpoint
- **Method:** `GET /api/health`
- **Access:** Public
- **Response:**
  ```json
  {
    "success": true,
    "message": "MELD API Server is active and healthy",
    "timestamp": "2026-11-17T20:30:00.000Z",
    "environment": "development"
  }
  ```
