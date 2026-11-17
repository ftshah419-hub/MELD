import React from 'react';
import { Link } from 'react-router-dom';
import MeldLogo from '../../components/common/MeldLogo';
import Button from '../../components/common/Button';
import { ArrowLeft, Home, Compass } from 'lucide-react';

export function NotFound() {
  return (
    <div
      className="animate-fade-in"
      style={{
        minHeight: '75vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1.5rem',
        textAlign: 'center'
      }}
    >
      <div
        className="card-surface"
        style={{
          maxWidth: '560px',
          width: '100%',
          padding: '3.5rem 2.5rem'
        }}
      >
        <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
          <MeldLogo size="lg" showText={false} />
        </div>

        <div
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '5rem',
            fontWeight: 800,
            color: 'var(--primary)',
            lineHeight: 1,
            letterSpacing: '-0.04em',
            marginBottom: '0.75rem'
          }}
        >
          404
        </div>

        <h1
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.75rem',
            fontWeight: 700,
            color: 'var(--text)',
            marginBottom: '1rem'
          }}
        >
          Lost Between Worlds?
        </h1>

        <p
          style={{
            color: 'var(--text-muted)',
            fontSize: '0.975rem',
            lineHeight: 1.65,
            marginBottom: '2.25rem'
          }}
        >
          The page or resource you are looking for has been moved, reconnected, or does not exist
          in this sector of the MELD community platform.
        </p>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            flexWrap: 'wrap'
          }}
        >
          <Link to="/">
            <Button variant="primary" size="md" iconLeft={<Home size={18} />}>
              Back to Home
            </Button>
          </Link>
          <Link to="/explore">
            <Button variant="outline" size="md" iconLeft={<Compass size={18} />}>
              Explore Initiatives
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
