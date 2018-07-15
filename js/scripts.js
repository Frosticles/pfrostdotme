$(document).ready(function() {
	"use strict";
    $("#slideshow > div:gt(0)").hide();

	setInterval(function() { 
		if (document.hasFocus()) {
		  $('#slideshow > div:first')
			.fadeOut(1000)
			.next()
			.fadeIn(1000)
			.end()
			.appendTo('#slideshow');
		}
	},  (4000 + (Math.random()*2000)));
	
	$("#slideshow2 > div:gt(0)").hide();

	setInterval(function() { 
		if (document.hasFocus()) {
		  $('#slideshow2 > div:first')
			.fadeOut(1000)
			.next()
			.fadeIn(1000)
			.end()
			.appendTo('#slideshow2');
		}
	},  (4000 + (Math.random()*2000)));
	
	setInterval(function() { 
		if (document.hasFocus()) {
		  $('#slideshow3 > div:first')
			.fadeOut(1000)
			.next()
			.fadeIn(1000)
			.end()
			.appendTo('#slideshow3');
		}
	},  (4000 + (Math.random()*2000)));
	
	setInterval(function() { 
		if (document.hasFocus()) {
		  $('#slideshow4 > div:first')
			.fadeOut(1000)
			.next()
			.fadeIn(1000)
			.end()
			.appendTo('#slideshow4');
		}
	},  (4000 + (Math.random()*2000)));
});