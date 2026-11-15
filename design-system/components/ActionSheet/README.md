The More sheet for a link: the link's card lines as the header (title + URL, or domain + path), then a menu of Open, Copy, Edit title, Move to folder and Delete.

- The title item reads "Add title" when the link has none, "Edit title" when it has one; both open TitleSheet.

- Menu rows 52px, icon in `ink-muted`; Delete last in `danger`, separated by position, not by a divider.
- Delete runs immediately and shows a toast with Undo (no second confirm), because it is reversible for a few seconds.
- "Move to folder" swaps the sheet's body for the folder picker (MoveSheet).
