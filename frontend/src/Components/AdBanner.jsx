import { useState, useEffect, useRef } from 'react';
import { RxCross2 } from 'react-icons/rx';

const AdBanner = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const timeElapsedRef = useRef(0);
  const hasShownRef = useRef(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(prev => {
        const newTime = prev + 1;
        timeElapsedRef.current = newTime;
        if (timeElapsedRef.current >= 60 && !hasShownRef.current) { // Show after 1 minute
          hasShownRef.current = true;
          setIsVisible(true);
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []); // Empty dependency array - timer starts once on mount

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-red-600 to-red-800 text-white shadow-xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
        <div className="flex items-center space-x-6 flex-1">
          {/* Toyota Logo/Image Placeholder */}
          <div className="flex-shrink-0">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
              <span className="text-red-600 font-bold text-sm">TOYOTA</span>
            </div>
          </div>

          {/* Car Image */}
          <div className="flex-shrink-0">
            <img
              src="https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=200&h=120&fit=crop&crop=center"
              alt="Toyota Camry"
              className="w-48 h-28 object-cover rounded-lg shadow-lg"
              onError={(e) => {
                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDIwMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTIwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjEwMCIgeT0iNjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjOUI5QkE0IiBmb250LXNpemU9IjE0Ij5DYXIgSW1hZ2U8L3RleHQ+Cjwvc3ZnPg==';
              }}
            />
          </div>

          {/* Ad Content */}
          <div className="flex-1 ml-6">
            <h3 className="font-bold text-2xl mb-2">🚗 Toyota Camry 2024</h3>
            <p className="text-lg mb-1">Experience Luxury & Performance</p>
            <p className="text-sm opacity-90">Limited Time Offer: 0% Financing Available</p>
            <div className="flex items-center mt-2 space-x-4">
              <span className="bg-white text-red-600 px-3 py-1 rounded-full text-sm font-semibold">
                Starting at $25,000
              </span>
              <span className="text-sm">✨ Free Test Drive</span>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="flex items-center space-x-4">
          <button className="bg-white text-red-600 px-6 py-2 rounded-full font-bold hover:bg-gray-100 transition-colors">
            Learn More
          </button>

          {/* Close Button */}
          <button
            onClick={handleClose}
            className="p-2 hover:bg-red-700 rounded-full transition-colors"
            aria-label="Close banner"
          >
            <RxCross2 size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdBanner;
