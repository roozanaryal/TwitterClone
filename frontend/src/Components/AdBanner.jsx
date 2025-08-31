import { useState, useEffect, useRef } from 'react';
import { RxCross2 } from 'react-icons/rx';
import { useAuthContext } from '../context/AuthContext';

const AdBanner = ({ onClose }) => {
  const { authUser, authLoading } = useAuthContext();
  const [isVisible, setIsVisible] = useState(false);
  const [canClose, setCanClose] = useState(false);
  const [adStartTime, setAdStartTime] = useState(null);
  const [adConfig, setAdConfig] = useState(null);
  const timeElapsedRef = useRef(0);

  // Fetch ad banner configuration
  useEffect(() => {
    const fetchAdConfig = async () => {
      try {
        const response = await fetch('/api/ad-banner');
        const data = await response.json();
        setAdConfig(data);
      } catch (error) {
        console.error('Failed to fetch ad banner config:', error);
        // Use default config if API fails
        setAdConfig({
          isActive: true,
          title: "🚗 Toyota Camry 2024",
          subtitle: "Experience Luxury & Performance",
          description: "Limited Time Offer: 0% Financing Available",
          price: "Starting at $25,000",
          imageUrl: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=200&h=120&fit=crop&crop=center",
          logoText: "TOYOTA",
          ctaText: "Learn More",
          backgroundColor: "from-red-600 to-red-800",
          showDelay: 20,
          closeDelay: 5
        });
      }
    };

    fetchAdConfig();
  }, []);

  useEffect(() => {
    // Reset timer and banner state when user logs out
    if (!authUser) {
      timeElapsedRef.current = 0;
      setIsVisible(false);
      setCanClose(false);
      setAdStartTime(null);
      return;
    }

    // Don't show ads to admin users
    if (authUser.isAdmin) {
      return;
    }

    // Only start timer if user is authenticated and not loading
    if (!adConfig || !adConfig.isActive || authLoading) return;

    const timer = setInterval(() => {
      timeElapsedRef.current += 1;
      if (timeElapsedRef.current === adConfig.showDelay) {
        setIsVisible(true);
        setAdStartTime(Date.now());
        // Start close delay for close button
        setTimeout(() => {
          setCanClose(true);
        }, adConfig.closeDelay * 1000);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [adConfig, authUser, authLoading]); // Depend on adConfig and auth state

  const handleClose = () => {
    if (canClose) {
      setIsVisible(false);
      onClose?.();
    }
  };

  if (!isVisible || !adConfig) return null;

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 bg-gradient-to-r ${adConfig.backgroundColor} text-${adConfig.textColor} shadow-xl`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
        <div className="flex items-center space-x-6 flex-1">
          {/* Logo/Image Placeholder */}
          <div className="flex-shrink-0">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
              <span className="text-red-600 font-bold text-sm">{adConfig.logoText}</span>
            </div>
          </div>

          {/* Product Image */}
          <div className="flex-shrink-0">
            <img
              src={adConfig.imageUrl}
              alt={adConfig.title}
              className="w-48 h-28 object-cover rounded-lg shadow-lg"
              onError={(e) => {
                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDIwMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTIwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjEwMCIgeT0iNjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjOUI5QkE0IiBmb250LXNpemU9IjE0Ij5Qcm9kdWN0IEltYWdlPC90ZXh0Pgo8L3N2Zz4=';
              }}
            />
          </div>

          {/* Ad Content */}
          <div className="flex-1 ml-6">
            <h3 className="font-bold text-2xl mb-2">{adConfig.title}</h3>
            <p className="text-lg mb-1">{adConfig.subtitle}</p>
            <p className="text-sm opacity-90">{adConfig.description}</p>
            <div className="flex items-center mt-2 space-x-4">
              <span className="bg-white text-red-600 px-3 py-1 rounded-full text-sm font-semibold">
                {adConfig.price}
              </span>
              <span className="text-sm">✨ Free Test Drive</span>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => adConfig.ctaUrl && adConfig.ctaUrl !== '#' && window.open(adConfig.ctaUrl, '_blank')}
            className="bg-white text-red-600 px-6 py-2 rounded-full font-bold hover:bg-gray-100 transition-colors"
          >
            {adConfig.ctaText}
          </button>

          {/* Close Button */}
          <button
            onClick={handleClose}
            className={`p-2 rounded-full transition-colors ${
              canClose 
                ? 'hover:bg-red-700 cursor-pointer' 
                : 'opacity-50 cursor-not-allowed'
            }`}
            aria-label="Close banner"
            disabled={!canClose}
          >
            <RxCross2 size={24} />
          </button>
          {!canClose && adStartTime && adConfig.closeDelay && (
            <span className="text-xs opacity-75 ml-2">
              Wait {Math.max(0, adConfig.closeDelay - Math.floor((Date.now() - adStartTime) / 1000))}s
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdBanner;
