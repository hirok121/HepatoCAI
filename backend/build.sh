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

# Make migrations for all apps
echo "🗄️ Creating migrations for all apps..."
python manage.py makemigrations users
python manage.py makemigrations diagnosis
python manage.py makemigrations aiassistant
python manage.py makemigrations

# Run database migrations
echo "🗄️ Running database migrations..."
python manage.py migrate

# Create default superuser if it doesn't exist
echo "👤 Creating default superuser..."
python manage.py create_default_superuser

echo "✅ Build completed successfully!"
