$headers = @{
    "apikey" = "sb_publishable_kO6tEcLI7Tbhnm5gPHVU-Q_sIno20Ly"
    "Authorization" = "Bearer sb_publishable_kO6tEcLI7Tbhnm5gPHVU-Q_sIno20Ly"
    "Content-Type" = "application/json"
    "Prefer" = "return=minimal"
}

$results = Get-Content "src/data/crossref_results_batch2.json" -Raw | ConvertFrom-Json

$count = 0
foreach ($item in $results) {
    if ($item.status -eq "success" -and $item.pdf_url) {
        $uri = "https://zpzwefrxckbojbotjxof.supabase.co/rest/v1/visdrone_papers?id=eq.$($item.id)"
        $body = @{ pdf_url = $item.pdf_url } | ConvertTo-Json

        try {
            $response = Invoke-RestMethod -Uri $uri -Method PATCH -Headers $headers -Body $body
            $count++
            Write-Host "[$count] Updated $($item.id): $($item.title.Substring(0, [Math]::Min(50, $item.title.Length)))..."
        } catch {
            Write-Host "[ERROR] Failed to update $($item.id): $_"
        }

        Start-Sleep -Milliseconds 100
    }
}

Write-Host "`nTotal updated: $count"
