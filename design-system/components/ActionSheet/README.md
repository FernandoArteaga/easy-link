The More sheet for a link: the link's tile, domain and path as the header, then a menu of Open, Copy, Move to folder and Delete.

- Menu rows 52px, icon in `ink-muted`; Delete last in `danger`, separated by position, not by a divider.
- Delete runs immediately and shows a toast with Undo (no second confirm), because it is reversible for a few seconds.
- "Move to folder" swaps the sheet's body for the folder picker (MoveSheet).
