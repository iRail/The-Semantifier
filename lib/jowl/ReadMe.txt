jOWL - Semantic Javascript Library
Released under the MIT license
Version 1.0
Released: 11-03-2009
___________________________________________________________________________________________________________

To use jOWL you need to embed a working copy of jOWL and jQuery on your webpage
Supported Browsers: Internet Explorer 7, Firefox 2 & 3, Opera 0.95, Safari (Webkit browsers).

For jQuery, we recommend using the Google Ajax Library link:
	http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js

jOWL_UI package contains:

scripts/jOWL.js		jOWL core script
scripts/jOWL_UI.js	jOWL User Interface components script

scripts/jquery.tooltip.js	
			a tooltip script, needed if you wish to include tooltip functionality, 
			example at: http://jowl.ontologyonline.org/wine_demo.html

scripts/jOWL_Exhibit.js	
			script that can be used to reproduce the simile Exhibit demo at:
				http://jowl.ontologyonline.org/jOWLExhibit.html

css/jOWL.css		styling for jOWL UI, modify as needed, it is possible to use jQuery themeroller (http://ui.jquery.com/themeroller) version 1.7 css 
			files in combination with these for more flexibility in styling.

img/			images used in the treeView component



Example inclusion:
<header>
	<link rel="stylesheet" href="css/jOWL.css" type="text/css"/>
	<!-- Optional: use jquery ui (1.7) css files <link rel="stylesheet" href="path/to/jquery-ui-themeroller.css" type="text/css"/> -->

	<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js"></script>
	<script type="text/javascript" src="scripts/jOWL.js"></script>
	<script type="text/javascript" src="scripts/jOWL_UI.js"></script>
</header>

Note that the site (http://jowl.ontologyonline.org) makes extensive use of the Blueprint css framework (http://www.blueprintcss.org/), not included in this package.
If you copy-paste HTML from the demo's then you may need to include it to achieve similar results - or define your own styling.

For a list of changes, please refer to http://jowl.ontologyonline.org/changelog.html

The google code site (http://code.google.com/p/jowl-plugin/) also hosts a package called jOWLBrowser.zip. This package contains additional html files and css files that, 
in conjunction with this jOWL release, can be used to quickly set up a generic OWL-DL ontology browser.

____________________________________________________________________________________________________________

Copyright (c) <2009> <David Decraene>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.