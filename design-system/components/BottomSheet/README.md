Bottom sheet that replaces the centered Modal on mobile: slides up from the bottom with 28px top corners, a grab handle, title, description, body and stacked actions.

- Backdrop `scrim`; tap outside or swipe down to dismiss. Sheet on `surface` with `shadow-sheet`.
- Title in `sheet-title`; description in `body` / `ink-muted`.
- Actions stacked, full width, primary first; Cancel last as ghost. Name the primary by what it does ("Create folder", "Move", "Delete"), not "Confirm".
- On screens 560px and wider, the same content may render as a centered dialog, `radius-xl` all round.
- Built on the existing Skeleton `Dialog` (positioner aligned to the bottom); only the styling changes.
