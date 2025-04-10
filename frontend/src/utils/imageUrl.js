export const getImageUrl = imagePath => {
  if (!imagePath) return '/default-event.jpg';
  if (imagePath.startsWith('http')) return imagePath;
  return `${process.env.REACT_APP_API_URL}/uploads/events/${imagePath}`;
};
