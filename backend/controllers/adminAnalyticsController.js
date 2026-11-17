import { User } from '../models/User.js';
import { Order } from '../models/Order.js';
import { Payment } from '../models/Payment.js';
import { Request } from '../models/Request.js';
import { FoodDonation } from '../models/FoodDonation.js';
import { DeviceListing } from '../models/DeviceListing.js';
import { BookListing } from '../models/BookListing.js';
import { Report } from '../models/Report.js';
import { AdminAuditLog } from '../models/AdminAuditLog.js';
import { sendResponse } from '../utils/apiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * @desc Get comprehensive platform analytics
 * @route GET /api/admin/analytics
 * @access Private (Admin)
 */
export const getAnalytics = asyncHandler(async (req, res) => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [
    userGrowthAgg,
    moduleRequestsAgg,
    paymentTrendsAgg,
    foodImpactAgg,
    deviceImpactAgg,
    bookImpactAgg
  ] = await Promise.all([
    User.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]),
    Request.aggregate([
      {
        $group: {
          _id: '$module',
          total: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ['$status', 'COMPLETED'] }, 1, 0] }
          }
        }
      }
    ]),
    Payment.aggregate([
      { $match: { status: 'SUCCESS' } },
      {
        $group: {
          _id: '$paymentType',
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]),
    FoodDonation.aggregate([
      {
        $group: {
          _id: '$status',
          totalServings: { $sum: '$quantityServings' },
          count: { $sum: 1 }
        }
      }
    ]),
    DeviceListing.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]),
    BookListing.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ])
  ]);

  return sendResponse(res, 200, 'Analytics dataset calculated successfully', {
    userGrowth: userGrowthAgg,
    moduleRequests: moduleRequestsAgg,
    paymentBreakdown: paymentTrendsAgg,
    circularImpact: {
      food: foodImpactAgg,
      devices: deviceImpactAgg,
      books: bookImpactAgg
    }
  });
});

/**
 * @desc Export tabular report to CSV format
 * @route GET /api/admin/analytics/export
 * @access Private (Admin)
 */
export const exportReportCsv = asyncHandler(async (req, res) => {
  const { type = 'users' } = req.query;

  let csvContent = '';
  let filename = `meld-export-${type}-${Date.now()}.csv`;

  if (type === 'users') {
    const users = await User.find().select('fullName email role accountStatus createdAt').lean();
    csvContent = 'ID,Full Name,Email,Role,Status,Created At\n';
    users.forEach((u) => {
      csvContent += `"${u._id}","${u.fullName}","${u.email}","${u.role}","${u.accountStatus}","${u.createdAt.toISOString()}"\n`;
    });
  } else if (type === 'payments') {
    const payments = await Payment.find().populate('userId', 'email').lean();
    csvContent = 'ID,User Email,Payment Type,Module,Amount,Status,Razorpay Order ID,Created At\n';
    payments.forEach((p) => {
      csvContent += `"${p._id}","${p.userId?.email || ''}","${p.paymentType}","${p.module}","${p.amount}","${p.status}","${p.razorpayOrderId}","${p.createdAt.toISOString()}"\n`;
    });
  } else if (type === 'orders') {
    const orders = await Order.find().populate('buyerId', 'email').lean();
    csvContent = 'ID,Buyer Email,Total Amount,Order Status,Payment Status,Created At\n';
    orders.forEach((o) => {
      csvContent += `"${o._id}","${o.buyerId?.email || ''}","${o.totalAmount}","${o.orderStatus}","${o.paymentStatus}","${o.createdAt.toISOString()}"\n`;
    });
  } else if (type === 'reports') {
    const reports = await Report.find().lean();
    csvContent = 'ID,Title,Module,Severity,Report Type,Status,Created At\n';
    reports.forEach((r) => {
      csvContent += `"${r._id}","${r.title}","${r.module}","${r.severity}","${r.reportType}","${r.status}","${r.createdAt.toISOString()}"\n`;
    });
  }

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  return res.status(200).send(csvContent);
});

export default {
  getAnalytics,
  exportReportCsv
};
