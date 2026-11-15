The one-field form for saving a link (or naming a folder): a floating 56px pill with a leading icon, the input, and a round mint save button.

- On mobile it lives in the bottom **dock** (`el-dock`): sticky to the bottom, above the safe area, with a fade into `bg` so cards scroll under it. Thumbs reach it without stretching; this is the app's main action.
- At 560px and wider it may sit at the top under the app bar, as today.
- Placeholder "Paste a link"; `type="url"`, `inputmode="url"`, `autocapitalize="off"`. Submit with Enter or the mint button.
- The old Eraser button is dropped: a clear (x) appears only when there is text, using `el-iconbtn--sm`.
- Folders screen uses the same bar with the folder icon and "New folder name"; at the folder limit, hide it and show the limit message in its place.
