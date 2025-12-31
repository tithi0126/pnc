// Cleanup script to remove temporary debugging and promotion code
// Run this after admin setup is complete

const fs = require('fs');
const path = require('path');

console.log('🧹 Cleaning up temporary debugging and promotion code...\n');

// Files to clean up
const cleanupTasks = [
  {
    file: 'backend/middleware/auth.js',
    description: 'Remove debug logging from auth middleware',
    cleanup: (content) => {
      return content
        .replace(/console\.log\('Auth middleware: [^']+'\);?\n/g, '')
        .replace(/console\.log\('Role middleware: [^']+'\);?\n/g, '')
        .replace(/console\.log\('Role middleware: Checking roles for user:', [^}]+}\);?\n/g, '')
        .replace(/console\.log\('Role middleware: User roles:', [^}]+}\);?\n/g, '')
        .replace(/console\.log\('Role middleware: Required roles:', [^}]+}\);?\n/g, '')
        .replace(/console\.log\('Role middleware: Has required role:', [^}]+}\);?\n/g, '')
        .replace(/console\.log\('Role middleware: Insufficient permissions[^}]+}\);?\n/g, '')
        .replace(/console\.log\('Role middleware: Access granted[^}]+}\);?\n/g, '');
    }
  },
  {
    file: 'backend/routes/auth.js',
    description: 'Remove debug logging from auth routes',
    cleanup: (content) => {
      return content
        .replace(/console\.log\('Login attempt for email:', [^}]+}\);?\n/g, '')
        .replace(/console\.log\('User found:', [^}]+}\);?\n/g, '')
        .replace(/console\.log\('Login failed: [^']+'\);?\n/g, '')
        .replace(/console\.log\('Generating JWT token[^}]+}\);?\n/g, '')
        .replace(/console\.log\('Login successful for user:', [^}]+}\);?\n/g, '')
        .replace(/console\.log\('Profile request for user:', [^}]+}\);?\n/g, '')
        .replace(/console\.log\('User roles:', [^}]+}\);?\n/g, '')
        .replace(/console\.log\('Has admin role:', [^}]+}\);?\n/g, '');
    }
  },
  {
    file: 'backend/routes/users.js',
    description: 'Remove temporary promote/demote endpoints',
    cleanup: (content) => {
      return content
        .replace(/\/\/ TEMPORARY: Promote user to admin \(remove after use\)\nrouter\.put\('\/:id\/promote', auth, async \([^}]+}\n[\s\S]*?\n}\);\n\n/g, '')
        .replace(/\/\/ TEMPORARY: Demote user from admin \(remove after use\)\nrouter\.put\('\/:id\/demote', auth, async \([^}]+}\n[\s\S]*?\n}\);\n\n/g, '');
    }
  },
  {
    file: 'src/services/authService.ts',
    description: 'Remove temporary promote/demote methods',
    cleanup: (content) => {
      return content
        .replace(/static async promoteToAdmin\([^}]+}\n[\s\S]*?\n}\n\n/g, '')
        .replace(/static async demoteFromAdmin\([^}]+}\n[\s\S]*?\n}\n\n/g, '');
    }
  },
  {
    file: 'src/contexts/AuthContext.tsx',
    description: 'Remove debug logging from auth context',
    cleanup: (content) => {
      return content
        .replace(/console\.log\('AuthContext: [^']+'\);?\n/g, '')
        .replace(/console\.log\('AuthContext: User data:', [^}]+}\);?\n/g, '')
        .replace(/console\.log\('AuthContext: User roles:', [^}]+}\);?\n/g, '')
        .replace(/console\.log\('AuthContext: Is admin:', [^}]+}\);?\n/g, '');
    }
  },
  {
    file: 'src/pages/AdminDashboard.tsx',
    description: 'Remove temporary auto-promotion code',
    cleanup: (content) => {
      return content
        .replace(/import \{ AuthService \} from "[^"]+";\n/g, '')
        .replace(/\/\/ TEMPORARY: Auto-promote user to admin if not already admin[\s\S]*?window\.location\.reload\(\);\n\s*}\n\s*} catch \(error\) \{\n\s*console\.error\('TEMP: Failed to promote user:', error\);\n\s*}\n\s*}\n\n/g, '')
        .replace(/console\.log\("TEMP: User lacks admin privileges, auto-promoting\.\.\."\);\n\s*promoteToAdmin\(\);\n/g, '');
    }
  }
];

// Execute cleanup
cleanupTasks.forEach(task => {
  try {
    const filePath = path.join(__dirname, task.file);
    if (fs.existsSync(filePath)) {
      console.log(`📝 Processing: ${task.file}`);
      console.log(`   ${task.description}`);

      let content = fs.readFileSync(filePath, 'utf8');
      const originalLength = content.length;

      content = task.cleanup(content);

      if (content.length !== originalLength) {
        fs.writeFileSync(filePath, content);
        console.log(`   ✅ Cleaned up ${task.file}`);
      } else {
        console.log(`   ℹ️  No changes needed in ${task.file}`);
      }
    } else {
      console.log(`⚠️  File not found: ${task.file}`);
    }
  } catch (error) {
    console.log(`❌ Error processing ${task.file}:`, error.message);
  }
  console.log('');
});

// Remove temporary files
const tempFiles = [
  'check-admin.js',
  'test-auth.js',
  'cleanup-temp-code.js'
];

console.log('🗑️  Removing temporary files...');
tempFiles.forEach(file => {
  try {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`   ✅ Removed ${file}`);
    }
  } catch (error) {
    console.log(`   ❌ Error removing ${file}:`, error.message);
  }
});

console.log('\n🎉 Cleanup complete!');
console.log('🔒 Remember to:');
console.log('   1. Remove JWT_SECRET from any logs');
console.log('   2. Ensure admin user credentials are secure');
console.log('   3. Test all admin functionality');
console.log('   4. Remove this cleanup script itself');
