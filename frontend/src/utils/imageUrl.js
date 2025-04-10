import { UPLOADS_URL } from './config';

export const getImageUrl = (imagePath, timestamp = false) => {
  // Handle null, undefined, or empty string cases
  if (!imagePath || imagePath.trim() === '') {
    return '/default-event.jpg';
  }

  // If it's already a full URL, return it
  if (imagePath.startsWith('http')) {
    return imagePath;
  }

  try {
    // Ensure the path is properly formatted
    const cleanPath = imagePath.replace(/^\/+|\/+$/g, '').replace(/\/+/g, '/');
    const baseUrl = `${UPLOADS_URL}/events/${cleanPath}`;
    
    // Add cache-busting timestamp if requested
    return timestamp ? `${baseUrl}?t=${Date.now()}` : baseUrl;
  } catch (error) {
    console.error('Error constructing image URL:', error);
    return '/default-event.jpg';
  }
};
