impressive.js
=============
Based on the idea of impress.js as well as builder4impress, this tool will assist you in arranging the slides (or other sprite elements) of your impress.js presentation.

The main ideas of this project are:
 - Separate presentation style (=CSS file), element positioning (=JS file), and presentation content (=HTML file)
 - The element positioning is done via a separate JavaScript file which contains the variable `positions`. This variable contains all position properties (x, y, z, scale, rotation). When adjusting the element positioning, an updated position file can be download directly from within the browser.
 - Slide editing capabilties as supported by builder4impress have been removed.


Usage instructions
------------------

Stop the mouse pointer over a step to see the controls. Draggable controls let you set position, rotation and scale of the selected step. Caution: element is being redrawn when you stop the mouse, not all the time.

Top left corner has some more buttons:
 - `Overview` - switches you from looking at a particular slide to the overview.
 - `Get positions` - downloads the updated element positions as separate JavaScript file.

Note: I experienced best presentation results (in terms of smooth transitions) with Chrome/Chromium. Therefore, I will mainly aim at supporting Chrome/Chromium in this code.

License
-------
MIT License

