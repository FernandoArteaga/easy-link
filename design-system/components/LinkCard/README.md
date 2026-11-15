A saved link as a card: a letter tile, the domain in bold, the path in mono on one line, and two actions (copy, more).

- Fixes the old row's horizontal scrollbars: the URL is split into **domain** (`body-strong`) and **path** (`url` style, `ink-muted`), each truncated with an ellipsis. Never scroll inside a card.
- Tapping the text opens the link in a new tab. Copy is the quick action; everything else (open, move to folder, delete) is in the More sheet.
- The tile shows the domain's first letter on `violet-soft`. A real favicon may replace it later at the same 40px, `radius-sm`.
- Optional folder tag under the path when viewing "All".
- **assign** variant (organize mode): a `violet-text` inset ring and a single tonal Move button, so the mode is obvious per card.
- Light theme: no border, `shadow-card`. Dark: `line` hairline, no shadow.
- Delete is never one tap away: it goes through the More sheet and then an Undo toast.
