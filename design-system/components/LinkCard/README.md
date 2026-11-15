A saved link as a card: a letter tile, an optional title or else the URL, and two actions (copy, more).

- **Title is optional.** With a title: line 1 is the title (`body-strong`, `ink`), line 2 the full URL without `https://` and `www.` (`url` style, `ink-muted`). Without one: line 1 is the domain in bold, line 2 the path. Every line is one line, truncated with an ellipsis (`white-space: nowrap; overflow: hidden; text-overflow: ellipsis`). Never wrap, never scroll inside a card.
- Card height is the same with or without a title, so a mixed list stays even.
- The title is set or cleared from the More sheet ("Add title" / "Edit title"), see TitleSheet. An empty or whitespace-only title counts as no title.
- Classes: `el-card__title` + `el-card__url` when titled; `el-card__domain` + `el-card__path` when not.
- Tapping the text opens the link in a new tab. Copy is the quick action; everything else (open, move to folder, delete) is in the More sheet.
- The tile shows the domain's first letter on `violet-soft`. A real favicon may replace it later at the same 40px, `radius-sm`.
- Optional folder tag under the path when viewing "All".
- **assign** variant (organize mode): a `violet-text` inset ring and a single tonal Move button, so the mode is obvious per card.
- Light theme: no border, `shadow-card`. Dark: `line` hairline, no shadow.
- Delete is never one tap away: it goes through the More sheet and then an Undo toast.
