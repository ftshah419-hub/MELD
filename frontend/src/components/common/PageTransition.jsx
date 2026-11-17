import React from 'react';

/**
 * MELD Page Transition Wrapper
 * Ensures smooth, accessible entrance for routes
 */
export function PageTransition({ children, className = '' }) {
  return (
    <div
      className={`meld-page-transition animate-fade-in ${className}`}
      style={{
        width: '100%',
        minHeight: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {children}
    </div>
  );
}

export default PageTransition;
