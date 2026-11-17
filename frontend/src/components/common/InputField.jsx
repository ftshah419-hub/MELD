import React, { forwardRef } from 'react';

/**
 * MELD Shared Accessible Input Field
 */
export const InputField = forwardRef(function InputField(
  {
    id,
    label,
    name,
    type = 'text',
    value,
    defaultValue,
    onChange,
    onBlur,
    placeholder = '',
    error = null,
    helperText = null,
    icon = null,
    rightAction = null,
    required = false,
    disabled = false,
    autoComplete,
    className = '',
    ...props
  },
  ref
) {
  const inputId = id || `input-${name}-${Math.random().toString(36).substr(2, 6)}`;

  return (
    <div className={`meld-input-group ${className}`} style={{ marginBottom: '1.25rem' }}>
      {label && (
        <label
          htmlFor={inputId}
          style={{
            display: 'block',
            marginBottom: '0.45rem',
            fontFamily: 'var(--font-heading)',
            fontSize: '0.875rem',
            fontWeight: 600,
            color: 'var(--text)'
          }}
        >
          {label}
          {required && <span style={{ color: 'var(--error)', marginLeft: '0.25rem' }}>*</span>}
        </label>
      )}

      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        {icon && (
          <span
            style={{
              position: 'absolute',
              left: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted)',
              pointerEvents: 'none',
              zIndex: 1
            }}
          >
            {icon}
          </span>
        )}

        <input
          ref={ref}
          id={inputId}
          name={name}
          type={type}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          autoComplete={autoComplete}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          style={{
            width: '100%',
            padding: '0.75rem 1rem',
            paddingLeft: icon ? '2.85rem' : '1rem',
            paddingRight: rightAction ? '3rem' : '1rem',
            fontFamily: 'var(--font-body)',
            fontSize: '0.95rem',
            color: 'var(--text)',
            backgroundColor: '#FFFFFF',
            border: `1.5px solid ${error ? 'var(--error)' : 'var(--secondary)'}`,
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-xs)',
            transition: 'border-color var(--transition-fast), box-shadow var(--transition-fast)',
            outline: 'none'
          }}
          onFocus={(e) => {
            if (!error) {
              e.currentTarget.style.borderColor = 'var(--primary)';
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(22, 75, 59, 0.15)';
            }
          }}
          {...props}
        />

        {rightAction && (
          <div
            style={{
              position: 'absolute',
              right: '0.85rem',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            {rightAction}
          </div>
        )}
      </div>

      {error && (
        <p
          id={`${inputId}-error`}
          className="animate-slide-up"
          style={{
            margin: '0.4rem 0 0 0',
            fontSize: '0.8rem',
            color: 'var(--error)',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem'
          }}
        >
          <span style={{ fontSize: '1rem' }}>⚠</span>
          <span>{error}</span>
        </p>
      )}

      {!error && helperText && (
        <p
          style={{
            margin: '0.35rem 0 0 0',
            fontSize: '0.8rem',
            color: 'var(--text-muted)'
          }}
        >
          {helperText}
        </p>
      )}
    </div>
  );
});

export default InputField;
