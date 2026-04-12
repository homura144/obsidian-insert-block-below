# Release Checklist

Repository:

- GitHub: [homura144/obsidian-insert-block-below](https://github.com/homura144/obsidian-insert-block-below)
- Releases: [https://github.com/homura144/obsidian-insert-block-below/releases](https://github.com/homura144/obsidian-insert-block-below/releases)

## Preflight

- Confirm `manifest.json.version` is the release version.
- Confirm `versions.json` contains the same plugin version mapped to the minimum supported *Obsidian* version.
- Run:

```bash
npm test
npm run build
```

- Confirm release assets are present:
	- `main.js`
	- `manifest.json`
- Confirm repository root contains:
	- `README.md`
	- `LICENSE`
	- `versions.json`

## GitHub Release

1. Commit and push the release changes.
2. Create a tag matching `manifest.json.version`.
3. Publish a GitHub release with the same version string.
4. Upload:
	- `main.js`
	- `manifest.json`

Example with GitHub CLI:

```bash
gh release create 0.0.1 main.js manifest.json --repo homura144/obsidian-insert-block-below --title "0.0.1" --notes "Release 0.0.1"
```

## Obsidian Community Plugin Submission

Only the first submission needs a PR to `obsidianmd/obsidian-releases`.

1. Fork `obsidianmd/obsidian-releases`.
2. Add this entry to `community-plugins.json`:

```json
{
  "id": "insert-block-below",
  "name": "Insert Block Below",
  "author": "homura",
  "description": "Insert math blocks and code fences below the current line with list, quote, and callout aware indentation.",
  "repo": "homura144/obsidian-insert-block-below"
}
```

3. Open a PR named `Add plugin: Insert Block Below`.
4. Wait for the validation bot and review feedback.

## Later Updates

- Do not open another store-submission PR.
- For version updates:
	- bump `manifest.json.version`
	- update `versions.json`
	- run tests and build
	- publish a new GitHub release with matching tag and assets
