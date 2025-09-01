const API_BASE_URL = '/api/ad-banner';
const ADMIN_API_BASE_URL = '/api/admin/ad-banner';

// Public API - Get ad banner for display
export const getAdBanner = async (increment = false) => {
  try {
    const url = increment ? `${API_BASE_URL}?increment=true` : API_BASE_URL;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch ad banner');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching ad banner:', error);
    throw error;
  }
};

// Public API - Track ad click
export const trackAdClick = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/click`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to track ad click');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error tracking ad click:', error);
    throw error;
  }
};

// Admin API - Get ad banner config
export const getAdBannerAdmin = async () => {
  try {
    const response = await fetch(ADMIN_API_BASE_URL, {
      credentials: 'include'
    });
    if (!response.ok) {
      throw new Error('Failed to fetch ad banner config');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching ad banner config:', error);
    throw error;
  }
};

// Admin API - Update ad banner
export const updateAdBanner = async (adData) => {
  try {
    const response = await fetch(ADMIN_API_BASE_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(adData)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update ad banner');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating ad banner:', error);
    throw error;
  }
};

// Admin API - Reset ad banner
export const resetAdBanner = async () => {
  try {
    const response = await fetch(`${ADMIN_API_BASE_URL}/reset`, {
      method: 'POST',
      credentials: 'include'
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to reset ad banner');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error resetting ad banner:', error);
    throw error;
  }
};

// Admin API - Get ad analytics
export const getAdAnalytics = async () => {
  try {
    const response = await fetch(`${ADMIN_API_BASE_URL}/analytics`, {
      credentials: 'include'
    });
    if (!response.ok) {
      throw new Error('Failed to fetch ad analytics');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching ad analytics:', error);
    throw error;
  }
};

// Admin API - Toggle ad status
export const toggleAdStatus = async () => {
  try {
    const response = await fetch(`${ADMIN_API_BASE_URL}/toggle`, {
      method: 'PATCH',
      credentials: 'include'
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to toggle ad status');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error toggling ad status:', error);
    throw error;
  }
};
