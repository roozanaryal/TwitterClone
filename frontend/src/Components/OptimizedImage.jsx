import { useState, memo, useCallback } from 'react';
import PropTypes from 'prop-types';

const OptimizedImage = memo(({ 
  src, 
  alt, 
  className = '', 
  fallback = '/default-avatar.png',
  loading = 'lazy',
  ...props 
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
  }, []);

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded" />
      )}
      <img
        src={hasError ? fallback : src}
        alt={alt}
        loading={loading}
        onLoad={handleLoad}
        onError={handleError}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}
        {...props}
      />
    </div>
  );
});

OptimizedImage.displayName = 'OptimizedImage';
OptimizedImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
  fallback: PropTypes.string,
  loading: PropTypes.oneOf(['lazy', 'eager']),
};

export default OptimizedImage;
