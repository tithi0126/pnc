// Utility functions for handling image URLs

/**
 * Normalizes image URLs to use the current API base URL
 * This handles cases where images were saved with different ports
 */
export const normalizeImageUrl = (imageUrl: string | null): string | null => {
  if (!imageUrl) return null;

  const originalUrl = imageUrl;

  // Fix malformed URLs (missing // after https:)
  if (imageUrl.startsWith('https:/') && !imageUrl.startsWith('https://')) {
    imageUrl = imageUrl.replace('https:/', 'https://');
  }

  // Fix URLs with wrong path (/api/uploads/ should be /uploads/)
  if (imageUrl.includes('/api/uploads/')) {
    imageUrl = imageUrl.replace('/api/uploads/', '/uploads/');
  }

  // If it's already a full URL with the current API base, return as-is
  const apiBase = import.meta.env.VITE_API_URL?.replace('/api', '')
  || 'https://api.pncpriyamnutritioncare.com'
  // || 'http://localhost:5003'
  ;

  // Debug logging
  if (originalUrl !== imageUrl) {
    console.log('normalizeImageUrl - Fixed malformed URL:', { original: originalUrl, fixed: imageUrl });
  }

  if (imageUrl.startsWith(apiBase)) {
    console.log('normalizeImageUrl - Already correct URL:', imageUrl);
    return imageUrl;
  }

  // If it's a relative path to uploads, construct full URL
  if (imageUrl.startsWith('/uploads/') || imageUrl.startsWith('uploads/')) {
    const result = `${apiBase}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
    console.log('normalizeImageUrl - Constructed from relative path:', { input: imageUrl, result });
    return result;
  }

  // If it's an old URL with different port, replace with current base
  if (imageUrl.includes('/uploads/')) {
    const filename = imageUrl.split('/uploads/')[1];
    if (filename) {
      const result = `${apiBase}/uploads/${filename}`;
      console.log('normalizeImageUrl - Replaced old URL:', { input: imageUrl, result });
      return result;
    }
  }

  // Return as-is if we can't normalize it
  console.log('normalizeImageUrl - Returning as-is:', imageUrl);
  return imageUrl;
};

/**
 * Gets the base URL for API calls (without /api suffix)
 */
export const getApiBaseUrl = (): string => {
  return import.meta.env.VITE_API_URL?.replace('/api', '')
  || 'https://api.pncpriyamnutritioncare.com'
  // || 'http://localhost:5003'
  ;
};
