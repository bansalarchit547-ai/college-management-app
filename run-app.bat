@echo off
title CampusPulse College Management ERP
echo ====================================================
echo Starting CampusPulse College Management Application
echo ====================================================
echo.

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed on this PC!
    echo Please download and install Node.js: https://nodejs.org
    pause
    exit /b 1
)

cd /d "%~dp0"
start http://localhost:3000
node server.cjs
pause
