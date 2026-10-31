get-content .env | foreach {
       $name, $value = $_.split('=')
       set-content env:\$name $value
}
$Env:PATH += ";$Env:REPO_PATH\src-tauri"
