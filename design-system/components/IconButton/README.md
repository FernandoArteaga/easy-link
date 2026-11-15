Round 44px icon-only button with a 20px Lucide icon; replaces the purple `ButtonInline` slabs.

- **default**: transparent, `ink-muted` icon, `surface-2` on hover. Use for copy, more, theme, sign out.
- **tonal**: `violet-soft` fill, `violet-text` icon: the one action that matters in a mode (move to folder while organizing).
- **save**: `mint-400` fill, `on-mint` icon: the submit at the end of the add bar only.
- **danger**: muted until hover/press, then `danger` on `danger-soft`.
- **sm** (36px) only inside sheets' header; the hit area stays 44px with padding.
- Always pass `aria-label`. Don't put more than two icon buttons on a link card: everything else lives in the More sheet.
