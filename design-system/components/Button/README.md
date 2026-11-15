Text buttons for sheet confirmations, sign-in and destructive confirms; 44px tall minimum, 12px corners.

- **primary** (`violet-600` / `on-violet`): the one confirm per sheet or screen ("Confirm", "Sign in").
- **save** (`mint-400` / `on-mint`): only for saving a link or folder. Mint means "kept".
- **tonal** (`violet-soft` / `violet-text`): secondary actions that should still look tappable.
- **ghost**: Cancel. Never two ghosts side by side.
- **danger** (`danger` / `on-danger`): confirming a delete inside a sheet.
- In sheets, stack actions full width (`el-btn--block`), primary on top: thumbs reach the bottom first, so Cancel goes last.
- Consumer provides: label text, optional 18px Lucide icon before the label, `disabled` while a form is invalid.
- Replaces: Skeleton `btn preset-filled-*` and `preset-tonal-*` classes in `styles.ts` and `Modal.svelte`.
