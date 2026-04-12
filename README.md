# Insert Block Below

Insert math blocks and code fences below the current line in *Obsidian*, while preserving quote, callout, and list-aware indentation.

GitHub repository: [homura144/obsidian-insert-block-below](https://github.com/homura144/obsidian-insert-block-below)

## Features

- Command palette commands:
	- `Insert math block below`
	- `Insert code block below`
- Preserves indentation for:
	- blockquotes
	- callouts
	- unordered lists
	- ordered lists with `1.` and `1)`
- Auto trigger while typing:
	- `$$$` expands into a `$$` block below
	- ` ``` ` expands into a code block below
- Optional two-line code block mode so the cursor lands at the end of the opening ````` for immediate language input

## Settings

- `Code block without blank line`
	- Insert a two-line code block and place the cursor at the end of the opening `````.
- `Auto trigger when typing ``````
	- Type ````` at the end of a line to expand into a code block below.
- `Auto trigger when typing $$$`
	- Type `$$$` at the end of a line to expand into a `$$` block below.

## Trigger Rules

- Auto triggers only fire during real-time typing in the editor.
- The trigger sequence must be at the end of the current line.
- Text before the trigger sequence is preserved.
- Auto triggers do not fire inside existing fenced code blocks.
- `$$$` does not fire inside non-empty inline math.
- Empty special cases are supported:
	- ``|`` + `` ` `` -> code block below
	- `$$|$` + `$` -> math block below

## Installation

Before this plugin is accepted into the community store, install it manually:

1. Download `main.js` and `manifest.json` from the latest GitHub release.
2. Create `.obsidian/plugins/insert-block-below/` in your vault.
3. Copy the release files into that folder.
4. Reload *Obsidian* and enable `Insert Block Below` in community plugins.

After store acceptance, install it from the Obsidian community plugins browser.

## Development

```bash
npm install
npm test
npm run build
```

The built release asset is `main.js`.

## Release Assets

Each GitHub release should upload:

- `main.js`
- `manifest.json`

This plugin currently does not use `styles.css`.

## License

Released under the [MIT License](LICENSE).
