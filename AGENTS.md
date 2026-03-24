# AGENTS.md

Repository-local instructions for Codex and other automation working in this project.

## Shell Conventions

- Use Windows PowerShell for shell commands in this repository.
- Do not use `cmd` unless the user explicitly asks for it or PowerShell cannot perform a required task cleanly.
- Prefer direct PowerShell commands over mixed shell invocations.
- Assume the shell environment is Windows PowerShell 5.1 unless verified otherwise.

## File Encoding Conventions

This repository should use UTF-8 text files.

### Reading files

- When reading text files from PowerShell, prefer explicit UTF-8 decoding.
- Use `Get-Content -Encoding UTF8` when reading repository text files if encoding matters.

### Writing files

- When writing text files from PowerShell, do not rely on default encoding.
- Always specify an encoding explicitly.
- `Set-Content -Encoding UTF8` is acceptable when UTF-8 with BOM is acceptable.
- In Windows PowerShell 5.1, `-Encoding UTF8` writes UTF-8 with BOM.
- If BOM-free UTF-8 is required, use a .NET UTF-8 writer configured without BOM instead of plain `Set-Content -Encoding UTF8`.

Recommended BOM-free UTF-8 write pattern in Windows PowerShell 5.1:

```powershell
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($path, $content, $utf8NoBom)
```

## Editing Preferences

- Prefer repository-safe patching tools for source edits when available.
- If shell-based file writes are necessary, preserve UTF-8 encoding intentionally.
- Avoid accidental encoding changes when touching existing files.

## Project Preference Summary

For this repository, the default automation behavior should be:

1. Use PowerShell, not `cmd`.
2. Be explicit about text encoding.
3. Treat BOM-free UTF-8 as the preferred format unless a file already uses a BOM or the user requests otherwise.
