@echo off
REM Build script for Windows

echo 🚀 Starting build process...

REM Install dependencies
echo 📦 Installing dependencies...
call npm ci

REM Build the application
echo 🔨 Building application...
call npm run build

REM Verify build output
echo ✅ Verifying build output...
if exist "dist\index.html" (
    echo ✅ index.html found
) else (
    echo ❌ index.html not found
    exit /b 1
)

REM Copy additional files for SPA routing
echo 📋 Copying additional files...
if exist "public\_redirects" copy "public\_redirects" "dist\_redirects" >nul 2>&1
if exist "public\.htaccess" copy "public\.htaccess" "dist\.htaccess" >nul 2>&1

echo ✅ Build complete!
echo 📁 Build output directory: dist\
dir dist\
