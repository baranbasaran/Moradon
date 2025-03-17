// Generate a random avatar URL using robohash.org
export const generateRandomAvatar = () => {
  const randomId = Math.random().toString(36).substring(7);
  return `https://robohash.org/${randomId}?set=set3&size=50x50`;
};

// Get a consistent avatar URL for a user
export const getUserAvatar = (userId) => {
  return `https://robohash.org/${userId}?set=set3&size=50x50`;
}; 