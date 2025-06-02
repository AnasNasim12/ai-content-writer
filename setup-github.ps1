# AI Content Writer - GitHub Setup Complete!

Write-Host "Setting up AI Content Writer for GitHub..." -ForegroundColor Cyan

# Check if we're in the right directory
if (!(Test-Path "package.json")) {
    Write-Host "ERROR: Please run this script from the AI ContentWriter root directory" -ForegroundColor Red
    exit 1
}

Write-Host "Found package.json - we're in the right directory" -ForegroundColor Green

# Initialize git if not already done
if (!(Test-Path ".git")) {
    Write-Host "Initializing Git repository..." -ForegroundColor Yellow
    git init
    Write-Host "Git repository initialized" -ForegroundColor Green
} else {
    Write-Host "Git repository already exists" -ForegroundColor Green
}

# Add remote origin if not exists
$remoteUrl = git remote get-url origin 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Adding GitHub remote..." -ForegroundColor Yellow
    git remote add origin https://github.com/AnasNasim12/ai-content-writer.git
    Write-Host "GitHub remote added" -ForegroundColor Green
} else {
    Write-Host "GitHub remote already configured: $remoteUrl" -ForegroundColor Green
}

# Stage all files
Write-Host "Staging all files..." -ForegroundColor Yellow
git add .

# Commit if there are changes
$status = git status --porcelain
if ($status) {
    Write-Host "Committing changes..." -ForegroundColor Yellow
    git commit -m "feat: Complete GitHub-ready setup with documentation and CI/CD

- Add comprehensive README with badges and setup instructions
- Create CONTRIBUTING.md with development guidelines  
- Add SECURITY.md with vulnerability reporting process
- Include DEPLOYMENT.md with multi-platform deployment guide
- Set up CHANGELOG.md for version tracking
- Configure GitHub Actions CI/CD pipeline
- Add environment configuration templates
- Update package.json with repository metadata
- Create GitHub issue templates for bugs and features

Ready for production deployment and open-source collaboration!"
    Write-Host "Changes committed" -ForegroundColor Green
} else {
    Write-Host "No changes to commit" -ForegroundColor Green
}

Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "1. Push to GitHub: git push -u origin main" -ForegroundColor White
Write-Host "2. Set up environment variables (see .env.example files)" -ForegroundColor White
Write-Host "3. Configure Firebase project" -ForegroundColor White
Write-Host "4. Enable GitHub Actions in repository settings" -ForegroundColor White
Write-Host "5. Set up deployment platforms (Netlify, Railway, etc.)" -ForegroundColor White
Write-Host ""
Write-Host "Documentation Available:" -ForegroundColor Cyan
Write-Host "- README.md - Project overview and setup" -ForegroundColor White
Write-Host "- API_DOCUMENTATION.md - Complete API reference" -ForegroundColor White
Write-Host "- CONTRIBUTING.md - Contribution guidelines" -ForegroundColor White
Write-Host "- DEPLOYMENT.md - Production deployment guide" -ForegroundColor White
Write-Host "- SECURITY.md - Security policy and best practices" -ForegroundColor White
Write-Host ""
Write-Host "Repository ready for GitHub! Happy coding!" -ForegroundColor Green
