# Uploads (or updates) this whole folder in your GitHub repository.
# Run it the first time to publish, and again any time you add or change files.
param(
  [string]$Repo    = "https://github.com/aniruddha4/portfolio.git",
  [string]$Branch  = "main",
  [string]$Message = ""
)
Set-Location $PSScriptRoot

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
  Write-Host "Git is not installed. Download it from https://git-scm.com/download/win, install it, restart VS Code and run this again." -ForegroundColor Red
  exit 1
}

if (-not (Test-Path ".git")) { git init | Out-Null }
git branch -M $Branch

$hasOrigin = git remote | Select-String -SimpleMatch "origin"
if ($hasOrigin) { git remote set-url origin $Repo } else { git remote add origin $Repo }

# Set your name/email once if Git does not know them yet
if (-not (git config user.name))  { git config user.name  "Aniruddha Mukhopadhyay" }
if (-not (git config user.email)) { $e = Read-Host "Enter the email linked to your GitHub account"; git config user.email $e }

if ($Message -eq "") { $Message = "Update portfolio " + (Get-Date -Format "yyyy-MM-dd HH:mm") }

git add -A
git diff --cached --quiet
if ($LASTEXITCODE -ne 0) { git commit -m $Message } else { Write-Host "No new changes to commit." }

# Bring in anything already in the repo (for example a README created on GitHub)
git pull origin $Branch --allow-unrelated-histories --no-rebase --no-edit 2>$null

git push -u origin $Branch
if ($LASTEXITCODE -eq 0) {
  Write-Host "`nDone. Files are on GitHub: https://github.com/aniruddha4/portfolio" -ForegroundColor Green
  Write-Host "To get a live website: repo Settings > Pages > Deploy from branch > $Branch > / (root) > Save." -ForegroundColor Green
} else {
  Write-Host "`nPush failed. Sign in to GitHub in the window that opens, or check the repo name and your permissions." -ForegroundColor Red
}
