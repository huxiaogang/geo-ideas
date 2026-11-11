# Run every browser self-check with headless Chrome.
# Usage: pwsh -File tests/_runner.ps1
#        powershell -ExecutionPolicy Bypass -File tests/_runner.ps1
#
# Chrome is a GUI-subsystem executable on Windows, so its stdout cannot be
# captured reliably with `& chrome ...` when another Chrome instance is open.
# Start-Process + a fresh temporary profile + file redirection is reliable.

$ErrorActionPreference = 'Continue'

$chrome = $env:CHROME_PATH
if (-not $chrome -or -not (Test-Path -LiteralPath $chrome)) {
  $candidates = @(
    'C:\Program Files\Google\Chrome\Application\chrome.exe',
    'C:\Program Files (x86)\Google\Chrome\Application\chrome.exe',
    (Join-Path $env:LOCALAPPDATA 'Google\Chrome\Application\chrome.exe')
  )
  $chrome = $candidates | Where-Object { Test-Path -LiteralPath $_ } | Select-Object -First 1
}
if (-not $chrome) {
  Write-Output 'Chrome not found. Set CHROME_PATH to chrome.exe.'
  exit 2
}

$root = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$tmpRoot = Join-Path $env:TEMP ('geo_tests_' + [guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Path $tmpRoot -Force | Out-Null

$tests = @(
  @{ n = 'figcheck';     f = 'tests/figcheck.html' },
  @{ n = 'mdcheck';      f = 'tests/mdcheck.html' },
  @{ n = 'storecheck';   f = 'tests/storecheck.html' },
  @{ n = 'contentcheck'; f = 'tests/contentcheck.html' },
  @{ n = 'compasstest';  f = 'tests/compasstest.html' },
  @{ n = 'formulacheck'; f = 'tests/formulacheck.html' },
  @{ n = 'closedloop';   f = 'tests/closedloop.html' },
  @{ n = 'smoke';        f = 'tests/smoke.html' },
  @{ n = 'indexcheck';   f = 'tests/indexcheck.html' },
  @{ n = 'fileproto';    f = 'tests/fileproto.html' },
  @{ n = 'offline';      f = 'tests/offline.html' }
)

$bad = 0
try {
  foreach ($t in $tests) {
    $file = Join-Path $root $t.f
    $uri = ([uri]$file).AbsoluteUri
    $profile = Join-Path $tmpRoot ('profile_' + $t.n)
    $out = Join-Path $tmpRoot ($t.n + '.html')
    $err = Join-Path $tmpRoot ($t.n + '.err')

    $chromeArgs = @(
      '--headless=new',
      '--disable-gpu',
      '--no-sandbox',
      '--no-first-run',
      '--no-default-browser-check',
      ('--user-data-dir="' + $profile + '"'),
      '--allow-file-access-from-files',
      '--dump-dom',
      '--virtual-time-budget=15000',
      ('"' + $uri + '"')
    )

    Start-Process -FilePath $chrome -ArgumentList $chromeArgs -NoNewWindow -Wait -PassThru `
      -RedirectStandardOutput $out -RedirectStandardError $err | Out-Null

    $joined = ''
    if (Test-Path -LiteralPath $out) {
      $joined = Get-Content -LiteralPath $out -Raw -Encoding UTF8
    }

    $title = [regex]::Match($joined, '<title>([^<]*)</title>').Groups[1].Value
    $ok = $title -match '(FIGCHECK|MD|STORE|CONTENT|COMPASS|FORMULA|LOOP|SMOKE|INDEX|FILE|OFFLINE)_0(_0)?$'

    # contentcheck's title is overwritten by App.boot()'s route(); read its
    # FAIL=/WARN= summary instead. Same fallback for other summary-style pages.
    if (-not $ok) {
      $fm = [regex]::Match($joined, 'FAIL=(\d+)\s+WARN=(\d+)')
      if ($fm.Success -and $fm.Groups[1].Value -eq '0') {
        $ok = $true
        $title = "CONTENT_0 (FAIL=$($fm.Groups[1].Value) WARN=$($fm.Groups[2].Value))"
      } else {
        $fm2 = [regex]::Match($joined, '(PAGES|ERRORS|FAIL)=(\d+)')
        if ($fm2.Success -and $fm2.Groups[2].Value -eq '0') {
          $ok = $true
          $title = $fm2.Groups[0].Value
        }
      }
    }

    if (-not $ok) {
      $fails = @()
      if ($joined) {
        $fails = @($joined -split "`r?`n" |
          Where-Object { $_ -match '^(FAIL |ERROR|ERRORS=)' } |
          Select-Object -First 8)
      }
      Write-Output ("FAIL {0,-13} title={1}" -f $t.n, $title)
      $fails | ForEach-Object { Write-Output ('      ' + $_) }
      $bad++
    } else {
      Write-Output ("OK   {0,-13} {1}" -f $t.n, $title)
    }
  }
} finally {
  Remove-Item -LiteralPath $tmpRoot -Recurse -Force -ErrorAction SilentlyContinue
}

Write-Output '---'
Write-Output ('SUITES_FAILED=' + $bad)
if ($bad -gt 0) { exit 1 }
