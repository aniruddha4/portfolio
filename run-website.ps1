# Starts a local web server for this portfolio and opens it in Chrome.
# No Python or Node.js needed. Press Ctrl+C in the terminal to stop.
param([int]$Port = 5500)

$root = [System.IO.Path]::GetFullPath($PSScriptRoot)
$mime = @{
  '.html'='text/html; charset=utf-8'; '.css'='text/css; charset=utf-8'
  '.js'='application/javascript; charset=utf-8'; '.json'='application/json'
  '.jpg'='image/jpeg'; '.jpeg'='image/jpeg'; '.png'='image/png'
  '.svg'='image/svg+xml'; '.ico'='image/x-icon'; '.pdf'='application/pdf'
}

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
try { $listener.Start() }
catch { Write-Host "Could not start on port $Port. Try: .\run-website.ps1 -Port 5600" -ForegroundColor Red; exit 1 }

$url = "http://localhost:$Port/"
Write-Host "Portfolio running at $url  (Ctrl+C to stop)" -ForegroundColor Green
try { Start-Process chrome $url } catch { Start-Process $url }

try {
  while ($listener.IsListening) {
    $ctx = $listener.GetContext()
    $path = [Uri]::UnescapeDataString($ctx.Request.Url.AbsolutePath)
    if ($path -eq '/') { $path = '/index.html' }
    $file = [System.IO.Path]::GetFullPath((Join-Path $root ($path.TrimStart('/') -replace '/', '\')))
    if ($file.StartsWith($root) -and (Test-Path $file -PathType Leaf)) {
      $ext = [System.IO.Path]::GetExtension($file).ToLower()
      $ctx.Response.ContentType = $(if ($mime.ContainsKey($ext)) { $mime[$ext] } else { 'application/octet-stream' })
      $bytes = [System.IO.File]::ReadAllBytes($file)
      $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
      $ctx.Response.StatusCode = 404
    }
    $ctx.Response.Close()
  }
} finally { $listener.Stop() }
