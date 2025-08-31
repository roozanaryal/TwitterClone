// Get all users (Admin only)
export const getAllUsers = async (callAPI) => {
  try {
    const response = await callAPI('users/all', 'GET');
    return response;
  } catch (error) {
    console.error('Error fetching all users:', error);
    throw error;
  }
};

export default { getAllUsers };
