import React from 'react';
import { Search, RotateCcw, Download } from 'lucide-react';
import Button from '../common/Button';

export function AdminFilters({
  searchTerm = '',
  onSearchChange,
  searchPlaceholder = 'Search records...',
  filterOptions = [],
  filterValues = {},
  onFilterChange,
  onReset,
  onExport = null,
  exportLabel = 'Export CSV'
}) {
  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        borderRadius: 'var(--radius-lg)',
        padding: '1rem 1.25rem',
        boxShadow: 'var(--shadow-sm)',
        border: '1px solid var(--border-subtle)',
        marginBottom: '1.25rem',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.85rem'
      }}
    >
      {/* Search Input */}
      <div style={{ position: 'relative', flex: '1 1 280px', minWidth: '220px' }}>
        <Search
          size={18}
          style={{
            position: 'absolute',
            left: '0.85rem',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-subtle)'
          }}
        />
        <input
          type="search"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          style={{
            width: '100%',
            height: '40px',
            paddingLeft: '2.5rem',
            paddingRight: '1rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border)',
            backgroundColor: 'var(--background)',
            color: 'var(--text)',
            fontSize: '0.875rem',
            outline: 'none',
            transition: 'border-color var(--transition-fast)'
          }}
        />
      </div>

      {/* Dropdown Filters */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.65rem' }}>
        {filterOptions.map((filter) => (
          <div key={filter.key} style={{ minWidth: '130px' }}>
            <select
              value={filterValues[filter.key] || 'all'}
              onChange={(e) => onFilterChange(filter.key, e.target.value)}
              style={{
                width: '100%',
                height: '40px',
                padding: '0 0.85rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)',
                backgroundColor: 'var(--background)',
                color: 'var(--text)',
                fontSize: '0.825rem',
                fontWeight: 500,
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              {filter.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        ))}

        {onReset && (
          <button
            type="button"
            onClick={onReset}
            style={{
              height: '40px',
              padding: '0 0.85rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
              backgroundColor: 'transparent',
              color: 'var(--text-muted)',
              fontSize: '0.825rem',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              cursor: 'pointer'
            }}
            title="Reset Filters"
          >
            <RotateCcw size={15} />
            <span>Reset</span>
          </button>
        )}

        {onExport && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            iconLeft={<Download size={15} />}
            onClick={onExport}
          >
            {exportLabel}
          </Button>
        )}
      </div>
    </div>
  );
}

export default AdminFilters;
