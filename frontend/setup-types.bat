@echo off
echo Installing TypeScript type declarations for React and Next.js...
cd %~dp0
npm install --save-dev @types/react @types/react-dom @types/node
echo Updating Next.js version to ensure compatibility...
npm install next@13.4.1
echo Type declarations installed successfully!
pause
