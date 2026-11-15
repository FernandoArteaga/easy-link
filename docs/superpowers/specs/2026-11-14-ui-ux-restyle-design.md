# UI/UX restyle (#96, part 2) — design

Second slice of issue #96, on `96-improve-ui-and-ux` (same PR as the bug fixes). Source of truth for the
look: `design-system/` (README, `tokens.css`, `components/bundle.css`, component READMEs + previews).

## Intent

Replace the Skeleton "terminus" look with the Easy Link design system, mobile first: calmer chrome,
readable link cards, the add bar in thumb reach, bottom sheets, and deletes that can be undone. Covers the
"Visual design" section of #96 and the UX items "delete is the first action" (More sheet + Undo),
"icon-only buttons have no aria-label", and "assigning links needs a mode toggle" (Move to folder per
link).

## Goals / non-goals

- Goals: every screen (login, links, folders, sheets, toasts) matches the previews in light and dark;
  tap targets ≥ 44px; aria-labels on icon buttons; Undo on link and folder delete.
- Non-goals (later UX slice): search, duplicate folder names, clearing stale `folderId` on folder delete,
  paste-from-clipboard, link counts on chips/rows, real favicons, saved-at dates.
- Anti-goals: changing existing reads/queries or rules. The only data-model change is the optional link
  `title` below.

## Link title (added to the design system after the first draft)

- `Firestore.Link.title?: string`. Absent, empty or whitespace-only = no title. No rules change (links
  are fully owner-writable); no index change (no query on it).
- New helper `updateLinkTitle(userUid, linkId, title: string | undefined)`: writes the trimmed title, or
  `deleteField()` when empty. Separate from `updateLink`, which always rewrites `folderId`.
- `LinkList` maps `title` from the snapshot; `restoreLink` writes it back when present.
- **TitleSheet:** opened from the More sheet item "Add title" / "Edit title" (heading matches); URL (no
  `https://`/`www.`) as context; TextField "Title (optional)", `maxlength=80`, autofocused, clear (x)
  button, hint "Leave empty to show the link instead."; actions "Save title" / Cancel; Enter saves. Toast
  "Title saved" or "Title removed".
- **LinkCard with title:** line 1 title (bold), line 2 URL without `https://` and `www.` (mono, muted).
  Without: domain / path as before. Same card height either way; every line truncated with an ellipsis.
- The More sheet header shows the same two lines as the card.

## Approaches (decided)

- **CSS: Tailwind theme** (chosen by Fernando). Tokens from `tokens.css` become CSS variables in
  `src/app.css` (light on `:root, [data-theme=light]`, dark on `[data-theme=dark], .dark`), exposed to
  Tailwind via `@theme inline` (colors `bg`, `surface`, `surface-2`, `line`, `line-control`, `ink`,
  `ink-muted`, `violet`, `on-violet`, `violet-soft`, `violet-text`, `mint`, `on-mint`, `mint-soft`,
  `mint-text`, `danger`, `on-danger`, `danger-soft`, `scrim`, `toast-bg`, `toast-ink`; radii
  `sm/md/lg/xl`; shadows `card/float/sheet`; fonts `sans/mono`). Components are rebuilt with utilities.
  Rejected: copying `el-*` classes verbatim.
- **Undo: delete now, restore on Undo** (chosen by Fernando). New helpers `restoreLink(uid, link)` (setDoc
  with the original id, `url`, `timestamp`, `folderId`) and `restoreFolder(uid, folder)` (transaction:
  `totalFolders +1`, setDoc with original id, `name`, `nameLower`). Existing helpers stay as they are.
  Folder restore works because folder delete never touches the links' `folderId`. If the user is at the
  10-folder cap after deleting, restore still fits (delete freed a slot).
- **Counts: left out** (chosen). The Folders title shows `N of 10` from `totalFolders`.
- **Branch: same branch** (chosen).

## Design

- **Theme:** remove `@skeletonlabs/skeleton` + terminus CSS imports; keep `@skeletonlabs/skeleton-svelte`
  components (Dialog, Toast) for behaviour only, styled with our classes. `app.html`: drop
  `data-theme="terminus"`, load Manrope (500–800) + JetBrains Mono (400–500) from Google Fonts, body
  `bg-bg text-ink font-sans`. Theme store sets `data-theme` alongside `.dark`.
- **AppBar** (secured layout): logo + "Easy Link" (link to `/links`), then icon buttons: Manage folders
  (on `/links`) or nothing extra (on `/folders`), theme toggle, sign out. All `aria-label`ed.
- **Links screen:** FolderChips (scrolling, hidden scrollbar, active violet, "+ New" chip opens the Add
  folder sheet, hidden at the cap) → LinkCard list → AddBar docked at the bottom (sticky, safe-area,
  fade). Empty state "No links in <folder> yet" / "No links yet".
- **LinkCard:** letter tile (domain initial), bold domain + mono path, both truncated; tapping the text
  opens the link in a new tab when `isValidLink`, else copies; actions Copy + More. Folder tag under the
  path when viewing All and the link has a folder.
- **More sheet (ActionSheet):** header tile + domain + path; menu Open (only if valid link), Copy, Add/Edit
  title, Move to folder, Delete (danger, last). Move to folder swaps the body for the MoveSheet radio list ("All (no
  folder)" first, current selected) + "Move" primary. Delete closes the sheet, deletes, toast "Link deleted"
  with Undo → `restoreLink`.
- **Organize mode is removed** (`FolderStore.assigningLinks`, the FolderTree toggle and banner): Move to
  folder in the More sheet replaces it. Bulk select belongs to the UX slice.
- **Folders screen:** screen title "Folders" + "N of 10"; one grouped card of FolderRows (folder tile,
  name, rename + delete icon buttons); AddBar "New folder name" in the dock, replaced by the limit message
  at the cap. Rename opens the sheet prefilled ("Save"). Delete runs immediately with toast "Folder
  deleted" + Undo → `restoreFolder` (no confirm sheet: counts aren't known). Empty state "No folders yet".
- **Bottom sheet (Modal):** Skeleton Dialog, positioner aligned bottom on mobile, centered dialog at ≥560px;
  grab handle, small title, description, body, stacked full-width actions (primary first, named by what it
  does via a `confirmLabel` prop, Cancel ghost last). The More sheet uses the same component with no
  confirm button.
- **TextField (InputField):** visible label above a 52px filled box, leading icon, trailing reveal eye,
  16px text; label prop replaces external labels.
- **Login:** logo, headline "Your links, everywhere.", subline, Segmented (Sign in / Sign up) replacing
  Tabs, labelled fields, full-width primary "Sign in" / "Create account".
- **Toasts:** bottom-center pill, `toast-bg`/`toast-ink`, status dot (mint success, danger error), one line,
  no title; optional action (Undo) via the toaster's `action`. Call sites drop `title`.
- **Loading:** skeleton cards/chips with pulse, no pulse under `prefers-reduced-motion`.
- **Icons:** Lucide 20px; `Trash2`, `CornerDownLeft`, `Folders`, `EllipsisVertical`, `Copy`, `ExternalLink`,
  `FolderInput`, `Pencil`, `Sun`/`Moon`, `LogOut`, `Plus`, `X` (clear).

## Left to the builder

Exact Tailwind utility composition, how the sheet animates (≤200ms, reduced-motion safe), whether the
AddBar sits at the top at ≥560px (allowed by the README; default: dock everywhere).

## Docs

CHANGELOG `[Unreleased]` Changed/Added entries; wiki app-architecture (UI layer, theme, organize mode
removed), data-model (`title` field, `updateLinkTitle`, restore helpers), log entry. `design-system/`
committed as the reference and added to `.prettierignore` (its exported CSS is minified and would fail
`pnpm fmt:check`).
