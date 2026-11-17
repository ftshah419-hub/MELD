import React, { useState, useEffect, useCallback } from 'react';
import { History, Shield, Search, Lock, Terminal } from 'lucide-react';
import adminService from '../../services/admin/adminService';
import AdminFilters from '../../components/admin/AdminFilters';
import AdminDataTable from '../../components/admin/AdminDataTable';
import StatusBadge from '../../components/admin/StatusBadge';

export function AdminAuditLogs() {
  const [logs, setLogs] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterValues, setFilterValues] = useState({ targetType: 'all' });

  const fetchLogs = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await adminService.getAuditLogs({
        page: pagination.page,
        limit: pagination.limit,
        targetType: filterValues.targetType,
        search: searchTerm
      });
      setLogs(res.logs || []);
      setPagination(res.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 });
    } catch (err) {
      console.error('Failed to load audit logs:', err);
    } finally {
      setIsLoading(false);
    }
  }, [pagination.page, pagination.limit, filterValues, searchTerm]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const filterOptions = [
    {
      key: 'targetType',
      options: [
        { label: 'Target: All Entities', value: 'all' },
        { label: 'User Entity', value: 'USER' },
        { label: 'Product Entity', value: 'PRODUCT' },
        { label: 'Device Entity', value: 'DEVICE' },
        { label: 'Book Entity', value: 'BOOK' },
        { label: 'Food Lot Entity', value: 'FOOD' },
        { label: 'System Configuration', value: 'SYSTEM' }
      ]
    }
  ];

  const columns = [
    {
      header: 'Timestamp',
      render: (r) => (
        <span style={{ fontSize: '0.8rem', color: 'var(--text)', whiteSpace: 'nowrap' }}>
          {new Date(r.createdAt).toLocaleString()}
        </span>
      )
    },
    {
      header: 'Administrator',
      render: (r) => (
        <div>
          <div style={{ fontWeight: 600 }}>{r.adminId?.fullName || 'Super Administrator'}</div>
          <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>{r.adminId?.email || 'admin@meld.org'}</div>
        </div>
      )
    },
    {
      header: 'Administrative Action',
      render: (r) => (
        <span
          style={{
            fontFamily: 'monospace',
            fontWeight: 700,
            fontSize: '0.775rem',
            color: 'var(--primary)',
            backgroundColor: 'var(--mint-light)',
            padding: '0.2rem 0.5rem',
            borderRadius: 'var(--radius-sm)'
          }}
        >
          {r.action}
        </span>
      )
    },
    {
      header: 'Target Type',
      render: (r) => <StatusBadge status={r.targetType} size="sm" />
    },
    {
      header: 'Action Diff & Rationale',
      render: (r) => (
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {r.details?.reason || JSON.stringify(r.details)}
        </div>
      )
    },
    {
      header: 'Client IP',
      render: (r) => (
        <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--text-subtle)' }}>
          {r.ipAddress || '127.0.0.1'}
        </span>
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
          Immutable Administrative Audit Trail
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0 }}>
          Cryptographically recorded ledger of account suspensions, verification decisions, listing removals, and governance adjustments.
        </p>
      </div>

      <AdminFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Filter logs by action key..."
        filterOptions={filterOptions}
        filterValues={filterValues}
        onFilterChange={(key, val) => {
          setFilterValues((p) => ({ ...p, [key]: val }));
          setPagination((p) => ({ ...p, page: 1 }));
        }}
        onReset={() => {
          setSearchTerm('');
          setFilterValues({ targetType: 'all' });
          setPagination((p) => ({ ...p, page: 1 }));
        }}
      />

      <AdminDataTable
        columns={columns}
        data={logs}
        isLoading={isLoading}
        emptyMessage="No administrative actions logged matching criteria."
        pagination={pagination}
        onPageChange={(page) => setPagination((prev) => ({ ...prev, page }))}
      />
    </div>
  );
}

export default AdminAuditLogs;
