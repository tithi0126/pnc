// Test normalizeImageUrl function
const normalizeImageUrl = (imageUrl) => {
  if (!imageUrl) return null;

  // Get API base URL
  const apiBase = 'https://api.pncpriyamnutritioncare.com'; // production

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

// Test cases
console.log('Testing normalizeImageUrl function:');
console.log('');

const testCases = [
  '/uploads/test-image.jpg',
  'uploads/test-image.jpg',
  'https://api.pncpriyamnutritioncare.com/uploads/test-image.jpg',
  'https://old-domain.com/uploads/test-image.jpg',
  null,
  '',
  'https://unsplash.com/image.jpg'
];

testCases.forEach((testCase, index) => {
  const result = normalizeImageUrl(testCase);
  console.log(`Test ${index + 1}: "${testCase}" => "${result}"`);
});

console.log('');
console.log('Expected results for production:');
console.log('/uploads/test-image.jpg => https://api.pncpriyamnutritioncare.com/uploads/test-image.jpg');
console.log('uploads/test-image.jpg => https://api.pncpriyamnutritioncare.com/uploads/test-image.jpg');
