import { Report } from '../models/Report.js';
import { User } from '../models/User.js';
import { AdminAuditLog } from '../models/AdminAuditLog.js';
import { Notification } from '../models/Notification.js';
import { ApiError } from '../utils/ApiError.js';
import { sendResponse } from '../utils/apiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * @desc Get reports and complaints with filtering and pagination
 * @route GET /api/admin/reports
 * @access Private (Admin)
 */
export const getReports = asyncHandler(async (req, res) => {
  const { page, limit, skip } = req.pagination;
  const { module, status, severity, reportType, search } = req.query;

  const query = {};

  if (module && module !== 'all') {
    query.module = module.toUpperCase();
  }

  if (status && status !== 'all') {
    query.status = status.toUpperCase();
  }

  if (severity && severity !== 'all') {
    query.severity = severity.toUpperCase();
  }

  if (reportType && reportType !== 'all') {
    query.reportType = reportType.toUpperCase();
  }

  if (search && search.trim()) {
    query.$or = [
      { title: { $regex: search.trim(), $options: 'i' } },
      { description: { $regex: search.trim(), $options: 'i' } }
    ];
  }

  const [total, reports] = await Promise.all([
    Report.countDocuments(query),
    Report.find(query)
      .populate('reporterId', 'fullName email')
      .populate('reportedUserId', 'fullName email accountStatus')
      .populate('resolvedBy', 'fullName email')
      .sort({ severity: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
  ]);

  return sendResponse(res, 200, 'Reports retrieved successfully', {
    reports,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  });
});

/**
 * @desc Get single report full context
 * @route GET /api/admin/reports/:id
 * @access Private (Admin)
 */
export const getReportDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const report = await Report.findById(id)
    .populate('reporterId', 'fullName email profileImage')
    .populate('reportedUserId', 'fullName email profileImage accountStatus')
    .populate('resolvedBy', 'fullName email')
    .lean();

  if (!report) {
    throw ApiError.notFound('Report not found.');
  }

  return sendResponse(res, 200, 'Report details retrieved', report);
});

/**
 * @desc Triage or resolve community incident report
 * @route PATCH /api/admin/reports/:id/status
 * @access Private (Admin)
 */
export const updateReportStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, resolutionNotes, takeActionOnUser } = req.body;

  const report = await Report.findById(id);
  if (!report) {
    throw ApiError.notFound('Report not found.');
  }

  const previousStatus = report.status;
  report.status = status;
  if (resolutionNotes) {
    report.resolutionNotes = resolutionNotes;
  }

  if (['RESOLVED', 'REJECTED'].includes(status)) {
    report.resolvedBy = req.user._id;
    report.resolvedAt = new Date();
  }

  await report.save();

  // Audit log
  await AdminAuditLog.create({
    adminId: req.user._id,
    action: `REPORT_${status}`,
    targetType: 'SYSTEM',
    targetId: report._id,
    details: {
      previousStatus,
      newStatus: status,
      resolutionNotes,
      reportModule: report.module
    },
    ipAddress: req.ip
  });

  // If admin chooses to suspend the reported user directly from report triage
  if (takeActionOnUser && report.reportedUserId) {
    const reportedUser = await User.findById(report.reportedUserId);
    if (reportedUser && reportedUser.accountStatus !== 'SUSPENDED') {
      reportedUser.accountStatus = 'SUSPENDED';
      await reportedUser.save();

      await AdminAuditLog.create({
        adminId: req.user._id,
        action: 'USER_STATUS_SUSPENDED',
        targetType: 'USER',
        targetId: reportedUser._id,
        details: {
          reason: `Suspended via Report resolution (${report.title}): ${resolutionNotes}`
        },
        ipAddress: req.ip
      });
    }
  }

  // Notify reporter
  await Notification.create({
    userId: report.reporterId,
    title: `Incident Report Updated: ${status}`,
    message: `Your report regarding "${report.title}" has been reviewed by MELD Safety. Status: ${status}.`,
    type: 'SYSTEM'
  });

  return sendResponse(res, 200, `Report marked as ${status}`, report);
});

/**
 * @desc Create community report (available to both users and admin testing)
 * @route POST /api/admin/reports
 * @access Private
 */
export const createReport = asyncHandler(async (req, res) => {
  const {
    reportedUserId,
    module = 'PLATFORM',
    targetType = 'User',
    targetId,
    reportType = 'POLICY_VIOLATION',
    severity = 'MEDIUM',
    title,
    description,
    evidence
  } = req.body;

  if (!description || description.trim().length < 10) {
    throw ApiError.badRequest('Report description must be at least 10 characters.');
  }

  const newReport = await Report.create({
    reporterId: req.user._id,
    reportedUserId: reportedUserId || null,
    module: module.toUpperCase(),
    targetType,
    targetId: targetId || null,
    reportType: reportType.toUpperCase(),
    severity: severity.toUpperCase(),
    title: title || 'Incident Report',
    description,
    evidence: Array.isArray(evidence) ? evidence : []
  });

  return sendResponse(res, 201, 'Incident report submitted successfully', newReport);
});

export default {
  getReports,
  getReportDetails,
  updateReportStatus,
  createReport
};
