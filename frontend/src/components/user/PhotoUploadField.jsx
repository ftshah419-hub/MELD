import React, { useState, useRef } from 'react';
import { Camera, Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import uploadService from '../../services/uploadService';

export function PhotoUploadField({
  label = 'Add Photo',
  value,
  onChange,
  folder = 'meld/listings',
  placeholder = 'https://images.unsplash.com/... or upload a photo'
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    setUploading(true);

    try {
      const url = await uploadService.uploadImage(file, folder);
      if (url) {
        onChange(url);
      }
    } catch (err) {
      setError(err.message || 'Failed to upload image');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = () => {
    onChange('');
    setError('');
  };

  return (
    <div style={{ marginBottom: '1rem' }}>
      <label
        style={{
          display: 'block',
          fontSize: '0.8rem',
          fontWeight: 600,
          marginBottom: '0.35rem',
          color: 'var(--text)'
        }}
      >
        {label}
      </label>

      {/* If an image is selected/previewed */}
      {value ? (
        <div
          style={{
            position: 'relative',
            display: 'inline-block',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            border: '2px solid var(--border)',
            backgroundColor: 'var(--warm-cream)'
          }}
        >
          <img
            src={value}
            alt="Preview"
            style={{
              width: '100%',
              maxWidth: '280px',
              height: '140px',
              objectFit: 'cover',
              display: 'block'
            }}
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80';
            }}
          />
          <button
            type="button"
            onClick={handleRemove}
            style={{
              position: 'absolute',
              top: '6px',
              right: '6px',
              backgroundColor: 'rgba(0, 0, 0, 0.65)',
              color: '#fff',
              border: 'none',
              borderRadius: '50%',
              width: '26px',
              height: '26px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
            title="Remove photo"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        /* Empty upload dropzone */
        <div>
          <div
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: '1.5px dashed var(--border)',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem 1rem',
              textAlign: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.015)',
              cursor: uploading ? 'not-allowed' : 'pointer',
              transition: 'border-color 0.2s ease',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileSelect}
              disabled={uploading}
            />

            {uploading ? (
              <>
                <Loader2 size={24} style={{ color: 'var(--primary)', animation: 'spin 1s linear infinite' }} />
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Uploading photo...</span>
              </>
            ) : (
              <>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(22, 75, 59, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--primary)'
                  }}
                >
                  <Camera size={18} />
                </div>
                <div style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text)' }}>
                  Click to choose a photo
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  PNG, JPG, WEBP up to 5MB
                </div>
              </>
            )}
          </div>

          {/* Toggle URL input */}
          <div style={{ marginTop: '0.35rem', textAlign: 'right' }}>
            <button
              type="button"
              onClick={() => setShowUrlInput(!showUrlInput)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '0.725rem',
                color: 'var(--primary)',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              {showUrlInput ? 'Hide URL input' : 'Or paste image web link'}
            </button>
          </div>

          {showUrlInput && (
            <div style={{ marginTop: '0.35rem' }}>
              <input
                type="url"
                placeholder={placeholder}
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem 0.75rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  fontSize: '0.8rem'
                }}
              />
            </div>
          )}
        </div>
      )}

      {error && (
        <div style={{ fontSize: '0.75rem', color: '#c0392b', marginTop: '0.35rem' }}>
          {error}
        </div>
      )}
    </div>
  );
}

export default PhotoUploadField;
