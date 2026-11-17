/**
 * Standard API Response Helper
 * Enforces unified response structure across the entire MELD platform
 */
export const sendResponse = (res, statusCode = 200, message = 'Success', data = null) => {
  const extra = data && typeof data === 'object' && !Array.isArray(data) ? data : {};
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    ...extra
  });
};

export class ApiResponse {
  constructor(statusCode, message = 'Success', data = null) {
    this.statusCode = statusCode;
    this.success = statusCode < 400;
    this.message = message;
    this.data = data;
  }
}

export default { sendResponse, ApiResponse };
