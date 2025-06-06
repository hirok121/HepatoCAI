#!/usr/bin/env bash
# Build script for Render deployment

set -o errexit  # exit on error

echo "🚀 Starting Render deployment build..."

# Install dependencies
echo "📦 Installing Python dependencies..."
pip install -r requirements.txt

# Collect static files
echo "📁 Collecting static files..."
python manage.py collectstatic --noinput

# Run database migrations
echo "🗄️ Running database migrations..."
python manage.py migrate

# Create default superuser if it doesn't exist
echo "👤 Creating default superuser..."
python manage.py create_default_superuser

echo "✅ Build completed successfully!"
