// Follow API endpoints
export const FOLLOW_ENDPOINTS = {
  FOLLOW: (userId) => `users/follow/${userId}`,
  UNFOLLOW: (userId) => `users/unfollow/${userId}`,
  GET_FOLLOWERS: (username) => `users/${username}/followers`,
  GET_FOLLOWING: (username) => `users/${username}/following`
};
