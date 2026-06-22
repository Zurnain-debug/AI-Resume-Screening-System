@echo off
REM One-click startup wrapper for Windows
SET SCRIPT=%~dp0start-dev.ps1
powershell -NoProfile -ExecutionPolicy Bypass -File "%SCRIPT%"
