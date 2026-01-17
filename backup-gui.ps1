Add-Type -AssemblyName PresentationFramework

# --- GUI erstellen ---
$window = New-Object System.Windows.Window
$window.Title = "Werkstattmanager Backup"
$window.Width = 380
$window.Height = 200
$window.WindowStartupLocation = "CenterScreen"
$window.ResizeMode = "NoResize"

$button = New-Object System.Windows.Controls.Button
$button.Content = "Backup jetzt erstellen"
$button.FontSize = 18
$button.Margin = "20"
$button.Padding = "10"
$button.HorizontalAlignment = "Center"
$button.VerticalAlignment = "Center"

$window.Content = $button

# --- Backup-Funktion ---
$button.Add_Click({
    try {
        # Änderungen hinzufügen
        git add .

        # Commit mit Zeitstempel
        $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
        git commit -m "Backup: $timestamp"

        # Version aus Datei lesen oder neu anlegen
        $versionFile = "version.txt"
        if (!(Test-Path $versionFile)) {
            "1.0.0" | Out-File $versionFile
        }

        $version = Get-Content $versionFile
        $major, $minor, $patch = $version.Split(".")
        $patch++
        $newVersion = "$major.$minor.$patch"
        $newVersion | Out-File $versionFile

        # Tag setzen
        git tag -a "v$newVersion" -m "Backup Version $newVersion"

        # Pushen
        git push
        git push origin "v$newVersion"

        [System.Windows.MessageBox]::Show("Backup erfolgreich erstellt!`nVersion: v$newVersion","Erfolg")
    }
    catch {
        [System.Windows.MessageBox]::Show("Fehler beim Backup:`n$_","Fehler")
    }
})

# --- GUI starten ---
$window.ShowDialog() | Out-Null