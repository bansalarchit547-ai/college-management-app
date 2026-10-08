@echo off
title CampusPulse College Management ERP
echo ====================================================
echo Starting CampusPulse College Management ERP
echo ====================================================
echo.

:: Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed on this PC!
    echo Please download and install Node.js (free):
    echo https://nodejs.org
    echo.
    echo After installing Node.js, run this file again.
    pause
    exit /b 1
)

cd /d "%~dp0"
echo Starting local institutional server...
start http://localhost:3000
node server.cjs
pause
