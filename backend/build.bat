@echo off
REM Build script for local testing on Windows (Render uses build.sh)

echo 🚀 Starting build process...

echo 📦 Installing Python dependencies...
pip install -r requirements.txt

echo 📁 Collecting static files...
python manage.py collectstatic --noinput

echo 🗄️ Running database migrations...
python manage.py migrate

echo 👤 Creating default superuser...
python manage.py create_default_superuser

echo ✅ Build completed successfully!
echo 🌐 Your app is ready for Render deployment!
