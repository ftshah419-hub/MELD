import React, { useState } from 'react';

/**
 * Reusable Cloudinary Image Component
 * Handles Cloudinary URL transformations, lazy loading, skeleton loading, and fallback handling
 */
export function CloudinaryImage({
  src,
  alt = 'MELD Visual',
  width,
  height,
  crop = 'fill',
  quality = 'auto',
  format = 'auto',
  className = '',
  style = {},
  fallbackSrc = '/assets/images/meld-logo.jpg',
  ...props
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  /**
   * Inject Cloudinary transformations if URL is from res.cloudinary.com
   */
  const getTransformedUrl = (url) => {
    if (!url || typeof url !== 'string') return fallbackSrc;
    if (!url.includes('res.cloudinary.com') || !url.includes('/upload/')) {
      return url;
    }

    const transformations = [];
    if (crop) transformations.push(`c_${crop}`);
    if (width) transformations.push(`w_${width}`);
    if (height) transformations.push(`h_${height}`);
    if (quality) transformations.push(`q_${quality}`);
    if (format) transformations.push(`f_${format}`);

    if (transformations.length === 0) return url;

    const transformStr = transformations.join(',');
    return url.replace('/upload/', `/upload/${transformStr}/`);
  };

  const finalSrc = hasError ? fallbackSrc : getTransformedUrl(src);

  return (
    <div
      style={{
        position: 'relative',
        overflow: 'hidden',
        width: width ? `${width}px` : '100%',
        height: height ? `${height}px` : '100%',
        backgroundColor: 'var(--mint)',
        borderRadius: style.borderRadius || 'var(--radius-lg)',
        ...style
      }}
      className={`cloudinary-img-wrapper ${className}`}
    >
      {/* Skeleton Shimmer */}
      {!isLoaded && !hasError && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, #DCEBE1 0%, #EEFDF2 50%, #DCEBE1 100%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite'
          }}
        />
      )}

      <img
        src={finalSrc}
        alt={alt}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: crop === 'fill' ? 'cover' : 'contain',
          opacity: isLoaded || hasError ? 1 : 0,
          transition: 'opacity var(--transition-normal)'
        }}
        {...props}
      />
    </div>
  );
}

export default CloudinaryImage;
