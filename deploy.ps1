# Deploy Angelina Sidorenko site to GitHub Pages (free)

$ErrorActionPreference = "Stop"
$env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path", "User")

Set-Location $PSScriptRoot

Write-Host ""
Write-Host "=== Deploy to GitHub Pages ===" -ForegroundColor Cyan

cmd /c "gh auth status >nul 2>&1"
if ($LASTEXITCODE -ne 0) {
    Write-Host "GitHub login required. Browser will open - confirm access." -ForegroundColor Yellow
    gh auth login --hostname github.com --git-protocol https --web
}

$owner = gh api user -q .login
$repoName = "angelina-sidorenko"

Write-Host "Logged in as: $owner" -ForegroundColor Green

cmd /c "gh repo view $owner/$repoName >nul 2>&1"
if ($LASTEXITCODE -ne 0) {
    Write-Host "Creating public repo $owner/$repoName ..." -ForegroundColor Cyan
    gh repo create $repoName --public --source=. --remote=origin --push --description "Official site - Angelina Sidorenko, opera soprano"
    gh api -X POST "repos/$owner/$repoName/pages" -f "source[branch]=main" -f "source[path]=/" | Out-Null
} else {
    Write-Host "Pushing updates ..." -ForegroundColor Cyan
    git push origin main
}

$pagesJson = gh api "repos/$owner/$repoName/pages" 2>$null
$url = "https://$($owner.ToLower()).github.io/$repoName/"
if ($pagesJson) {
    $pages = $pagesJson | ConvertFrom-Json
    if ($pages.html_url) { $url = $pages.html_url }
}

Write-Host ""
Write-Host "Live site:" -ForegroundColor Green
Write-Host $url
Write-Host ""
Write-Host "Repo: https://github.com/$owner/$repoName" -ForegroundColor DarkGray
