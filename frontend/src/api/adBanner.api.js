const API_BASE_URL = '/api/ad-banner';

export const getAdBanner = async () => {
  try {
    const response = await fetch(API_BASE_URL);
    if (!response.ok) {
      throw new Error('Failed to fetch ad banner');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching ad banner:', error);
    throw error;
  }
};

export const updateAdBanner = async (adData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/update`, {
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

export const resetAdBanner = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/reset`, {
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
