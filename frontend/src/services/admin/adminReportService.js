import apiClient from '../api';

/**
 * Admin Reports & Complaint Management Service
 */
export const adminReportService = {
  /**
   * Get reports with filters
   */
  async getReports(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await apiClient(`/admin/reports?${query}`);
    return res.data;
  },

  /**
   * Get single report details
   */
  async getReportDetails(id) {
    const res = await apiClient(`/admin/reports/${id}`);
    return res.data;
  },

  /**
   * Update report status (UNDER_REVIEW, RESOLVED, REJECTED, ESCALATED)
   */
  async updateReportStatus(id, data) {
    const res = await apiClient(`/admin/reports/${id}/status`, {
      method: 'PATCH',
      body: data
    });
    return res.data;
  },

  /**
   * Submit an incident report
   */
  async createReport(data) {
    const res = await apiClient('/admin/reports', {
      method: 'POST',
      body: data
    });
    return res.data;
  }
};

export default adminReportService;
