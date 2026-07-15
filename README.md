# Cinder Grove

A warm, muted dark theme for Visual Studio Code that's easy on the eyes.

![Cinder Grove in Visual Studio Code](https://codeberg.org/aileks/cinder-grove-vscode/raw/branch/main/assets/screenshot.png)

## Features

- Complete workbench, editor, terminal, diff, diagnostics, notebook, chat, and agent colors
- TextMate and semantic highlighting for modern language tooling
- Focused support for Markdown, structured data, web, Lua, Go, Python, Rust, shell, and JavaScript/TypeScript
- No activation code, telemetry, network access, or runtime dependencies

## Installation

Search for `Cinder Grove` in the Extensions view, then choose it with **Preferences: Color Theme**.

Command line:

```sh
code --install-extension aileks.cinder-grove
```

## Palette

| Token | Hex | Common use |
| --- | --- | --- |
| `background` | `#131210` | Editor background |
| `container` | `#1B1916` | Panels, sidebars, and popovers |
| `surface` | `#23201C` | Raised and interactive regions |
| `focused_surface` | `#34312D` | Neutral focused and debugging controls |
| `overlay` | `#58534C` | Selections and active controls |
| `text_muted` | `#58534C` | Disabled and lowest-emphasis text |
| `muted_dim` | `#706A62` | Dimmed editor metadata |
| `muted_readable` | `#878077` | Comments, punctuation, and small functional text |
| `text_subtle` | `#9A938A` | Metadata and supporting text |
| `text_secondary` | `#ACA49B` | Secondary text |
| `text` | `#BBB3A9` | Default text |
| `text_bright` | `#DDD5CA` | High-emphasis text |
| `primary` | `#E17A3F` | Cinder orange and main accent |
| `secondary` | `#879B5C` | Grove green and supporting accent |
| `error` | `#B34A45` | Errors and removals |
| `warning` | `#D9A441` | Warnings and attention states |
| `success` | `#879B5C` | Success and additions |
| `info` | `#6785A1` | Information and links |
| `purple` | `#9A788F` | Keywords and supporting syntax |
| `cyan` | `#58918C` | Types, constants, and hints |

`secondary` and `success` intentionally share the grove green swatch.

The VS Code-only muted swatches preserve the palette character while keeping small functional text readable.

## Development

Requires Node.js 24 and npm.

```sh
npm ci
npm run check
npm run package
```

Press `F5` in Visual Studio Code to open an Extension Development Host for live theme preview.

## Related

- [Cinder Grove for Neovim](https://codeberg.org/aileks/cinder-grove.nvim)
- [Issues and support](https://codeberg.org/aileks/cinder-grove-vscode/issues)

## License

MIT
