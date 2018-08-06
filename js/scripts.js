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
	
	$("#jumbotron").on('DOMSubtreeModified', function() {
		if (document.getElementById("jumbotron").innerHTML === atob('YXBwbGU=')) {
			var menu = $("#mySidenav");
			var text = atob('PGEgaHJlZj0iZGlyZWN0b3J5ZG9lc25vdGV4aXN0L0QtTElOS05BUyI+TkFTPC9hPgo8YSBocmVmPSJ0cnVtcGRpZDkxMS5odG1sIj5UcnVtcDwvYT4=');
			menu.append(text);
		}
	});
});