# Public Access Test Script for Cloud Run Deployment (PowerShell)
# This script tests if the deployed service is publicly accessible without authentication

param(
    [Parameter(Mandatory=$true)]
    [string]$ProjectId
)

Write-Host "🌐 Testing Public Access to Cloud Run Service" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Green

# Configuration
$ServiceName = "manhattan-distance-api"
$Region = "us-central1"

Write-Host "Project ID: $ProjectId" -ForegroundColor White
Write-Host "Service: $ServiceName" -ForegroundColor White
Write-Host "Region: $Region" -ForegroundColor White
Write-Host ""

# Get service URL
Write-Host "🔍 Getting service URL..." -ForegroundColor Yellow
try {
    $ServiceUrl = (gcloud run services describe $ServiceName --region $Region --project $ProjectId --format 'value(status.url)' 2>$null)
    if (-not $ServiceUrl) {
        throw "Service not found"
    }
    Write-Host "✅ Service URL: $ServiceUrl" -ForegroundColor Green
} catch {
    Write-Host "❌ Service not found or not accessible" -ForegroundColor Red
    Write-Host "Make sure the service is deployed and you have the correct project ID" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Test health endpoint
Write-Host "🏥 Testing health endpoint..." -ForegroundColor Yellow
try {
    $HealthResponse = Invoke-WebRequest -Uri "$ServiceUrl/health" -Method GET -UseBasicParsing
    if ($HealthResponse.StatusCode -eq 200) {
        Write-Host "✅ Health check passed (HTTP $($HealthResponse.StatusCode))" -ForegroundColor Green
    } else {
        Write-Host "❌ Health check failed (HTTP $($HealthResponse.StatusCode))" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Health check failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test examples endpoint
Write-Host "📚 Testing examples endpoint..." -ForegroundColor Yellow
try {
    $ExamplesResponse = Invoke-WebRequest -Uri "$ServiceUrl/api/examples" -Method GET -UseBasicParsing
    if ($ExamplesResponse.StatusCode -eq 200) {
        Write-Host "✅ Examples endpoint accessible (HTTP $($ExamplesResponse.StatusCode))" -ForegroundColor Green
    } else {
        Write-Host "❌ Examples endpoint failed (HTTP $($ExamplesResponse.StatusCode))" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Examples endpoint failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test Swagger documentation
Write-Host "📖 Testing Swagger documentation..." -ForegroundColor Yellow
try {
    $SwaggerResponse = Invoke-WebRequest -Uri "$ServiceUrl/api-docs" -Method GET -UseBasicParsing
    if ($SwaggerResponse.StatusCode -eq 200) {
        Write-Host "✅ Swagger documentation accessible (HTTP $($SwaggerResponse.StatusCode))" -ForegroundColor Green
    } else {
        Write-Host "❌ Swagger documentation failed (HTTP $($SwaggerResponse.StatusCode))" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Swagger documentation failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test main API endpoint
Write-Host "🧮 Testing main API endpoint..." -ForegroundColor Yellow
try {
    $ApiBody = @{
        k = 2
        matrix = @(
            @(0, 0, 0, 0),
            @(0, 0, 1, 0),
            @(1, 0, 0, 1)
        )
    } | ConvertTo-Json -Depth 10

    $ApiResponse = Invoke-WebRequest -Uri "$ServiceUrl/api/store-locations" -Method POST -Body $ApiBody -ContentType "application/json" -UseBasicParsing
    if ($ApiResponse.StatusCode -eq 200) {
        Write-Host "✅ Main API endpoint working (HTTP $($ApiResponse.StatusCode))" -ForegroundColor Green
    } else {
        Write-Host "❌ Main API endpoint failed (HTTP $($ApiResponse.StatusCode))" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Main API endpoint failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "🎉 Public Access Test Complete!" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Green
Write-Host "📱 Access your API at:" -ForegroundColor Green
Write-Host "   Health: $ServiceUrl/health" -ForegroundColor White
Write-Host "   Examples: $ServiceUrl/api/examples" -ForegroundColor White
Write-Host "   Swagger: $ServiceUrl/api-docs" -ForegroundColor White
Write-Host "   Main API: $ServiceUrl/api/store-locations" -ForegroundColor White
Write-Host ""

# Check IAM policy
Write-Host "🔐 Checking IAM policy for public access..." -ForegroundColor Yellow
try {
    $IamPolicy = (gcloud run services get-iam-policy $ServiceName --region $Region --project $ProjectId --format="value(bindings[].members)" 2>$null)
    if ($IamPolicy -and $IamPolicy.Contains("allUsers")) {
        Write-Host "✅ Public access correctly configured (allUsers has access)" -ForegroundColor Green
    } else {
        Write-Host "❌ Public access may not be configured" -ForegroundColor Red
        Write-Host "Run this command to fix:" -ForegroundColor Yellow
        Write-Host "gcloud run services add-iam-policy-binding $ServiceName \\" -ForegroundColor White
        Write-Host "  --region $Region \\" -ForegroundColor White
        Write-Host "  --member=`"allUsers`" \\" -ForegroundColor White
        Write-Host "  --role=`"roles/run.invoker`"" -ForegroundColor White
    }
} catch {
    Write-Host "❌ Could not check IAM policy: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "✨ All done! Your service should be publicly accessible." -ForegroundColor Green
