impressive.js
=============
Based on the idea of impress.js as well as builder4impress, this tool will assist you in arranging the slides (or other sprite elements) of your impress.js presentation.

The main ideas of this project are:
 - Separate presentation style (=CSS file), element positioning (=JS file), and presentation content (=HTML file)
 - Slide positions can be adjusted visually with the help of features from builder4impress (inline editing has been removed)
 - The element positioning is done via a separate JavaScript file which contains the variable `positions`. This variable contains all position properties (x, y, z, scale, rotation). When adjusting the element positioning, an updated position file can be download directly from within the browser.
 - A navigation menu that contains references to all slides is accessible over the menu icon on the top right.
 - The *mardown* syntax is within the slides to ease the creation process


Usage instructions
------------------

If you want to edit slide positions, open the menu (top right position) and choose the *edit* icon. The page will be reloaded with the edit option activated. Now you can stop the mouse pointer over a slide or sprite elemente and a control menu will be shown. The draggable controls let you set position, rotation and scale of the selected step. If some element is in your way, you can hide it with a simple click in the control menu.

The edit menu on the top left corner has some more actions. `Overview` takes you to the overview slide and `Get positions` will download all current positions as separate JavaScript file (named *pos.js*).

Note: I experienced best presentation results (in terms of smooth transitions) with Chrome/Chromium. Therefore, I will mainly aim at supporting Chrome/Chromium in this code.

License
-------
MIT License

