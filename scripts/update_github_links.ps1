$headers = @{
    "apikey" = "sb_publishable_kO6tEcLI7Tbhnm5gPHVU-Q_sIno20Ly"
    "Authorization" = "Bearer sb_publishable_kO6tEcLI7Tbhnm5gPHVU-Q_sIno20Ly"
    "Content-Type" = "application/json"
    "Prefer" = "return=minimal"
}

$updates = Get-Content "src/data/github_updates.json" -Raw | ConvertFrom-Json

$count = 0
foreach ($item in $updates) {
    $uri = "https://zpzwefrxckbojbotjxof.supabase.co/rest/v1/visdrone_papers?id=eq.$($item.paper_id)"
    $body = @{ github = $item.github } | ConvertTo-Json

    try {
        $response = Invoke-RestMethod -Uri $uri -Method PATCH -Headers $headers -Body $body
        $count++
        Write-Host "[$count] Updated $($item.paper_id): $($item.github)"
    } catch {
        Write-Host "[ERROR] Failed: $($item.paper_id) - $_"
    }

    Start-Sleep -Milliseconds 100
}

Write-Host "`nTotal updated: $count"
