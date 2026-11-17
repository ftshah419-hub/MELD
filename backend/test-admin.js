/**
 * MELD Admin Module Automated Verification Test Suite
 * Tests admin role guards, input validators, API contract schemas,
 * rejection reasoning rules, and route security.
 */

import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { ApiError } from './utils/ApiError.js';
import { authorizeRoles } from './middleware/roleMiddleware.js';
import {
  isValidObjectId,
  validateIdParam,
  validateUserStatusUpdate,
  validateModerationDecision,
  validateReportStatusUpdate,
  validatePagination
} from './validators/adminValidator.js';
import { Report } from './models/Report.js';
import { AdminAuditLog } from './models/AdminAuditLog.js';
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

async function runAdminTests() {
  console.log('\n======================================================');
  console.log('       MELD ADMIN MODULE VERIFICATION TEST SUITE');
  console.log('======================================================\n');

  // TEST GROUP 1: Role-Based Access Control on Admin Endpoints
  console.log('--- 1. Admin RBAC & Route Protection ---');
  {
    const adminGuard = authorizeRoles('ADMIN');

    let userBlockedError = null;
    const userReq = { user: { id: 'u1', role: 'USER' } };
    adminGuard(userReq, {}, (err) => { userBlockedError = err; });
    assert(userBlockedError instanceof ApiError && userBlockedError.statusCode === 403, 'authorizeRoles("ADMIN") blocks regular USER with 403 Forbidden');

    let adminPermitted = false;
    const adminReq = { user: { id: 'a1', role: 'ADMIN' } };
    adminGuard(adminReq, {}, (err) => { if (!err) adminPermitted = true; });
    assert(adminPermitted === true, 'authorizeRoles("ADMIN") permits authenticated ADMIN clearance');
  }

  // TEST GROUP 2: Admin Request Validators
  console.log('\n--- 2. Admin Input Validation & Security Rules ---');
  {
    // ObjectId Validation
    const validId = '507f1f77bcf86cd799439011';
    const invalidId = 'invalid-mongo-id-123';
    assert(isValidObjectId(validId) === true, 'isValidObjectId accepts valid 24-character hexadecimal ObjectId');
    assert(isValidObjectId(invalidId) === false, 'isValidObjectId rejects malformed ObjectId');

    // validateIdParam Middleware
    let idError = null;
    const mockIdReq = { params: { id: invalidId } };
    validateIdParam('id')(mockIdReq, {}, (err) => { idError = err; });
    assert(idError instanceof ApiError && idError.statusCode === 400, 'validateIdParam rejects malformed ID with 400 Bad Request');

    // validatePagination Middleware
    const mockPageReq = { query: { page: '2', limit: '25' } };
    validatePagination(mockPageReq, {}, () => {});
    assert(mockPageReq.pagination.page === 2 && mockPageReq.pagination.limit === 25 && mockPageReq.pagination.skip === 25, 'validatePagination computes page, limit, and skip accurately');

    // User Status Update: Suspended requires reason
    let suspendError = null;
    const mockSuspendReq = { body: { status: 'SUSPENDED', reason: '   ' } };
    validateUserStatusUpdate(mockSuspendReq, {}, (err) => { suspendError = err; });
    assert(suspendError instanceof ApiError && suspendError.statusCode === 400, 'validateUserStatusUpdate requires justification reason for suspension');

    let validSuspendError = null;
    const mockValidSuspendReq = { body: { status: 'SUSPENDED', reason: 'Violation of Community Guidelines section 3' } };
    validateUserStatusUpdate(mockValidSuspendReq, {}, (err) => { validSuspendError = err; });
    assert(validSuspendError === undefined, 'validateUserStatusUpdate permits valid suspension with proper reason');

    // Moderation Decision: Reject requires reason
    let rejectError = null;
    const mockRejectReq = { body: { action: 'REJECT', reason: '' } };
    validateModerationDecision(mockRejectReq, {}, (err) => { rejectError = err; });
    assert(rejectError instanceof ApiError && rejectError.statusCode === 400, 'validateModerationDecision requires reason for rejection');

    // Report Status Update: Resolution requires notes
    let reportError = null;
    const mockReportReq = { body: { status: 'RESOLVED', resolutionNotes: '' } };
    validateReportStatusUpdate(mockReportReq, {}, (err) => { reportError = err; });
    assert(reportError instanceof ApiError && reportError.statusCode === 400, 'validateReportStatusUpdate requires resolutionNotes when resolving report');
  }

  // TEST GROUP 3: Database Models & Schemas
  console.log('\n--- 3. Database Models & Schema Compliance ---');
  {
    const reportFields = Object.keys(Report.schema.paths);
    assert(reportFields.includes('reporterId'), 'Report model includes reporterId reference');
    assert(reportFields.includes('module'), 'Report model includes module enum');
    assert(reportFields.includes('severity'), 'Report model includes severity enum');
    assert(reportFields.includes('status'), 'Report model includes lifecycle status');
    assert(reportFields.includes('resolutionNotes'), 'Report model includes resolutionNotes');

    const auditFields = Object.keys(AdminAuditLog.schema.paths);
    assert(auditFields.includes('adminId'), 'AdminAuditLog includes adminId reference');
    assert(auditFields.includes('action'), 'AdminAuditLog includes action key');
    assert(auditFields.includes('targetType'), 'AdminAuditLog includes targetType enum');
    assert(auditFields.includes('details'), 'AdminAuditLog includes structured details diff');
  }

  // TEST GROUP 4: HTTP Endpoint Route Mount & Guard
  console.log('\n--- 4. Express Route Guard Integration ---');
  {
    const server = app.listen(0);
    const port = server.address().port;
    const baseUrl = `http://127.0.0.1:${port}/api`;

    try {
      const p3DashboardRes = await fetch(`${baseUrl}/admin/dashboard`);
      assert(p3DashboardRes.status === 401, 'GET /api/admin/dashboard blocks unauthenticated requests with 401');

      const p3UsersRes = await fetch(`${baseUrl}/admin/users`);
      assert(p3UsersRes.status === 401, 'GET /api/admin/users blocks unauthenticated requests with 401');

      const p3PaymentsRes = await fetch(`${baseUrl}/admin/payments`);
      assert(p3PaymentsRes.status === 401, 'GET /api/admin/payments blocks unauthenticated requests with 401');

      const p3ReportsRes = await fetch(`${baseUrl}/admin/reports`);
      assert(p3ReportsRes.status === 401, 'GET /api/admin/reports blocks unauthenticated requests with 401');
    } finally {
      server.close();
    }
  }

  console.log('\n======================================================');
  console.log(`ADMIN TEST SUMMARY: ${passed} PASSED | ${failed} FAILED`);
  console.log('======================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runAdminTests();
