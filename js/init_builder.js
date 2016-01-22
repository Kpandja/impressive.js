// init builder if it has been loaded
if (this['Builder']) {
	Builder.init({
		"goto": iAPI['goto'], //it makes me feel better this way
		creationFunction: iAPI.newStep, //future API method that adds a new step
		redrawFunction: iAPI.initStep, //future API method that (re)draws the step
		setTransformationCallback: iAPI.setTransformationCallback //future API method that lets me know when transformations change
	});
}

