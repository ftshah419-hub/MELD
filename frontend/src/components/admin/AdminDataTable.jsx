import React from 'react';
import { ChevronLeft, ChevronRight, Inbox } from 'lucide-react';

export function AdminDataTable({
  columns = [],
  data = [],
  isLoading = false,
  emptyMessage = 'No records found matching criteria.',
  pagination = null,
  onPageChange = null,
  rowKey = '_id'
}) {
  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border-subtle)',
        boxShadow: 'var(--shadow-sm)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <div style={{ overflowX: 'auto', width: '100%' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--mint-light)', borderBottom: '1px solid var(--border)' }}>
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  style={{
                    padding: '0.9rem 1.25rem',
                    fontFamily: 'var(--font-heading)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    color: 'var(--primary)',
                    textAlign: col.align || 'left',
                    width: col.width || 'auto'
                  }}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              // Loading Skeleton Rows
              Array.from({ length: 5 }).map((_, rIdx) => (
                <tr key={rIdx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  {columns.map((_, cIdx) => (
                    <td key={cIdx} style={{ padding: '1rem 1.25rem' }}>
                      <div
                        style={{
                          height: '16px',
                          backgroundColor: 'var(--border)',
                          borderRadius: '4px',
                          animation: 'pulse 1.5s infinite ease-in-out',
                          width: `${Math.floor(Math.random() * 40 + 50)}%`
                        }}
                      />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              // Empty State
              <tr>
                <td
                  colSpan={columns.length}
                  style={{
                    padding: '3.5rem 1rem',
                    textAlign: 'center',
                    color: 'var(--text-muted)'
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--mint)',
                        color: 'var(--primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Inbox size={24} />
                    </div>
                    <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text)' }}>
                      {emptyMessage}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>
                      Try adjusting active filters or search terms.
                    </span>
                  </div>
                </td>
              </tr>
            ) : (
              // Data Rows
              data.map((row, rIdx) => {
                const key = row[rowKey] || rIdx;
                return (
                  <tr
                    key={key}
                    style={{
                      borderBottom: '1px solid var(--border-subtle)',
                      transition: 'background-color var(--transition-fast)'
                    }}
                    className="hover:bg-surface-alt"
                  >
                    {columns.map((col, cIdx) => (
                      <td
                        key={cIdx}
                        style={{
                          padding: '1rem 1.25rem',
                          fontSize: '0.875rem',
                          color: 'var(--text)',
                          textAlign: col.align || 'left',
                          verticalAlign: 'middle'
                        }}
                      >
                        {col.render ? col.render(row, rIdx) : row[col.accessor]}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      {pagination && pagination.totalPages > 1 && (
        <div
          style={{
            padding: '0.85rem 1.25rem',
            borderTop: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--surface-alt)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem'
          }}
        >
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Showing page <strong>{pagination.page}</strong> of <strong>{pagination.totalPages}</strong> (
            <strong>{pagination.total}</strong> total records)
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <button
              onClick={() => onPageChange && onPageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border)',
                backgroundColor: pagination.page <= 1 ? 'transparent' : '#ffffff',
                color: pagination.page <= 1 ? 'var(--text-subtle)' : 'var(--text)',
                cursor: pagination.page <= 1 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: pagination.page <= 1 ? 0.5 : 1
              }}
              title="Previous Page"
            >
              <ChevronLeft size={16} />
            </button>

            <span style={{ fontSize: '0.8rem', fontWeight: 600, padding: '0 0.5rem' }}>
              {pagination.page}
            </span>

            <button
              onClick={() => onPageChange && onPageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border)',
                backgroundColor: pagination.page >= pagination.totalPages ? 'transparent' : '#ffffff',
                color: pagination.page >= pagination.totalPages ? 'var(--text-subtle)' : 'var(--text)',
                cursor: pagination.page >= pagination.totalPages ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: pagination.page >= pagination.totalPages ? 0.5 : 1
              }}
              title="Next Page"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDataTable;
