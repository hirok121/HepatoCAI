#!/bin/bash

# Build script for Render deployment
echo "🚀 Starting build process..."

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Build the application
echo "🔨 Building application..."
npm run build

# Verify build output
echo "✅ Verifying build output..."
if [ -f "dist/index.html" ]; then
    echo "✅ index.html found"
else
    echo "❌ index.html not found"
    exit 1
fi

# Copy additional files for SPA routing
echo "📋 Copying additional files..."
cp public/_redirects dist/_redirects 2>/dev/null || echo "⚠️ _redirects not found"
cp public/.htaccess dist/.htaccess 2>/dev/null || echo "⚠️ .htaccess not found"

echo "✅ Build complete!"
echo "📁 Build output directory: dist/"
ls -la dist/
