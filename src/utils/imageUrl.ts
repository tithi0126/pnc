// Utility functions for handling image URLs

/**
 * Normalizes image URLs to use the current API base URL
 * This handles cases where images were saved with different ports
 */
export const normalizeImageUrl = (imageUrl: string | null): string | null => {
  if (!imageUrl) return null;

  // If it's already a full URL with the current API base, return as-is
  const apiBase = import.meta.env.VITE_API_URL?.replace('/api', '') || 'https://pncapi.aangandevelopers.com';
  if (imageUrl.startsWith(apiBase)) {
    return imageUrl;
  }

  // If it's a relative path to uploads, construct full URL
  if (imageUrl.startsWith('/uploads/') || imageUrl.startsWith('uploads/')) {
    return `${apiBase}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
  }

  // If it's an old URL with different port, replace with current base
  if (imageUrl.includes('/uploads/')) {
    const filename = imageUrl.split('/uploads/')[1];
    if (filename) {
      return `${apiBase}/uploads/${filename}`;
    }
  }

  // Return as-is if we can't normalize it
  return imageUrl;
};

/**
 * Gets the base URL for API calls (without /api suffix)
 */
export const getApiBaseUrl = (): string => {
  return import.meta.env.VITE_API_URL?.replace('/api', '') || 'https://pncapi.aangandevelopers.com';
};
