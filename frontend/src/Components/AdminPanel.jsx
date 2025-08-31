import { useState, useEffect } from 'react';
import { getAdBanner, updateAdBanner, resetAdBanner } from '../api/adBanner.api.js';

const AdminPanel = () => {
  const [adConfig, setAdConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({});

  // Fetch current ad banner configuration
  useEffect(() => {
    const fetchAdConfig = async () => {
      try {
        const data = await getAdBanner();
        setAdConfig(data);
        setFormData(data);
      } catch (error) {
        console.error('Failed to fetch ad banner config:', error);
        alert('Failed to load ad banner configuration');
      } finally {
        setLoading(false);
      }
    };

    fetchAdConfig();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const data = await updateAdBanner(formData);
      setAdConfig(data.adBanner);
      alert('Ad banner updated successfully!');
    } catch (error) {
      console.error('Failed to update ad banner:', error);
      alert(error.message || 'Failed to update ad banner');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!confirm('Are you sure you want to reset the ad banner to default values?')) {
      return;
    }

    setSaving(true);
    try {
      const data = await resetAdBanner();
      setAdConfig(data.adBanner);
      setFormData(data.adBanner);
      alert('Ad banner reset to default values!');
    } catch (error) {
      console.error('Failed to reset ad banner:', error);
      alert(error.message || 'Failed to reset ad banner');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Ad Banner Admin Panel</h1>
            <button
              onClick={handleReset}
              disabled={saving}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
            >
              Reset to Default
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Active Toggle */}
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={formData.isActive || false}
                onChange={handleInputChange}
                className="w-5 h-5 text-blue-600"
              />
              <label htmlFor="isActive" className="text-lg font-medium text-gray-700">
                Ad Banner Active
              </label>
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="subtitle" className="block text-sm font-medium text-gray-700 mb-2">
                  Subtitle
                </label>
                <input
                  type="text"
                  id="subtitle"
                  name="subtitle"
                  value={formData.subtitle || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <input
                  type="text"
                  id="description"
                  name="description"
                  value={formData.description || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                  Price
                </label>
                <input
                  type="text"
                  id="price"
                  name="price"
                  value={formData.price || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="logoText" className="block text-sm font-medium text-gray-700 mb-2">
                  Logo Text
                </label>
                <input
                  type="text"
                  id="logoText"
                  name="logoText"
                  value={formData.logoText || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="ctaText" className="block text-sm font-medium text-gray-700 mb-2">
                  CTA Button Text
                </label>
                <input
                  type="text"
                  id="ctaText"
                  name="ctaText"
                  value={formData.ctaText || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* URLs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  id="imageUrl"
                  name="imageUrl"
                  value={formData.imageUrl || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="ctaUrl" className="block text-sm font-medium text-gray-700 mb-2">
                  CTA URL
                </label>
                <input
                  type="url"
                  id="ctaUrl"
                  name="ctaUrl"
                  value={formData.ctaUrl || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Styling */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="backgroundColor" className="block text-sm font-medium text-gray-700 mb-2">
                  Background Gradient (Tailwind classes)
                </label>
                <select
                  id="backgroundColor"
                  name="backgroundColor"
                  value={formData.backgroundColor || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="from-red-600 to-red-800">Red Gradient</option>
                  <option value="from-blue-600 to-blue-800">Blue Gradient</option>
                  <option value="from-green-600 to-green-800">Green Gradient</option>
                  <option value="from-purple-600 to-purple-800">Purple Gradient</option>
                  <option value="from-orange-600 to-orange-800">Orange Gradient</option>
                  <option value="from-gray-600 to-gray-800">Gray Gradient</option>
                </select>
              </div>

              <div>
                <label htmlFor="textColor" className="block text-sm font-medium text-gray-700 mb-2">
                  Text Color
                </label>
                <select
                  id="textColor"
                  name="textColor"
                  value={formData.textColor || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="white">White</option>
                  <option value="black">Black</option>
                  <option value="gray-100">Light Gray</option>
                  <option value="gray-800">Dark Gray</option>
                </select>
              </div>
            </div>

            {/* Timing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="showDelay" className="block text-sm font-medium text-gray-700 mb-2">
                  Show Delay (seconds)
                </label>
                <input
                  type="number"
                  id="showDelay"
                  name="showDelay"
                  min="1"
                  max="300"
                  value={formData.showDelay || 20}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="closeDelay" className="block text-sm font-medium text-gray-700 mb-2">
                  Close Button Delay (seconds)
                </label>
                <input
                  type="number"
                  id="closeDelay"
                  name="closeDelay"
                  min="1"
                  max="60"
                  value={formData.closeDelay || 5}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>

          {/* Preview Section */}
          {adConfig && (
            <div className="mt-8 border-t pt-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Preview</h2>
              <div className={`bg-gradient-to-r ${adConfig.backgroundColor} text-${adConfig.textColor} p-4 rounded-lg`}>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                    <span className="text-red-600 font-bold text-xs">{adConfig.logoText}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{adConfig.title}</h3>
                    <p className="text-sm">{adConfig.subtitle}</p>
                    <p className="text-xs opacity-90">{adConfig.description}</p>
                  </div>
                  <div className="text-right">
                    <span className="bg-white text-red-600 px-2 py-1 rounded text-xs font-semibold">
                      {adConfig.price}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
