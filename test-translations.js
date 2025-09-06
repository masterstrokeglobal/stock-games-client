const fs = require('fs');
const path = require('path');

console.log('🔍 Testing translation loading...\n');

// Simulate the exact import path used in i18n/request.ts
const messagesPath = path.join(__dirname, 'messages/en.json');
console.log('📁 Messages path:', messagesPath);
console.log('📁 Path exists:', fs.existsSync(messagesPath));

try {
  // Try to read and parse the file exactly like the i18n system does
  const fileContent = fs.readFileSync(messagesPath, 'utf8');
  console.log('📄 File size:', fileContent.length, 'characters');
  
  const messages = JSON.parse(fileContent);
  console.log('✅ JSON parsed successfully');
  
  // Test the specific keys that are failing
  const testKeys = [
    'platform.footer',
    'platform.navbar', 
    'platform.sidebar',
    'platform.casino-games',
    'platform.stock-game-carousel',
    'platform.cta-section',
    'platform.stock-games',
    'wallet',
    'forgotPassword'
  ];
  
  console.log('\n🔑 Testing required keys:');
  testKeys.forEach(key => {
    const keyParts = key.split('.');
    let current = messages;
    let exists = true;
    
    for (const part of keyParts) {
      if (current && typeof current === 'object' && part in current) {
        current = current[part];
      } else {
        exists = false;
        break;
      }
    }
    
    if (exists) {
      console.log(`✅ ${key} - EXISTS (${typeof current})`);
    } else {
      console.log(`❌ ${key} - MISSING`);
    }
  });
  
  // Show the actual structure
  console.log('\n📋 Actual structure:');
  console.log('platform keys:', Object.keys(messages.platform || {}));
  console.log('wallet keys:', Object.keys(messages.wallet || {}));
  console.log('forgotPassword keys:', Object.keys(messages.forgotPassword || {}));
  
} catch (error) {
  console.error('❌ Error:', error.message);
}
