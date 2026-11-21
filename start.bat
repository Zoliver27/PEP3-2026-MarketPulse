@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo ERROR: Node.js no esta instalado.
  pause
  exit /b 1
)
if not exist node_modules (
  echo Primero ejecuta install.bat o npm install.
  pause
  exit /b 1
)
npm run dev
