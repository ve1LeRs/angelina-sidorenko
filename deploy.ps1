# Deploy Angelina Sidorenko site to GitHub Pages (free)
# Requires: GitHub account + one-time login via browser

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

gh repo view "$owner/$repoName" 2>$null | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Creating public repo $owner/$repoName ..." -ForegroundColor Cyan
    gh repo create $repoName --public --source=. --remote=origin --push --description "Official site - Angelina Sidorenko, opera soprano"
} else {
    Write-Host "Pushing to existing repo ..." -ForegroundColor Cyan
    git push -u origin main
}

Write-Host "Enabling GitHub Pages ..." -ForegroundColor Cyan
gh api -X PUT "repos/$owner/$repoName/pages" -f "build_type=workflow" | Out-Null

Start-Sleep -Seconds 3
$pagesJson = gh api "repos/$owner/$repoName/pages" 2>$null
$url = "https://$owner.github.io/$repoName/"
if ($pagesJson) {
    $pages = $pagesJson | ConvertFrom-Json
    if ($pages.html_url) { $url = $pages.html_url }
}

Write-Host ""
Write-Host "Site URL (allow 1-2 minutes for first deploy):" -ForegroundColor Green
Write-Host $url
Write-Host ""
Write-Host "Actions: https://github.com/$owner/$repoName/actions" -ForegroundColor DarkGray
