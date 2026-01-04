// Test the fixed normalizeImageUrl function
const normalizeImageUrl = (imageUrl) => {
  if (!imageUrl) return null;

  // Fix malformed URLs (missing // after https:)
  if (imageUrl.startsWith('https:/') && !imageUrl.startsWith('https://')) {
    imageUrl = imageUrl.replace('https:/', 'https://');
  }

  // Fix URLs with wrong path (/api/uploads/ should be /uploads/)
  if (imageUrl.includes('/api/uploads/')) {
    imageUrl = imageUrl.replace('/api/uploads/', '/uploads/');
  }

  // If it's already a full URL with the current API base, return as-is
  const apiBase = 'https://api.pncpriyamnutritioncare.com';
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

// Test the malformed URLs from the console
console.log('Testing malformed URLs from console:');
console.log('');

const malformedUrls = [
  'https:/.pncpriyamnutritioncare.com/api/uploads/assorted-colorful-vegetables-and-nuts-on-wooden-background-photo-1767501055464-781797602.jpg',
  'https:/.pncpriyamnutritioncare.com/api/uploads/{ AanganDevelopers }-1767501085919-429197670.png',
  '/uploads/test-image.jpg',
  'https://api.pncpriyamnutritioncare.com/uploads/correct-image.jpg'
];

malformedUrls.forEach((url, index) => {
  const result = normalizeImageUrl(url);
  console.log(`Test ${index + 1}:`);
  console.log(`  Input:  "${url}"`);
  console.log(`  Output: "${result}"`);
  console.log('');
});

console.log('Expected: All URLs should become https://api.pncpriyamnutritioncare.com/uploads/filename.jpg');
