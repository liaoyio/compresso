param (
  [string]$filePath
)
az login --service-principal -u $Env:AZURE_CLIENT_ID -p $Env:AZURE_CLIENT_SECRET -t $Env:AZURE_TENANT_ID

$metadaJsonPath = Join-Path -Path $Env:REPO_PATH -ChildPath "src-tauri/metadata.json"
if($Env:GITHUB_WORKSPACE) {

  $hashtable = @{
    Endpoint = "https://neu.codesigning.azure.net/"
    CodeSigningAccountName = $Env:AZURE_CODE_SIGNING_ACCOUNT_NAME
    CertificateProfileName = $Env:AZURE_CERTIFICATE_PROFILE_NAME
  }

  $json = $hashtable | ConvertTo-Json

  # Write the JSON to the file
  [System.Text.Encoding]::UTF8.GetBytes($json) | Set-Content -Path $metadaJsonPath -Encoding Byte
}
$url = "https://www.nuget.org/api/v2/package/Microsoft.Trusted.Signing.Client/1.0.60"
$output = Join-Path -Path $Env:REPO_PATH -ChildPath "src-tauri/Microsoft.Trusted.Signing.Client.1.0.60.nupkg.zip"
$extractPath = Join-Path -Path $Env:REPO_PATH -ChildPath "src-tauri/Microsoft.Trusted.Signing.Client.1.0.60"
$dllPath = Join-Path -Path $extractPath -ChildPath "/bin/x64/Azure.CodeSigning.Dlib.dll"


if (!(Test-Path -Path $extractPath)) {
  Write-Host "Downloading $output"
  # Download the package
  [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
  Invoke-WebRequest -Uri $url -OutFile $output
  Write-Host "Extracting $output"
  # Extract the package
  Expand-Archive -Path $output -DestinationPath $extractPath
}

Write-Host "Signing $filePath"
$args = @("sign", "/debug", "/v", "/fd", "SHA256", "/tr", "http://timestamp.acs.microsoft.com", "/td", "SHA256", "/dlib", $dllPath, "/dmdf", $metadaJsonPath, $filePath)
Write-Host "Signing with $Env:SIGNTOOL_PATH $args"
& "$Env:SIGNTOOL_PATH" $args