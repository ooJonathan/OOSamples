# OOSamples
------- Change Log --------

1.0.0 - Released version

1.0.1 - Add $=OO.$; to multiple samples
		Include beautify-web libraries to beautify code replacing inner function 'formatCode' 
		Add test sample 111

1.0.2 - New samples: 
			000018 - Flash Player
			000010 - HTML5 Player
			000020 - HTML5 Facebook/Twitter buttons
		Incorporate CodeMirror's Module for CSS regonition.
		Fix issue on HTML code editor's size.

1.0.3 - Move 'Flash CC' & 'HTML5 Facebook/Twitter buttons' samples to 'Player interaction' menu.
		Add "instructions_items":"" to sample files (JSON). On OOSamples.js add a validation to display "Instructions" as a title when there are instructions, if not it will not be displayed.
		Fix Grammar as James indicated.
		Revamp menu bar: Reduce size, add icons, Sample's menu.
		Change color on highlited menu items from #172C54 to #16366B.
		Add new theme and use cookies to remember the user selection.
		Improve Gist export section, now you can add a custom title and description.

1.0.4 - Fix bug introduced on 1.0.3. On menu when selecting a sample the Id is 'undefined'. . Root cause: The change to get the id from 'li' makes the function to be done twice, the second time the id is 'undefined'. Solution: Validate if the id is 'undefined'.

1.0.5 - Fix bug introduced on 1.0.4. VPAID menu option was missing a quote.

1.0.6 - Create function to display controls from menu.
		Added 'About' menu option.
		Added link to API Documentation.

1.0.7 - Add name 'Ooyala Playground'