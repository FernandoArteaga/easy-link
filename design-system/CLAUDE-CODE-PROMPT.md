# Prompt to paste into Claude Code

Read `design-system/README.md` first, then `tokens.css`, `components/bundle.css`, and each
`components/<Name>/README.md` + `preview.html` (open the previews in a browser to see the target look;
`LinksScreen` and `FoldersAndSignIn` are the full mobile screens).

Restyle the app to match this design system, mobile first:
- Replace the Skeleton "terminus" theme in `src/app.css` with the tokens in `tokens.css`
  (keep Skeleton's Dialog/Toast for behavior only). Load Manrope + JetBrains Mono from Google Fonts in `src/app.html`.
- Theme switching already toggles `.dark` on <html>; also set `data-theme="light|dark"`.
- Map components as the README's "Using it in the app" section says
  (ButtonInline → icon button, LinkChip → link card, FolderList → folder chips, QuickForm → add bar docked at the bottom,
  Modal → bottom sheet, FolderChip → folder row, InputField → text field, login Tabs → segmented control).
- Move delete/open/move-to-folder into a "More" action sheet; deletes show a toast with Undo.
- Keep all Firebase logic and data unchanged. Work on a new branch and run `pnpm check` and `pnpm fmt:check`.
