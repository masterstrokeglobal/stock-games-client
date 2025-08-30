#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read the English translation file
const enPath = path.join(__dirname, '../messages/en.json');
const enTranslations = JSON.parse(fs.readFileSync(enPath, 'utf8'));

// Define the required translation keys based on the error messages
const requiredKeys = [
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

console.log('🔍 Validating translation keys...\n');

// Check each required key
requiredKeys.forEach(key => {
    const keyParts = key.split('.');
    let current = enTranslations;
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
        console.log(`✅ ${key} - EXISTS`);
    } else {
        console.log(`❌ ${key} - MISSING`);
    }
});

console.log('\n📋 Translation file structure:');
console.log(JSON.stringify(enTranslations, null, 2).substring(0, 1000) + '...');

console.log('\n🔧 To fix missing keys, add them to the appropriate section in messages/en.json');
console.log('Example:');
console.log('  "platform": {');
console.log('    "footer": {');
console.log('      "key": "value"');
console.log('    }');
console.log('  }');
