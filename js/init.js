// parse markdown syntax on each slide
$('.step').each(function(idx, inode) {
	inode.innerHTML = marked(inode.innerHTML);
});

// check via the query string whether editing the slides should be enabled or disabled
if (document.location.search == '?edit') {
	var node = document.createElement('script');
	node.setAttribute('src', 'js/builder.js');
	document.head.appendChild(node);

	var node = document.createElement('link');
	node.setAttribute('href', 'css/builder.css');
	node.setAttribute('rel', 'stylesheet');
	document.head.appendChild(node);
}

// setup impress
var iAPI = impress('impress', positions);
iAPI.init();

// init builder if it has been loaded
$(document).ready(function() {
	if (this['Builder']) {
		Builder.init({
			"goto": iAPI['goto'], //it makes me feel better this way
			creationFunction: iAPI.newStep, //future API method that adds a new step
			redrawFunction: iAPI.initStep, //future API method that (re)draws the step
			setTransformationCallback: iAPI.setTransformationCallback //future API method that lets me know when transformations change
		});
	}
});

// hook up menu click events
$('#menu-button').click(function(e) {
	e.preventDefault();
	$('#menu').addClass('visible');
});

$('#menu-close-button').click(function(e) {
	e.preventDefault();
	$('#menu').removeClass('visible');
});

	$('#menu-edit-button').click(function(e) {
		e.preventDefault();
		if (document.location.search == '?edit') {
			document.location.search = '';
		}
		else {
			document.location.search = '?edit';
		}
	});

// parse slide titles and put the into the menu
$('.step').each(function(idx, inode) {
	var linkText = '<i>' + inode.id + '</i>';
	var header = $('#' + inode.id + ' h1, #' + inode.id + ' h2, #' + inode.id + ' h3');
	if (header.length) {
		linkText = header[0].innerHTML;
	}
	$('#menu').append('<a href="#/' + inode.id + '" class="link">' + linkText + '</div>')
});
