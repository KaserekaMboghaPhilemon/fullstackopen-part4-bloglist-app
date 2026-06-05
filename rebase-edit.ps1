param($file)

# Read the todo file
$content = Get-Content $file -Raw

# Replace "pick ebd8772" with "reword ebd8772"
$content = $content -replace "pick ebd8772", "reword ebd8772"

# Write back
Set-Content $file -Value $content
