# Easy Link

A refreshed, mobile-first look for **The Easy Link**, the SvelteKit + Firebase app for saving a link on one device and opening it on another. This system replaces the Skeleton "terminus" theme: same features and data, a lighter, calmer interface built for one hand on a phone.

Built from the repository `FernandoArteaga/easy-link` (components in `src/lib/components`, routes in `src/routes`) and the current screenshots. Icons stay Lucide (`@lucide/svelte`), already a dependency.

## What changes, at a glance

| Before                                        | After                                               |
| --------------------------------------------- | --------------------------------------------------- |
| Heavy purple slabs on both sides of every row | Quiet round icon buttons; at most two per card      |
| URLs in boxes with horizontal scrollbars      | Cards: bold domain + mono path, each truncated      |
| Underlined tab strip with a visible scrollbar | Scrolling folder chips, active in violet            |
| Add link field at the top                     | Add bar docked at the bottom, in thumb reach        |
| Centered modals                               | Bottom sheets with stacked, named actions           |
| White pill buttons: home, theme, "Sign out"   | App bar: logo + wordmark, two icon buttons          |
| Dark only in practice (terminus)              | Warm light theme and a true dark theme              |
| Toasts bottom-right with "Error" titles       | One-line pill toasts, bottom center, Undo on delete |

## Voice

Short, plain, sentence case. Buttons say what they do: "Create folder", "Move", "Delete", never "Confirm" or "Submit". Toasts are one line: "Link copied", "Link deleted · Undo", "Couldn't save. Check your connection." Empty states name the folder: "No links in Home yet".

## Visual foundations

**Color.** Two brand hues, each with one job. `violet-600` comes from the chain icon: the active folder chip, primary buttons, focus (`violet-text`). `mint-400` is kept from the old submit button and now means only _save_: the round button on the add bar and success dots. Everything else is neutral: `bg` (warm paper / near-black), `surface` for cards, `surface-2` for fills, `ink` and `ink-muted` for text. `danger` is for delete only. Text meets 4.5:1 in both themes; mint is never used as text on light (use `mint-text`), and text on mint is always `on-mint`.

**Type.** Manrope (Google Fonts) for everything, weights 500–800; JetBrains Mono for URL paths. Headings are tight (−0.015em to −0.02em). Inputs are 16px so iOS doesn't zoom on focus.

**Shape.** Soft and round: chips, icon buttons and toasts are fully round (`radius-full`); cards `radius-lg` (18px); sheets and the add bar `radius-xl` (28px); inputs and rows `radius-md` (12px).

**Depth.** Light theme: cards have no border and a faint `shadow-card`; floating things (add bar, toast) use `shadow-float`; sheets `shadow-sheet`. Dark theme: cards use the `line` hairline and no shadow.

**Layout.** Mobile first at 360–430px wide: 16px side padding (`space-4`), 12px between cards, 24px between sections. Every tap target is at least `tap` (44px). Content caps at `content-max` (560px) on larger screens, centered. The dock respects `env(safe-area-inset-bottom)`.

**Motion.** Small and quick: buttons scale to .98 on press, sheets slide up ~200ms. Honor `prefers-reduced-motion`.

## Iconography

Lucide at 20px, stroke 2, `currentColor`; 18px inside sheets and rows, 14–16px in chips and toasts. Mapping from today: `OctagonX` → `Trash2` (inside the More sheet), `CornerDownRight` → `CornerDownLeft` (submit), `FolderTree` organize toggle → "Move to folder" in the More sheet, `Folders` → Manage folders, `House` → the logo.

## Screens

- **Links**: AppBar → FolderChips → LinkCard list → AddBar in the dock. Organize mode adds a violet banner with Done and switches cards to the assign variant.
- **Folders**: AppBar → title with "7 of 10" → one grouped FolderRow list → AddBar ("New folder name"). At the limit the bar is replaced by the limit message.
- **Sign in**: logo, headline, Segmented (Sign in / Sign up), TextFields with labels, full-width primary.

## Using it in the app

Components here are CSS classes (`components/bundle.css`, prefixed `el-`) on top of the tokens' CSS variables, so they map directly onto the Svelte components: `ButtonInline` → `el-iconbtn`, `DisplayTextInline` + `LinkChip` → `el-card`, `FolderList` → `el-chips`, `QuickForm` → `el-addbar` in `el-dock`, `Modal` → `el-sheet` (keep Skeleton's Dialog for behavior), `FolderChip` → `el-row`, `InputField` → `el-field`. Theme switching already toggles `.dark` on `<html>`; set `data-theme="light|dark"` alongside it so the token blocks apply.
