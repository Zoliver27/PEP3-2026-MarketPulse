@echo off
setlocal
cd /d "%~dp0"
echo.
echo  MARKET PULSE - Instalador de dependencias
where node >nul 2>nul
if errorlevel 1 (
  echo ERROR: Node.js no esta instalado. Descargalo desde https://nodejs.org/
  pause
  exit /b 1
)
if not exist .env copy .env.example .env >nul
npm install
if errorlevel 1 (
  echo.
  echo ERROR: No se pudieron instalar las dependencias.
  pause
  exit /b 1
)
echo.
echo Instalacion finalizada. Ejecuta start.bat para iniciar el proyecto.
pause
