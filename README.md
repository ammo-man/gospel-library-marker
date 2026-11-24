# Gospel Library quick marker toolbar

A userscript that adds an always-visible toolbar to
[churchofjesuschrist.org](https://www.churchofjesuschrist.org) study pages, so you can mark
text with one tap: pick a color and a style (highlight or underline), and delete a mark with
no confirmation. Built for reading on iPad with Apple Pencil, works on desktop too.

Unofficial. Not affiliated with or endorsed by The Church of Jesus Christ of Latter-day Saints.

## Features
- 10 colors x 2 styles (highlight / underline), each with an icon for what it means to you
- Select text, tap a button: the mark is created and styled in one step
- One-tap trash button, no "are you sure" dialog (only for the toolbar's trash; the site's own button still asks)
- Draggable by its header (position remembered), tap the header to collapse
- Works through the site's own toolbar, so your marks are saved to your account as usual

## Install
Use a userscript manager for Safari or your browser:
- **Safari (Mac / iPad):** [Userscripts](https://apps.apple.com/app/userscripts/id1463298887) (free) or Tampermonkey
- **Chrome / Edge / Firefox:** Tampermonkey or Violentmonkey

Then open the raw script and let the manager install it:

<https://raw.githubusercontent.com/ammo-man/gospel-library-marker/main/gospel-marker.user.js>

(In the Userscripts app, create a new script and paste the file's contents instead.)
Make sure the extension is allowed on `churchofjesuschrist.org`.

## Customizing
The color order, meanings and icons are in the `COLORS` list near the top of the script.
Every site-specific selector is in the `SEL` block. If the site changes and a tap stops
working, the toolbar shows a short warning, and that block is the place to fix.

## How it works
The site's own marking toolbar exposes stable `data-testid` hooks. The script drives those
buttons for you (create, choose color and style, delete) and auto-accepts the delete dialog
before it is painted.

## Credits
Icons are from [Bootstrap Icons](https://icons.getbootstrap.com) (MIT).

## License
MIT
