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

export const normalizeImageUrl = (imageUrl: string | null, options?: { directUploads?: boolean }): string | null => {
  if (!imageUrl) return null;

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
    if (options?.directUploads) {
      // For direct uploads preview, convert to /uploads/ path
      return imageUrl.replace('/api/uploads/', '/uploads/');
    }
    return `${apiBase}${imageUrl}`;
  }

  // Case B: Path starts with /uploads/ or uploads/ (Legacy/Short path)
  if (imageUrl.startsWith('/uploads/') || imageUrl.startsWith('uploads/')) {
    if (options?.directUploads) {
      // For direct uploads preview, return as-is without /api prefix
      return imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
    }
    // We MUST prepend /api because server.js serves files at /api/uploads
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
      if (options?.directUploads) {
        // For direct uploads preview, return direct uploads path
        return `/uploads/${filename}`;
      }
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

// Get image URL for direct uploads preview (without /api prefix)
export const getDirectUploadsUrl = (imageUrl: string | null, fallbackUrl?: string): string => {
  const normalized = normalizeImageUrl(imageUrl, { directUploads: true });

  if (!normalized) {
    // Return fallback or placeholder if no image URL
    return fallbackUrl || '/placeholder.svg';
  }

  return normalized;
};