# 一键跑全部浏览器端自检（Chrome 无头）
# 用法: pwsh -File tests/_runner.ps1
$ErrorActionPreference = 'Continue'
$chrome = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$tests = @(
  @{ n='figcheck';     f='tests/figcheck.html' },
  @{ n='mdcheck';      f='tests/mdcheck.html' },
  @{ n='storecheck';   f='tests/storecheck.html' },
  @{ n='contentcheck'; f='tests/contentcheck.html' },
  @{ n='compasstest';  f='tests/compasstest.html' },
  @{ n='formulacheck'; f='tests/formulacheck.html' },
  @{ n='closedloop';   f='tests/closedloop.html' },
  @{ n='smoke';        f='tests/smoke.html' },
  @{ n='indexcheck';   f='tests/indexcheck.html' },
  @{ n='fileproto';    f='tests/fileproto.html' },
  @{ n='offline';      f='tests/offline.html' }
)
$bad = 0
foreach ($t in $tests) {
  $uri = 'file:///' + (Join-Path $root $t.f).Replace('\','/')
  $tmp = Join-Path $env:TEMP ("dshgeo_" + $t.n + ".html")
  $dom = & $chrome --headless=new --disable-gpu --no-sandbox --allow-file-access-from-files --dump-dom --virtual-time-budget=15000 "$uri" 2>$null
  $dom | Out-File -FilePath $tmp -Encoding utf8
  $joined = $dom -join "`n"
  $title = [regex]::Match($joined, '<title>([^<]*)</title>').Groups[1].Value
  $ok = $title -match '(FIGCHECK|MD|STORE|CONTENT|COMPASS|FORMULA|LOOP|SMOKE|INDEX|FILE|OFFLINE)_0(_0)?$'
  # 有些测试页（contentcheck）的 title 会被 App.boot() 的 route() 覆盖，
  # 此时回退读取 <pre> 里的 FAIL= 汇总行
  if (-not $ok) {
    $fm = [regex]::Match($joined, 'FAIL=(\d+)\s+WARN=(\d+)')
    if ($fm.Success -and $fm.Groups[1].Value -eq '0') { $ok = $true; $title = "CONTENT_0 (FAIL=$($fm.Groups[1].Value) WARN=$($fm.Groups[2].Value))" }
    else { $fm2 = [regex]::Match($joined, '(PAGES|ERRORS|FAIL)=(\d+)'); if ($fm2.Success -and $fm2.Groups[2].Value -eq '0') { $ok = $true; $title = $fm2.Groups[0].Value } }
  }
  if (-not $ok) {
    # 抽取 FAIL 行帮助定位
    $fails = ($dom | Select-String -Pattern '^FAIL |^ERROR|^ERRORS=') | ForEach-Object { $_.Line }
    Write-Output ("FAIL {0,-13} title={1}" -f $t.n, $title)
    $fails | Select-Object -First 8 | ForEach-Object { Write-Output ("      " + $_) }
    $bad++
  } else {
    Write-Output ("OK   {0,-13} {1}" -f $t.n, $title)
  }
}
Write-Output "---"
Write-Output ("SUITES_FAILED=" + $bad)
