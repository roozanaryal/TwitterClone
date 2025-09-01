import { useState, useEffect, useCallback } from 'react';
import useAPICall from '../api/useAPICall.js';

const AdBannerManager = () => {
  const [adConfig, setAdConfig] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({});
  const [activeSection, setActiveSection] = useState('basic');

  const callAPI = useAPICall();

  const fetchAdData = useCallback(async () => {
    try {
      const [configData, analyticsData] = await Promise.all([
        callAPI('admin/ad-banner', 'GET'),
        callAPI('admin/ad-banner/analytics', 'GET')
      ]);
      
      setAdConfig(configData);
      setFormData(configData);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Failed to fetch ad data:', error);
    } finally {
      setLoading(false);
    }
  }, [callAPI]);

  useEffect(() => {
    fetchAdData();
  }, [callAPI, fetchAdData]);

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
      const updatedConfig = await callAPI('admin/ad-banner', 'PUT', formData);
      setAdConfig(updatedConfig.adBanner);
      alert('Ad banner updated successfully!');
      await fetchAdData(); // Refresh analytics
    } catch (error) {
      console.error('Failed to update ad banner:', error);
      alert(error.message || 'Failed to update ad banner');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async () => {
    try {
      const result = await callAPI('admin/ad-banner/toggle', 'PATCH');
      setAdConfig(prev => ({ ...prev, isActive: result.isActive }));
      setFormData(prev => ({ ...prev, isActive: result.isActive }));
      await fetchAdData();
    } catch (error) {
      console.error('Failed to toggle ad status:', error);
      alert(error.message || 'Failed to toggle ad status');
    }
  };

  const handleReset = async () => {
    if (!confirm('Are you sure you want to reset the ad banner to default values?')) {
      return;
    }

    setSaving(true);
    try {
      const result = await callAPI('admin/ad-banner/reset', 'POST');
      setAdConfig(result.adBanner);
      setFormData(result.adBanner);
      alert('Ad banner reset to default values!');
      await fetchAdData();
    } catch (error) {
      console.error('Failed to reset ad banner:', error);
      alert(error.message || 'Failed to reset ad banner');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Loading ad banner data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Analytics Overview */}
      {analytics && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Ad Performance Analytics</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{analytics.impressions}</div>
              <div className="text-sm text-gray-600">Total Impressions</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{analytics.clicks}</div>
              <div className="text-sm text-gray-600">Total Clicks</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{analytics.clickThroughRate}%</div>
              <div className="text-sm text-gray-600">Click-Through Rate</div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{analytics.remainingImpressions}</div>
              <div className="text-sm text-gray-600">Remaining Impressions</div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>Campaign ends in: <span className="font-medium">{analytics.daysRemaining} days</span></div>
            <div>Status: <span className={`font-medium ${analytics.isActive ? 'text-green-600' : 'text-red-600'}`}>
              {analytics.isActive ? 'Active' : 'Inactive'}
            </span></div>
          </div>
        </div>
      )}

      {/* Quick Controls */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Quick Controls</h3>
            <p className="text-sm text-gray-500 mt-1">Manage ad banner visibility and status</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleToggleStatus}
              className={`px-4 py-2 rounded-md font-medium ${
                adConfig?.isActive 
                  ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                  : 'bg-green-100 text-green-700 hover:bg-green-200'
              }`}
            >
              {adConfig?.isActive ? 'Deactivate Ad' : 'Activate Ad'}
            </button>
            <button
              onClick={handleReset}
              disabled={saving}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50"
            >
              Reset to Default
            </button>
          </div>
        </div>
      </div>

      {/* Configuration Sections */}
      <div className="bg-white rounded-lg shadow">
        {/* Section Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'basic', name: 'Basic Info', icon: '📝' },
              { id: 'design', name: 'Design & Media', icon: '🎨' },
              { id: 'targeting', name: 'Targeting & Schedule', icon: '🎯' },
              { id: 'advanced', name: 'Advanced Settings', icon: '⚙️' }
            ].map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeSection === section.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <span>{section.icon}</span>
                <span>{section.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Basic Info Section */}
          {activeSection === 'basic' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ad banner title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                  <input
                    type="text"
                    name="subtitle"
                    value={formData.subtitle || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ad banner subtitle"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  rows="3"
                  value={formData.description || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ad banner description"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                  <input
                    type="text"
                    name="price"
                    value={formData.price || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Starting at $25,000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    name="category"
                    value={formData.category || 'automotive'}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="automotive">Automotive</option>
                    <option value="technology">Technology</option>
                    <option value="fashion">Fashion</option>
                    <option value="food">Food & Dining</option>
                    <option value="travel">Travel</option>
                    <option value="finance">Finance</option>
                    <option value="health">Health & Wellness</option>
                    <option value="education">Education</option>
                    <option value="entertainment">Entertainment</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Design & Media Section */}
          {activeSection === 'design' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                  <input
                    type="url"
                    name="imageUrl"
                    value={formData.imageUrl || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Logo Text</label>
                  <input
                    type="text"
                    name="logoText"
                    value={formData.logoText || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="BRAND"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Background Color</label>
                  <select
                    name="backgroundColor"
                    value={formData.backgroundColor || 'from-red-600 to-red-800'}
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Text Color</label>
                  <select
                    name="textColor"
                    value={formData.textColor || 'white'}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="white">White</option>
                    <option value="black">Black</option>
                    <option value="gray-100">Light Gray</option>
                    <option value="gray-900">Dark Gray</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">CTA Button Text</label>
                  <input
                    type="text"
                    name="ctaText"
                    value={formData.ctaText || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Learn More"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">CTA URL</label>
                  <input
                    type="url"
                    name="ctaUrl"
                    value={formData.ctaUrl || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Targeting & Schedule Section */}
          {activeSection === 'targeting' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
                  <select
                    name="targetAudience"
                    value={formData.targetAudience || 'all'}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Users</option>
                    <option value="new_users">New Users Only</option>
                    <option value="active_users">Active Users</option>
                    <option value="premium_users">Premium Users</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority (1-10)</label>
                  <input
                    type="number"
                    name="priority"
                    min="1"
                    max="10"
                    value={formData.priority || 5}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isScheduled"
                    checked={formData.isScheduled || false}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  Enable Scheduling
                </label>
              </div>

              {formData.isScheduled && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                    <input
                      type="datetime-local"
                      name="startDate"
                      value={formData.startDate ? new Date(formData.startDate).toISOString().slice(0, 16) : ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                    <input
                      type="datetime-local"
                      name="endDate"
                      value={formData.endDate ? new Date(formData.endDate).toISOString().slice(0, 16) : ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Impressions</label>
                <input
                  type="number"
                  name="maxImpressions"
                  min="1"
                  value={formData.maxImpressions || 10000}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {/* Advanced Settings Section */}
          {activeSection === 'advanced' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Show Delay (seconds)</label>
                  <input
                    type="number"
                    name="showDelay"
                    min="1"
                    max="300"
                    value={formData.showDelay || 20}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Time before ad appears after page load</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Close Button Delay (seconds)</label>
                  <input
                    type="number"
                    name="closeDelay"
                    min="1"
                    max="60"
                    value={formData.closeDelay || 5}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Time before close button becomes available</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Admin Notes</label>
                <textarea
                  name="adminNotes"
                  rows="4"
                  value={formData.adminNotes || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Internal notes about this ad campaign..."
                />
              </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive || false}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  Ad Banner Active
                </label>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="mt-8 flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => setFormData(adConfig)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Reset Form
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>

      {/* Preview */}
      {adConfig && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Live Preview</h3>
          <div className={`bg-gradient-to-r ${formData.backgroundColor || adConfig.backgroundColor} text-${formData.textColor || adConfig.textColor} p-4 rounded-lg`}>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-red-600 font-bold text-xs">{formData.logoText || adConfig.logoText}</span>
              </div>
              {(formData.imageUrl || adConfig.imageUrl) && (
                <div className="flex-shrink-0">
                  <img
                    src={formData.imageUrl || adConfig.imageUrl}
                    alt="Ad preview"
                    className="w-32 h-20 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}
              <div className="flex-1">
                <h4 className="font-bold text-lg">{formData.title || adConfig.title}</h4>
                <p className="text-sm">{formData.subtitle || adConfig.subtitle}</p>
                <p className="text-xs opacity-90">{formData.description || adConfig.description}</p>
                <div className="mt-2">
                  <span className="bg-white text-red-600 px-2 py-1 rounded text-xs font-semibold">
                    {formData.price || adConfig.price}
                  </span>
                </div>
              </div>
              <div className="flex-shrink-0">
                <button className="bg-white text-red-600 px-4 py-2 rounded-full font-bold text-sm">
                  {formData.ctaText || adConfig.ctaText}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdBannerManager;
