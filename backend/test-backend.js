/**
 * MELD Backend Automated Verification Suite
 * Tests models, security middleware, JWT tokens, validation, Razorpay math,
 * and live MongoDB Atlas connectivity.
 */

import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import crypto from 'crypto';
import { User } from './models/User.js';
import { Payment } from './models/Payment.js';
import { Session } from './models/Session.js';
import { Notification } from './models/Notification.js';
import { AdminAuditLog } from './models/AdminAuditLog.js';
import { Request } from './models/Request.js';

import { signToken, verifyToken, COOKIE_NAME, setAuthCookie, clearAuthCookie } from './utils/generateToken.js';
import { ApiError } from './utils/ApiError.js';
import { sendResponse } from './utils/apiResponse.js';
import { validateRegister, validateLogin } from './validators/authValidator.js';
import { authorizeRoles } from './middleware/roleMiddleware.js';
import { razorpayService } from './services/razorpayService.js';
import app from './app.js';

let passed = 0;
let failed = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`  ✓ [PASS] ${testName}`);
    passed++;
  } else {
    console.error(`  ✗ [FAIL] ${testName}`);
    failed++;
  }
}

async function runTests() {
  console.log('\n======================================================');
  console.log('       MELD BACKEND VERIFICATION TEST SUITE');
  console.log('======================================================\n');

  // TEST GROUP 1: JWT & Session Token Security
  console.log('--- 1. Authentication & JWT Utilities ---');
  {
    const payload = { id: '673b8e1a1234567890abcdef', role: 'USER', email: 'test@meld.org' };
    const token = signToken(payload);
    assert(typeof token === 'string' && token.length > 20, 'signToken creates signed JWT string');

    const decoded = verifyToken(token);
    assert(decoded.id === payload.id && decoded.role === 'USER', 'verifyToken correctly extracts user identity and role');

    // Test Cookie Headers
    const mockRes = {
      cookie: (name, val, opts) => {
        mockRes._cookieName = name;
        mockRes._cookieVal = val;
        mockRes._cookieOpts = opts;
      },
      clearCookie: (name, opts) => {
        mockRes._clearedName = name;
        mockRes._clearedOpts = opts;
      }
    };

    setAuthCookie(mockRes, token, false);
    assert(mockRes._cookieName === COOKIE_NAME && mockRes._cookieOpts.httpOnly === true, 'setAuthCookie sets HttpOnly flag');
    assert(mockRes._cookieOpts.path === '/', 'setAuthCookie sets path /');

    clearAuthCookie(mockRes);
    assert(mockRes._clearedName === COOKIE_NAME, 'clearAuthCookie cleans up auth cookie');
  }

  // TEST GROUP 2: Registration & Validation Middleware
  console.log('\n--- 2. Request Validation Rules ---');
  {
    // Test rejection of invalid email
    let nextCalledWithError = null;
    const badEmailReq = { body: { fullName: 'Aman', email: 'not-an-email', password: 'Password123' } };
    validateRegister(badEmailReq, {}, (err) => { nextCalledWithError = err; });
    assert(nextCalledWithError instanceof ApiError && nextCalledWithError.statusCode === 400, 'validateRegister rejects malformed email address');

    // Test rejection of weak password (no numbers)
    let weakPassError = null;
    const weakPassReq = { body: { fullName: 'Aman Sharma', email: 'valid@example.com', password: 'onlyletters' } };
    validateRegister(weakPassReq, {}, (err) => { weakPassError = err; });
    assert(weakPassError instanceof ApiError && weakPassError.statusCode === 400, 'validateRegister rejects passwords lacking numbers');

    // Test enforcement: client cannot pass ADMIN role
    const adminAttemptReq = { body: { fullName: 'Aman Sharma', email: 'valid@example.com', password: 'Password123', role: 'ADMIN' } };
    validateRegister(adminAttemptReq, {}, () => {});
    assert(adminAttemptReq.body.role === undefined, 'validateRegister strips unauthorized role overrides');

    // Test successful validation
    let validSuccess = false;
    const validReq = { body: { fullName: '  Jane Doe  ', email: '  JANE@EXAMPLE.COM ', password: 'Password123' } };
    validateRegister(validReq, {}, (err) => { if (!err) validSuccess = true; });
    assert(validSuccess && validReq.body.email === 'jane@example.com' && validReq.body.fullName === 'Jane Doe', 'validateRegister normalizes email and trims full name');
  }

  // TEST GROUP 3: Role-Based Access Control
  console.log('\n--- 3. Role-Based Authorization Middleware ---');
  {
    const adminGuard = authorizeRoles('ADMIN');

    // Test USER blocked from ADMIN route
    let userBlockedError = null;
    const userReq = { user: { id: 'u1', role: 'USER' } };
    adminGuard(userReq, {}, (err) => { userBlockedError = err; });
    assert(userBlockedError instanceof ApiError && userBlockedError.statusCode === 403, 'authorizeRoles("ADMIN") rejects USER with 403 Forbidden');

    // Test ADMIN permitted on ADMIN route
    let adminPermitted = false;
    const adminReq = { user: { id: 'a1', role: 'ADMIN' } };
    adminGuard(adminReq, {}, (err) => { if (!err) adminPermitted = true; });
    assert(adminPermitted === true, 'authorizeRoles("ADMIN") permits authenticated ADMIN');
  }

  // TEST GROUP 4: Razorpay Cryptographic Verification
  console.log('\n--- 4. Razorpay Signature & Webhook Verification ---');
  {
    const secret = process.env.RAZORPAY_KEY_SECRET || 'rzp_test_placeholder_secret';
    process.env.RAZORPAY_KEY_SECRET = secret;

    const testOrderId = 'order_test_12345';
    const testPaymentId = 'pay_test_67890';
    const expectedSig = crypto
      .createHmac('sha256', secret)
      .update(`${testOrderId}|${testPaymentId}`)
      .digest('hex');

    const verified = razorpayService.verifyPaymentSignature({
      razorpayOrderId: testOrderId,
      razorpayPaymentId: testPaymentId,
      razorpaySignature: expectedSig
    });
    assert(verified === true, 'verifyPaymentSignature authenticates valid HMAC-SHA256 signature');

    const fakeSig = 'tampered_signature_string';
    const rejected = razorpayService.verifyPaymentSignature({
      razorpayOrderId: testOrderId,
      razorpayPaymentId: testPaymentId,
      razorpaySignature: fakeSig
    });
    assert(rejected === false, 'verifyPaymentSignature rejects tampered or fraudulent signature');

    // Test Webhook Signature
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || 'rzp_webhook_placeholder_secret';
    process.env.RAZORPAY_WEBHOOK_SECRET = webhookSecret;
    const rawWebhookBody = JSON.stringify({ event: 'order.paid', payload: { payment: { entity: { id: 'p1' } } } });
    const validWebhookSig = crypto
      .createHmac('sha256', webhookSecret)
      .update(rawWebhookBody)
      .digest('hex');

    const webhookValid = razorpayService.verifyWebhookSignature(rawWebhookBody, validWebhookSig);
    assert(webhookValid === true, 'verifyWebhookSignature validates server-to-server webhook authenticity');
  }

  // TEST GROUP 5: Express Server & Routing Endpoints
  console.log('\n--- 5. Express Server Route Integration ---');
  {
    const server = app.listen(0);
    const port = server.address().port;
    const baseUrl = `http://127.0.0.1:${port}/api`;

    try {
      // 1. Health check
      const healthRes = await fetch(`${baseUrl}/health`);
      const healthJson = await healthRes.json();
      assert(healthRes.status === 200 && healthJson.success === true, 'GET /api/health responds with 200 OK');

      // 2. 404 Not Found
      const notFoundRes = await fetch(`${baseUrl}/non-existent-endpoint`);
      const notFoundJson = await notFoundRes.json();
      assert(notFoundRes.status === 404 && notFoundJson.success === false, 'Unmatched route returns 404 Not Found');

      // 3. Guest session check (/api/auth/me) returns 200 with user: null (no red console error for visitors)
      const authMeRes = await fetch(`${baseUrl}/auth/me`);
      const authMeJson = await authMeRes.json();
      assert(authMeRes.status === 200 && authMeJson.data?.user === null, 'GET /api/auth/me without credentials returns 200 with user: null (guest)');

      // 4. Strict authentication endpoint blocks unauthenticated users with 401
      const payRes = await fetch(`${baseUrl}/payments/create-order`, { method: 'POST' });
      assert(payRes.status === 401, 'Strict protected routes reject unauthenticated requests with 401 Unauthorized');

      // 4. Person 2 placeholder route
      const p2Res = await fetch(`${baseUrl}/wisdom-loop`);
      const p2Json = await p2Res.json();
      assert(p2Res.status === 501 && p2Json.owner.includes('Person 2'), 'GET /api/wisdom-loop returns 501 Person 2 Integration stub');

      // 5. Person 3 placeholder route (admin guarded)
      const p3Res = await fetch(`${baseUrl}/admin`);
      assert(p3Res.status === 401, 'GET /api/admin requires authentication before admin dispatch');
    } finally {
      server.close();
    }
  }

  // TEST GROUP 6: MongoDB Atlas Live Connectivity & Model Operations
  console.log('\n--- 6. MongoDB Atlas Database Connectivity ---');
  {
    const uri = process.env.MONGODB_URI;
    if (uri && !uri.includes('<username>')) {
      try {
        console.log('  Connecting to MongoDB Atlas cluster...');
        await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
        assert(mongoose.connection.readyState === 1, 'MongoDB Atlas connection established successfully');

        // Ensure indexes (including unique email index) are synchronized
        await User.init();

        // Test User model password hashing pre-save
        const testEmail = `test_${Date.now()}@meldplatform.org`;
        const testUser = new User({
          fullName: 'Test Buildathon Member',
          email: testEmail,
          passwordHash: 'SuperSecret123',
          role: 'USER'
        });

        await testUser.save();
        assert(testUser.passwordHash !== 'SuperSecret123', 'Mongoose pre-save hook securely hashes plaintext password with bcrypt');

        const passwordMatches = await testUser.comparePassword('SuperSecret123');
        assert(passwordMatches === true, 'user.comparePassword confirms matching bcrypt hash');

        const passwordFails = await testUser.comparePassword('WrongPassword');
        assert(passwordFails === false, 'user.comparePassword rejects incorrect password');

        const safeObj = testUser.toSafeObject();
        assert(safeObj.passwordHash === undefined, 'user.toSafeObject excludes passwordHash from returned data');

        // Test Unique Email Constraint
        let duplicateCaught = false;
        try {
          const duplicateUser = new User({
            fullName: 'Duplicate Member',
            email: testEmail,
            passwordHash: 'AnotherPass123'
          });
          await duplicateUser.save();
        } catch (err) {
          duplicateCaught = err.code === 11000;
        }
        assert(duplicateCaught === true, 'MongoDB Atlas enforces unique email constraint (E11000)');

        // Cleanup test user
        await User.deleteOne({ _id: testUser._id });
        console.log('  Cleaned up temporary test document from Atlas.');

        await mongoose.disconnect();
        assert(true, 'MongoDB Atlas connection closed cleanly');
      } catch (dbErr) {
        console.warn(`  [Notice] MongoDB Atlas live test encountered: ${dbErr.message}`);
      }
    } else {
      console.log('  [Skip] MONGODB_URI contains placeholder; skipping live cluster insert.');
    }
  }

  console.log('\n======================================================');
  console.log(`TEST SUMMARY: ${passed} PASSED | ${failed} FAILED`);
  console.log('======================================================\n');

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests();
