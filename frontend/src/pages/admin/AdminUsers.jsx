import React, { useState, useEffect, useCallback } from 'react';
import { Users, UserX, UserCheck, Eye, ShieldAlert } from 'lucide-react';
import adminUserService from '../../services/admin/adminUserService';
import AdminFilters from '../../components/admin/AdminFilters';
import AdminDataTable from '../../components/admin/AdminDataTable';
import StatusBadge from '../../components/admin/StatusBadge';
import ConfirmationDialog from '../../components/admin/ConfirmationDialog';
import Button from '../../components/common/Button';

export function AdminUsers({ onViewUser }) {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterValues, setFilterValues] = useState({ role: 'all', status: 'all' });

  // Dialog state
  const [dialogState, setDialogState] = useState({
    isOpen: false,
    user: null,
    targetStatus: 'SUSPENDED'
  });

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await adminUserService.getUsers({
        page: pagination.page,
        limit: pagination.limit,
        role: filterValues.role,
        status: filterValues.status,
        search: searchTerm
      });
      setUsers(res.users || []);
      setPagination(res.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 });
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setIsLoading(false);
    }
  }, [pagination.page, pagination.limit, filterValues, searchTerm]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleFilterChange = (key, val) => {
    setFilterValues((prev) => ({ ...prev, [key]: val }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleReset = () => {
    setSearchTerm('');
    setFilterValues({ role: 'all', status: 'all' });
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleStatusUpdate = async (reason) => {
    if (!dialogState.user) return;
    await adminUserService.updateUserStatus(
      dialogState.user._id,
      dialogState.targetStatus,
      reason
    );
    fetchUsers();
  };

  const filterOptions = [
    {
      key: 'role',
      options: [
        { label: 'Role: All Roles', value: 'all' },
        { label: 'Community Member (USER)', value: 'USER' },
        { label: 'Administrator (ADMIN)', value: 'ADMIN' }
      ]
    },
    {
      key: 'status',
      options: [
        { label: 'Status: All', value: 'all' },
        { label: 'Active Members', value: 'ACTIVE' },
        { label: 'Suspended Accounts', value: 'SUSPENDED' },
        { label: 'Inactive Profiles', value: 'INACTIVE' }
      ]
    }
  ];

  const columns = [
    {
      header: 'Member Identity',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              backgroundColor: 'var(--mint)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.9rem',
              flexShrink: 0
            }}
          >
            {row.fullName ? row.fullName[0].toUpperCase() : 'U'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontWeight: 600, color: 'var(--text)' }}>{row.fullName}</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{row.email}</span>
          </div>
        </div>
      )
    },
    {
      header: 'Role Clearance',
      render: (row) => <StatusBadge status={row.role} />
    },
    {
      header: 'Account Status',
      render: (row) => <StatusBadge status={row.accountStatus} />
    },
    {
      header: 'Affiliations',
      render: (row) => (
        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
          {row.mentorProfile && (
            <span
              style={{
                fontSize: '0.675rem',
                padding: '0.15rem 0.45rem',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'rgba(101, 115, 184, 0.15)',
                color: '#43529d',
                fontWeight: 600
              }}
            >
              Mentor ({row.mentorProfile.status})
            </span>
          )}
          {row.artisanProfile && (
            <span
              style={{
                fontSize: '0.675rem',
                padding: '0.15rem 0.45rem',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'rgba(196, 119, 83, 0.15)',
                color: '#9d4a25',
                fontWeight: 600
              }}
            >
              Artisan ({row.artisanProfile.verificationStatus})
            </span>
          )}
          {!row.mentorProfile && !row.artisanProfile && (
            <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Member</span>
          )}
        </div>
      )
    },
    {
      header: 'Joined Date',
      render: (row) => (
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          {new Date(row.createdAt).toLocaleDateString()}
        </span>
      )
    },
    {
      header: 'Actions',
      align: 'right',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.4rem' }}>
          <button
            type="button"
            onClick={() => onViewUser && onViewUser(row._id)}
            style={{
              padding: '0.35rem 0.6rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border)',
              backgroundColor: '#ffffff',
              color: 'var(--text)',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}
            title="Inspect Profile"
          >
            <Eye size={14} />
            <span>View</span>
          </button>

          {row.accountStatus === 'ACTIVE' ? (
            <button
              type="button"
              onClick={() =>
                setDialogState({
                  isOpen: true,
                  user: row,
                  targetStatus: 'SUSPENDED'
                })
              }
              style={{
                padding: '0.35rem 0.6rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid rgba(186, 26, 26, 0.3)',
                backgroundColor: 'var(--error-surface)',
                color: 'var(--error)',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}
              title="Suspend User Account"
            >
              <UserX size={14} />
              <span>Suspend</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() =>
                setDialogState({
                  isOpen: true,
                  user: row,
                  targetStatus: 'ACTIVE'
                })
              }
              style={{
                padding: '0.35rem 0.6rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid rgba(32, 109, 57, 0.3)',
                backgroundColor: 'rgba(32, 109, 57, 0.1)',
                color: '#2e7d32',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}
              title="Restore / Activate Account"
            >
              <UserCheck size={14} />
              <span>Restore</span>
            </button>
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
          User & Guild Directory
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0 }}>
          Oversee member identities, affiliations, account security standing, and disciplinary suspensions.
        </p>
      </div>

      <AdminFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Filter by name, identifier, or email..."
        filterOptions={filterOptions}
        filterValues={filterValues}
        onFilterChange={handleFilterChange}
        onReset={handleReset}
      />

      <AdminDataTable
        columns={columns}
        data={users}
        isLoading={isLoading}
        emptyMessage="No community members found matching query."
        pagination={pagination}
        onPageChange={(page) => setPagination((prev) => ({ ...prev, page }))}
      />

      {/* Suspension / Restoration Dialog */}
      <ConfirmationDialog
        isOpen={dialogState.isOpen}
        onClose={() => setDialogState({ isOpen: false, user: null, targetStatus: 'SUSPENDED' })}
        onConfirm={handleStatusUpdate}
        title={
          dialogState.targetStatus === 'SUSPENDED'
            ? `Suspend Account: ${dialogState.user?.fullName}`
            : `Restore Account: ${dialogState.user?.fullName}`
        }
        message={
          dialogState.targetStatus === 'SUSPENDED'
            ? 'Suspending this user will immediately revoke their active session and restrict all platform interactions across all 5 modules.'
            : 'Restoring this account will reinstate normal platform access and verify their community standing.'
        }
        confirmText={dialogState.targetStatus === 'SUSPENDED' ? 'Suspend Account' : 'Restore Account'}
        variant={dialogState.targetStatus === 'SUSPENDED' ? 'danger' : 'primary'}
        requireReason={dialogState.targetStatus === 'SUSPENDED'}
        reasonPlaceholder="Specify violation reason for audit log compliance..."
      />
    </div>
  );
}

export default AdminUsers;
