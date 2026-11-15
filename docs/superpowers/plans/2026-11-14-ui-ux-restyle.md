# UI/UX Restyle (#96 part 2) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle every screen to the Easy Link design system (Tailwind theme from its tokens), add the
More / Move / Title sheets, Undo on delete, and the optional link title.

**Architecture:** Tokens become CSS variables in `src/app.css`, exposed via Tailwind `@theme inline`.
Skeleton CSS is dropped; Skeleton-svelte `Dialog` and `Toast` stay for behaviour (Zag, unstyled). Shared
primitives (IconButton, Sheet, TextField, AddBar, EmptyState, Skeleton) are rebuilt first; screens are then
composed from them.

**Tech Stack:** SvelteKit 3, Svelte 5 runes, Firebase 13, Skeleton-svelte 5 (Dialog, Toast), Tailwind v4,
`@lucide/svelte`.

**Spec:** `docs/superpowers/specs/2026-11-14-ui-ux-restyle-design.md` (look: `design-system/`)

## Global Constraints

- No test suite. Gate per task: `pnpm fmt:check && pnpm check && pnpm build`.
- `#lib/...` imports with extensions; Prettier style; runes only.
- `'all'` never written to Firestore. Existing helpers in `src/lib/firestore/` keep their behaviour.
- Every value comes from a token (colour, radius, shadow, font). Tap targets ≥ 44px. Inputs 16px.
- Icon-only buttons always have `aria-label`. Copy: sentence case, buttons named by action, toasts one
  line, no titles.
- Honour `prefers-reduced-motion` (no pulse, no sheet slide).

## Review Focus

- Undo after delete restores the exact doc (same id, `timestamp`, `folderId`, `title`); restoring a folder
  bumps `totalFolders` back and its links reappear under it.
- Title save with whitespace only removes the field (not `""`); title update never touches `folderId`.
- Long URL / long title / long folder name never causes horizontal scroll at 360px.
- Theme toggle: light and dark both apply (`data-theme` + `.dark`), including first paint from storage.
- Sheets: Escape / scrim close; a cancelled Move or Title edit isn't saved on next open.

---

### Task 1: Theme foundation

**Files:** `src/app.css`, `src/app.html`, `src/lib/stores/theme.svelte.ts`, `.prettierignore`,
`static/logo.png` (copy of `design-system/assets/Logos/easy-link-icon.png`)

- [ ] Commit `design-system/`, spec and plan first: `docs: design system, spec and plan for #96 restyle`.
- [ ] `app.css`: drop the three Skeleton imports and `@tailwindcss/forms`; add token variables (light on
      `:root, [data-theme='light']`, dark on `[data-theme='dark'], .dark`) and `@theme inline` mapping
      colours (`--color-bg`, `--color-surface`, `--color-surface-2`, `--color-line`, `--color-line-control`,
      `--color-ink`, `--color-ink-muted`, `--color-violet`, `--color-on-violet`, `--color-violet-soft`,
      `--color-violet-text`, `--color-mint`, `--color-on-mint`, `--color-mint-soft`, `--color-mint-text`,
      `--color-danger`, `--color-on-danger`, `--color-danger-soft`, `--color-scrim`, `--color-toast-bg`,
      `--color-toast-ink`), radii `sm 8 / md 12 / lg 18 / xl 28`, shadows `card/float/sheet`, fonts
      `sans/mono`. Copy Zag toast positioning (`translate/scale/z-index/height/opacity` vars + transitions)
      from skeleton-common `toast.css` without presets.
- [ ] `app.html`: remove `data-theme="terminus"`, add Google Fonts (Manrope 500–800, JetBrains Mono
      400–500, preconnect), body `bg-bg text-ink font-sans antialiased`.
- [ ] Theme store: `setBrowserTheme` also sets `document.documentElement.dataset.theme`.
- [ ] `.prettierignore`: `design-system/`. Gates. Commit `style: replace terminus theme with design tokens`.

### Task 2: Primitives

**Files:** Create `IconButton.svelte`, `Sheet.svelte`, `EmptyState.svelte`, `AddBar.svelte`;
rewrite `InputField.svelte`, `Placeholder.svelte`, `src/lib/utils/styles.ts`; delete `ButtonInline`,
`DisplayTextInline`, `Modal`, `QuickForm`, `Message` once unused (Tasks 4–7).

**Interfaces (produced):**

- `styles.ts`: `btn(variant: 'primary'|'save'|'tonal'|'ghost'|'danger', block?: boolean): string`.
- `IconButton` props `{ Icon, label: string, onclick?, href?, external?, variant?: 'default'|'tonal'|'save'|'danger', size?: 'md'|'sm', type? }`.
- `Sheet` props `{ isOpen (bindable), title, description?, trigger?: Snippet, triggerLabel?, header?: Snippet, body?: Snippet, confirmLabel?, confirmFormId?, confirmVariant?, onConfirm? }`. No confirm button when `confirmLabel` is absent. Bottom-aligned, full width on mobile, centered `radius-xl` ≥560px.
- `InputField` adds `label: string`, `optional?: boolean`, `hint?: string`, `trailing?: Snippet`; keeps existing props.
- `AddBar` props `{ value (bindable), placeholder, Icon, submitLabel, onsubmit, attr? }`; clear (x) when value set.
- `EmptyState` props `{ Icon, title, hint }`. `Placeholder` props `{ variant: 'card'|'chip'|'row', repeat }`.
- Toast rendering in root layout: pill bottom-center, dot by `type`, `Toast.ActionTrigger` when `toast.action`.
- [ ] Build the primitives; root layout toasts; gates; commit `style: design system primitives`.

### Task 3: Link title and restore helpers

**Files:** `src/app.d.ts`, `src/lib/firestore/links.ts`, `src/lib/firestore/folders.ts`,
`src/lib/components/LinkList.svelte`, `src/lib/utils/utils.ts`

**Interfaces (produced):** `Firestore.Link.title?: string`;
`updateLinkTitle(userUid: string, linkId: string, title: string | undefined): Promise<void>` (trim; empty →
`deleteField()`); `restoreLink(userUid: string, link: Firestore.Doc<Firestore.Link>): Promise<void>` (setDoc
same id, omit absent fields); `restoreFolder(userUid: string, folder: Firestore.Doc<Firestore.Folder>):
Promise<void>` (transaction `totalFolders +1` + set); `splitLink(url: string): { domain: string; path: string; display: string }`
(`display` = URL without scheme and `www.`; non-URL text → domain = text, path = '').

- [ ] Implement, verify `splitLink` with a throwaway script (scheme / no scheme / www / plain text /
      query-only). Gates. Commit `feat: optional link title and restore helpers`.

### Task 4: Secured shell

**Files:** `src/routes/(secured)/+layout.svelte`, `src/routes/+layout.svelte`

- [ ] AppBar: brand link to `links` (logo + "Easy Link"), Manage folders (`Folders`, on `/links` only),
      theme (`Sun`/`Moon`), sign out (`LogOut`). Content capped at 560px, 16px gutters.
- [ ] Dock: `AddBar` "Paste a link" (`type=url`, `inputmode=url`, `autocapitalize=off`) on `/links`;
      "New folder name" on `/folders`, or the limit message at the cap. Sticky bottom, safe area, fade.
- [ ] Error toasts without `title`. Gates. Commit `style: app bar and docked add bar`.

### Task 5: Links screen

**Files:** `FolderList.svelte` (→ chips), `LinkChip.svelte` (→ card + More/Move/Title sheets),
`LinkList.svelte`, `links/+page.svelte`, `src/lib/stores/folders.svelte.ts`

- [ ] Chips: `role=tablist`, `aria-selected`, hidden scrollbar, "+ New" chip opens Add folder sheet
      ("Create folder"), hidden at cap. Remove `assigningLinks` and organize toggle/banner.
- [ ] Card: tile, title/url or domain/path lines, folder tag on All, Copy + More icon buttons; text is
      an `<a target=_blank>` when `isValidLink`, else a button that copies.
- [ ] More sheet: header lines, menu Open, Copy, Add/Edit title, Move to folder, Delete. Move and Title
      swap the sheet body (state `view: 'menu'|'move'|'title'`, reset to `'menu'` and the inputs to the
      link's values on open). Move: options "All (no folder)" first, "Move". Title: field, "Save title".
- [ ] Delete: close sheet, `deleteLink`, toast "Link deleted" + Undo → `restoreLink`.
- [ ] Empty state "No links in <name> yet" / "No links yet" with hint "Paste one below.".
- [ ] Gates. Commit `style: links screen with cards and sheets`.

### Task 6: Folders screen

**Files:** `FolderChip.svelte` (→ row), `folders/+page.svelte`

- [ ] Screen title "Folders" + "N of 10"; grouped rows; rename sheet ("Save"); delete → toast "Folder
      deleted" + Undo → `restoreFolder`; empty state "No folders yet".
- [ ] Gates. Commit `style: folders screen rows`.

### Task 7: Login

**Files:** `login/+page.svelte`, `SignInForm.svelte`, `SignUpForm.svelte`

- [ ] Logo, "Your links, everywhere.", subline, segmented Sign in / Sign up (buttons with
      `role=tab`/`aria-selected`), labelled fields, primary "Sign in" / "Create account".
- [ ] Remove now-unused components. Gates. Commit `style: sign-in screen`.

### Task 8: Docs

- [ ] CHANGELOG `[Unreleased]` Added (link titles, Undo, More sheet) / Changed (new look, organize mode
      removed). Wiki app-architecture, data-model, log. Commit `docs: changelog and wiki for #96 restyle`.
