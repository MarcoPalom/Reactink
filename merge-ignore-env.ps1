# Script para hacer merge ignorando el .env entrante
# Uso: .\merge-ignore-env.ps1 [branch-name]

param(
    [string]$BranchName = ""
)

# Verificar si hay un .env local y hacer backup
if (Test-Path .env) {
    Write-Host "Backing up local .env file..."
    Move-Item .env .env.local.backup -Force
    $envBackedUp = $true
} else {
    $envBackedUp = $false
}

try {
    # Intentar el merge
    if ($BranchName -ne "") {
        Write-Host "Merging branch: $BranchName"
        git merge $BranchName
    } else {
        Write-Host "Continuing merge..."
        git merge --continue
    }
    
    Write-Host "Merge completed successfully!"
} catch {
    Write-Host "Error during merge: $_"
} finally {
    # Restaurar el .env local si se hizo backup
    if ($envBackedUp -and (Test-Path .env.local.backup)) {
        Write-Host "Restoring local .env file..."
        Move-Item .env.local.backup .env -Force
    }
}

