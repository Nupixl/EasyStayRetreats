#!/bin/bash

# Post-Webflow sync fix script
# This script fixes known issues after running npx webflow devlink sync

echo "🔧 Fixing components after Webflow sync..."

# Fix StatWrapper duplicate slot parameters
if [ -f "devlink/StatWrapper.js" ]; then
    echo "Fixing StatWrapper duplicate slot parameters..."
    sed -i '' 's/slot, slot, slot/slot/g' devlink/StatWrapper.js
    echo "✅ Fixed StatWrapper"
fi

# Clear all caches
echo "Clearing caches..."
rm -rf .next
rm -rf node_modules/.cache
rm -rf node_modules/.next

echo "✅ All fixes applied and caches cleared!"
echo "You can now run: npm run dev"
