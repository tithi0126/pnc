export const getApiBaseUrl = (): string => {
  // Get API URL from env or fallback to the main domain
  let apiBase = import.meta.env.VITE_API_URL;

  // Fallback if env is missing
  if (!apiBase) {
    return 'https://pncpriyamnutritioncare.com';
  }

  // Remove /api suffix if present to get the root domain
  apiBase = apiBase.replace(/\/api\/?$/, '');

  // Fix common protocol typos
  if (apiBase.startsWith('https:/') && !apiBase.startsWith('https://')) {
    apiBase = apiBase.replace('https:/', 'https://');
  }

  // Ensure no trailing slash
  if (apiBase.endsWith('/')) {
    apiBase = apiBase.slice(0, -1);
  }

  return apiBase;
};

export const normalizeImageUrl = (imageUrl: string | null): string | null => {
  if (!imageUrl) return null;

  // Log the original URL for debugging in production
  if (process.env.NODE_ENV === 'production') {
    console.debug('Normalizing image URL:', imageUrl);
  }

  // 1. Fix malformed protocol (missing //)
  if (imageUrl.startsWith('https:/') && !imageUrl.startsWith('https://')) {
    imageUrl = imageUrl.replace('https:/', 'https://');
  }

  // 2. Fix specific domain typos if they exist in database
  if (imageUrl.includes('https:/.pncpriyam')) {
    imageUrl = imageUrl.replace('https:/.pncpriyam', 'https://pncpriyam');
  }

  const apiBase = getApiBaseUrl();

  // 3. Handle relative paths

  // Case A: Path starts with /api/uploads/ (Correct relative path)
  if (imageUrl.startsWith('/api/uploads/')) {
    return `${apiBase}${imageUrl}`;
  }

  // Case B: Path starts with /uploads/ or uploads/ (Legacy/Short path)
  // We MUST prepend /api because server.js serves files at /api/uploads
  if (imageUrl.startsWith('/uploads/') || imageUrl.startsWith('uploads/')) {
    const cleanPath = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
    return `${apiBase}/api${cleanPath}`;
  }

  // 4. Handle Full URLs

  // If it matches our current base, return as is
  if (imageUrl.startsWith(apiBase)) {
    return imageUrl;
  }

  // If it points to the old 'api.' subdomain or localhost, rewrite it to current base
  if (imageUrl.includes('/api/uploads/') || imageUrl.includes('/uploads/')) {
    // Extract the filename/path after 'uploads'
    const parts = imageUrl.split('/uploads/');
    const filename = parts[1];

    if (filename) {
      // Reconstruct using the correct base and /api/uploads path
      return `${apiBase}/api/uploads/${filename}`;
    }
  }

  return imageUrl;
};

// Enhanced image URL validation and fallback
export const getImageUrl = (imageUrl: string | null, fallbackUrl?: string): string => {
  const normalized = normalizeImageUrl(imageUrl);

  if (!normalized) {
    // Return fallback or placeholder if no image URL
    return fallbackUrl || '/placeholder.svg';
  }

  return normalized;
};

// Check if an image URL is accessible (for debugging)
export const checkImageUrl = async (url: string): Promise<boolean> => {
  if (!url) return false;

  try {
    const response = await fetch(url, {
      method: 'HEAD',
      mode: 'no-cors'
    });
    return true; // If we get here without error, assume it's accessible
  } catch (error) {
    console.warn('Image URL check failed:', url, error);
    return false;
  }
};