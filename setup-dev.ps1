# AI Content Writer - Development Setup Script

Write-Host "🚀 Setting up AI Content Writer development environment..." -ForegroundColor Cyan

# Check if we're in the right directory
if (!(Test-Path "package.json")) {
    Write-Host "❌ Please run this script from the AI ContentWriter root directory" -ForegroundColor Red
    exit 1
}

# Install root dependencies
Write-Host "📦 Installing root dependencies..." -ForegroundColor Yellow
npm install

# Install frontend dependencies
Write-Host "📦 Installing frontend dependencies..." -ForegroundColor Yellow
Set-Location frontend
npm install
Set-Location ..

# Install backend dependencies  
Write-Host "📦 Installing backend dependencies..." -ForegroundColor Yellow
Set-Location backend
npm install
Set-Location ..

# Set up Python virtual environment
Write-Host "🐍 Setting up Python environment..." -ForegroundColor Yellow
Set-Location backend/python_scripts

# Check if Python is available
try {
    $pythonVersion = python --version 2>&1
    Write-Host "✅ Found Python: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Python not found. Please install Python 3.8 or higher" -ForegroundColor Red
    Set-Location ../..
    exit 1
}

# Create virtual environment if it doesn't exist
if (!(Test-Path "venv")) {
    Write-Host "🔧 Creating Python virtual environment..." -ForegroundColor Yellow
    python -m venv venv
    Write-Host "✅ Virtual environment created" -ForegroundColor Green
} else {
    Write-Host "✅ Virtual environment already exists" -ForegroundColor Green
}

# Activate virtual environment and install dependencies
Write-Host "📦 Installing Python dependencies..." -ForegroundColor Yellow
& .\venv\Scripts\Activate.ps1
pip install --upgrade pip
pip install -r requirements.txt
deactivate

Set-Location ../..

# Check for environment files
Write-Host "🔍 Checking environment configuration..." -ForegroundColor Yellow

$envFiles = @(
    "frontend/.env",
    "backend/.env", 
    "backend/python_scripts/.env"
)

$missingEnvFiles = @()
foreach ($envFile in $envFiles) {
    if (!(Test-Path $envFile)) {
        $missingEnvFiles += $envFile
    }
}

if ($missingEnvFiles.Count -gt 0) {
    Write-Host "⚠️  Missing environment files:" -ForegroundColor Yellow
    foreach ($file in $missingEnvFiles) {
        Write-Host "   • $file (copy from $file.example)" -ForegroundColor White
    }
    Write-Host ""
    Write-Host "📋 Copy example files and configure with your values:" -ForegroundColor Cyan
    Write-Host "Copy-Item 'frontend/.env.example' 'frontend/.env'" -ForegroundColor White
    Write-Host "Copy-Item 'backend/.env.example' 'backend/.env'" -ForegroundColor White  
    Write-Host "Copy-Item 'backend/python_scripts/.env.example' 'backend/python_scripts/.env'" -ForegroundColor White
} else {
    Write-Host "✅ All environment files found" -ForegroundColor Green
}

Write-Host ""
Write-Host "🎯 Development Setup Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Configure environment variables in .env files" -ForegroundColor White
Write-Host "2. Set up Firebase project and add configuration" -ForegroundColor White
Write-Host "3. Get API keys for LLM services (OpenAI, Gemini)" -ForegroundColor White
Write-Host "4. Start development servers:" -ForegroundColor White
Write-Host "   • npm start (runs all services)" -ForegroundColor White
Write-Host "   • Or start individually:" -ForegroundColor White
Write-Host "     - Frontend: cd frontend && npm start" -ForegroundColor White
Write-Host "     - Backend: cd backend && npm start" -ForegroundColor White
Write-Host "     - Python: cd backend/python_scripts && .\venv\Scripts\Activate.ps1 && python llm_service.py" -ForegroundColor White
Write-Host ""
Write-Host "🌐 Access Points:" -ForegroundColor Cyan
Write-Host "• Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "• Backend API: http://localhost:3001" -ForegroundColor White
Write-Host "• Python Service: http://localhost:5000" -ForegroundColor White
Write-Host "• Documentation: http://localhost:3000/docs" -ForegroundColor White
Write-Host ""
Write-Host "🚀 Happy coding!" -ForegroundColor Green
