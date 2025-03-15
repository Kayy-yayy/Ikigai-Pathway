# PowerShell script to download and install Node.js
$nodeVersion = "18.18.0"
$nodeUrl = "https://nodejs.org/dist/v$nodeVersion/node-v$nodeVersion-x64.msi"
$nodeInstaller = "$env:TEMP\node-installer.msi"

Write-Host "Downloading Node.js v$nodeVersion..."
Invoke-WebRequest -Uri $nodeUrl -OutFile $nodeInstaller

Write-Host "Installing Node.js v$nodeVersion..."
Start-Process -FilePath "msiexec.exe" -ArgumentList "/i", $nodeInstaller, "/quiet", "/norestart" -Wait

Write-Host "Node.js installation completed. Please restart your terminal to use Node.js."
