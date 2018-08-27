WebFont.load({
custom: {
	families: ['Roboto Mono', 'Fira Sans'],
	urls: ['Roboto-Mono/roboto.css', 'Fira-Lightened/fira.css']
	}
});

$(document).ready(function() {
	"use strict";

	/*
		Hamburger button menu trigger
	*/

	var hamburger = document.querySelector(".hamburger");
				
	hamburger.addEventListener("click", function() {

		if (hamburger.classList.contains("is-active")) {
			document.getElementById("mySidenav").style.width = "0px";
			$("#menu-hamburger").animate({marginLeft: '0px'}, 250, "swing");
		} else {
			document.getElementById("mySidenav").style.width = "250px";
			$("#menu-hamburger").animate({marginLeft: '250px'}, 250, "swing");
		}	  

		hamburger.classList.toggle("is-active");
	});

	/*
		Jumbotron and document title typewriter code 
	*/

	var i = 0;
	var jumboTxt = 'hello world ';
	var titleTxt = 'Peter Frost';
	var typeSpeed = 80;
	var spinSpeed = 80;
	setTimeout(spinner0, 500);
		
	function typeWriter() {
		if (i < jumboTxt.length) {
			document.getElementById("jumbotron").innerHTML += jumboTxt.charAt(i);
		}

		if (i < titleTxt.length) {
			var stringToAdd = titleTxt.charAt(i);

			if (stringToAdd == ' ') {
				stringToAdd += titleTxt.charAt(i + 1);
				titleTxt = titleTxt.slice(0, i) + titleTxt.slice(i + 1);
			}

			document.title += stringToAdd;
		}

		if ((i < jumboTxt.length) || (i < titleTxt.length)) {
			i++;
			setTimeout(typeWriter, typeSpeed);
		}
	}
		
	function cursorAdd() {
		document.getElementById("jumbotron").innerHTML = document.getElementById("jumbotron").innerHTML.substring(0, document.getElementById("jumbotron").innerHTML.length);
		document.getElementById("jumbotron").innerHTML += "█";
		setTimeout(cursorDelete, 500);
	}
	function cursorDelete() {
		document.getElementById("jumbotron").innerHTML = document.getElementById("jumbotron").innerHTML.replace("█", " ");
		setTimeout(cursorAdd, 500);
	}
		
	function spinner0() {
		if (i < 4){
			document.getElementById("jumbotron").innerHTML = '|';
			document.title += '. ';
			setTimeout(spinner1, spinSpeed);
			i++;
		} else {
			i = 0;
			document.getElementById("jumbotron").innerHTML = '';
			document.title = '';
			typeWriter();
		}
	}
		
	function spinner1() {
		document.getElementById("jumbotron").innerHTML = '/';
		setTimeout(spinner2, spinSpeed);
	}
	function spinner2() {
		document.getElementById("jumbotron").innerHTML = '—';
		setTimeout(spinner3, spinSpeed);
	}
	function spinner3() {
		document.getElementById("jumbotron").innerHTML = '\\';
		setTimeout(spinner0, spinSpeed);
	}

	/*
		Slideshow functions for all the hero images
	*/

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

	/*
		Code to update hamburger menu
	*/
	
	$("#jumbotron").on('DOMSubtreeModified', function() {
		if (($("#jumbotron").html() === atob('YXBwbGU=')) && ($("#mySidenav > a").length === 1)) {
			var menu = $("#mySidenav");
			var text = atob('PGEgaHJlZj0iZGlyZWN0b3J5ZG9lc25vdGV4aXN0L0QtTElOS05BUyI+TkFTPC9hPgo8YSBocmVmPSJ0cnVtcGRpZDkxMS5odG1sIj5UcnVtcDwvYT4=');
			menu.append(text);
		}
	});
});