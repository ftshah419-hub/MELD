import React, { useState, useEffect, useCallback } from 'react';
import { FileText, AlertTriangle, CheckCircle, XCircle, Search, ShieldAlert, Eye } from 'lucide-react';
import adminReportService from '../../services/admin/adminReportService';
import AdminFilters from '../../components/admin/AdminFilters';
import AdminDataTable from '../../components/admin/AdminDataTable';
import StatusBadge from '../../components/admin/StatusBadge';
import ConfirmationDialog from '../../components/admin/ConfirmationDialog';

export function AdminReports() {
  const [reports, setReports] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterValues, setFilterValues] = useState({ module: 'all', status: 'all', severity: 'all' });

  // Detail Modal / Resolve Dialog
  const [selectedReport, setSelectedReport] = useState(null);
  const [dialogState, setDialogState] = useState({
    isOpen: false,
    report: null,
    action: 'RESOLVED',
    title: ''
  });

  const fetchReports = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await adminReportService.getReports({
        page: pagination.page,
        limit: pagination.limit,
        module: filterValues.module,
        status: filterValues.status,
        severity: filterValues.severity,
        search: searchTerm
      });
      setReports(res.reports || []);
      setPagination(res.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 });
    } catch (err) {
      console.error('Failed to fetch reports:', err);
    } finally {
      setIsLoading(false);
    }
  }, [pagination.page, pagination.limit, filterValues, searchTerm]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleFilterChange = (key, val) => {
    setFilterValues((prev) => ({ ...prev, [key]: val }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleReset = () => {
    setSearchTerm('');
    setFilterValues({ module: 'all', status: 'all', severity: 'all' });
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleResolve = async (notes) => {
    if (!dialogState.report) return;
    await adminReportService.updateReportStatus(dialogState.report._id, {
      status: dialogState.action,
      resolutionNotes: notes,
      takeActionOnUser: dialogState.action === 'RESOLVED'
    });
    fetchReports();
  };

  const filterOptions = [
    {
      key: 'module',
      options: [
        { label: 'Module: All', value: 'all' },
        { label: 'Wisdom Loop', value: 'WISDOM_LOOP' },
        { label: 'Craft to Cart', value: 'CRAFT_TO_CART' },
        { label: 'ReConnect', value: 'RECONNECT' },
        { label: 'Book Bridge', value: 'BOOK_BRIDGE' },
        { label: 'Second Serve', value: 'SECOND_SERVE' },
        { label: 'Platform Core', value: 'PLATFORM' }
      ]
    },
    {
      key: 'status',
      options: [
        { label: 'Status: All', value: 'all' },
        { label: 'Pending Review', value: 'PENDING' },
        { label: 'Under Review', value: 'UNDER_REVIEW' },
        { label: 'Resolved Cases', value: 'RESOLVED' },
        { label: 'Rejected Complaints', value: 'REJECTED' },
        { label: 'Escalated Issues', value: 'ESCALATED' }
      ]
    },
    {
      key: 'severity',
      options: [
        { label: 'Severity: All', value: 'all' },
        { label: 'Critical Severity', value: 'CRITICAL' },
        { label: 'High Severity', value: 'HIGH' },
        { label: 'Medium Severity', value: 'MEDIUM' },
        { label: 'Low Severity', value: 'LOW' }
      ]
    }
  ];

  const columns = [
    {
      header: 'Incident / Description',
      render: (r) => (
        <div>
          <div style={{ fontWeight: 700, color: 'var(--text)' }}>{r.title}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem', maxWidth: '350px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {r.description}
          </div>
        </div>
      )
    },
    { header: 'Module', render: (r) => <StatusBadge status={r.module} size="sm" /> },
    { header: 'Severity', render: (r) => <StatusBadge status={r.severity} size="sm" /> },
    { header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
    {
      header: 'Reported Subject',
      render: (r) => (
        <span style={{ fontSize: '0.8rem' }}>
          {r.reportedUserId ? r.reportedUserId.fullName : r.targetType || 'Content'}
        </span>
      )
    },
    {
      header: 'Reported Date',
      render: (r) => (
        <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
          {new Date(r.createdAt).toLocaleDateString()}
        </span>
      )
    },
    {
      header: 'Triage Actions',
      align: 'right',
      render: (r) => (
        <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'flex-end' }}>
          {r.status === 'PENDING' && (
            <button
              onClick={() =>
                setDialogState({
                  isOpen: true,
                  report: r,
                  action: 'RESOLVED',
                  title: `Resolve Incident: ${r.title}`
                })
              }
              style={{
                padding: '0.3rem 0.6rem',
                borderRadius: '4px',
                backgroundColor: 'rgba(32, 109, 57, 0.1)',
                color: '#2e7d32',
                border: '1px solid rgba(32, 109, 57, 0.3)',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Resolve
            </button>
          )}

          {r.status === 'PENDING' && (
            <button
              onClick={() =>
                setDialogState({
                  isOpen: true,
                  report: r,
                  action: 'REJECTED',
                  title: `Dismiss Report: ${r.title}`
                })
              }
              style={{
                padding: '0.3rem 0.6rem',
                borderRadius: '4px',
                backgroundColor: 'var(--surface-alt)',
                color: 'var(--text-muted)',
                border: '1px solid var(--border)',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Dismiss
            </button>
          )}

          {r.status === 'RESOLVED' && (
            <span style={{ fontSize: '0.75rem', color: '#2e7d32', fontWeight: 600 }}>Resolved</span>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '1.5rem' }}>
        <h1
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.75rem',
            fontWeight: 700,
            color: 'var(--primary)',
            letterSpacing: '-0.02em',
            margin: '0 0 0.25rem 0'
          }}
        >
          Community Incident Reports & Complaints
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0 }}>
          Investigate reported grievances, cold-chain violations, harassment reports, and policy infractions with resolution accountability.
        </p>
      </div>

      <AdminFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Filter reports by title or narrative..."
        filterOptions={filterOptions}
        filterValues={filterValues}
        onFilterChange={handleFilterChange}
        onReset={handleReset}
      />

      <AdminDataTable
        columns={columns}
        data={reports}
        isLoading={isLoading}
        emptyMessage="No incident reports match current search or filters."
        pagination={pagination}
        onPageChange={(page) => setPagination((prev) => ({ ...prev, page }))}
      />

      {/* Resolution Dialog */}
      <ConfirmationDialog
        isOpen={dialogState.isOpen}
        onClose={() => setDialogState({ isOpen: false, report: null, action: 'RESOLVED', title: '' })}
        onConfirm={handleResolve}
        title={dialogState.title}
        message="Resolving this report records formal triage notes and sends an incident outcome notification to the reporter."
        confirmText={dialogState.action === 'RESOLVED' ? 'Mark Resolved' : 'Dismiss Report'}
        requireReason={true}
        reasonPlaceholder="Specify resolution findings and actions taken..."
      />
    </div>
  );
}

export default AdminReports;
