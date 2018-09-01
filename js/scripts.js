WebFont.load({
custom: {
	families: ['Roboto Mono', 'Fira Sans'],
	urls: ['/Roboto-Mono/roboto.css', '/Fira-Lightened/fira.css']
	}
});

$(document).ready(function() {

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
		Jumbotron typewriter code 
	*/

	var jumboCount = 0;
	var jumboTxt = 'hello world ';
	var typeSpeed = 80;
	var spinSpeed = 80;

	if (document.getElementById("jumbotron")) {
		setTimeout(spinner0, 500);
	}
		
	function typeWriter() {
		if (jumboCount < jumboTxt.length) {
			document.getElementById("jumbotron").innerHTML += jumboTxt.charAt(jumboCount);
		}

		if (jumboCount < jumboTxt.length) {
			jumboCount++;
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
		if (jumboCount < 4){
			document.getElementById("jumbotron").innerHTML = '|';
			setTimeout(spinner1, spinSpeed);
			jumboCount++;
		} else {
			jumboCount = 0;
			document.getElementById("jumbotron").innerHTML = '';
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
		Document title typewriter code 
	*/

	var titleCount = 0;
	var titleTxt = 'Peter Frost';
	setTimeout(titleSpinner, 500);
		
	function titleTypeWriter() {
		if (titleCount < titleTxt.length) {
			var stringToAdd = titleTxt.charAt(titleCount);

			if (stringToAdd == ' ') {
				stringToAdd += titleTxt.charAt(titleCount + 1);
				titleTxt = titleTxt.slice(0, titleCount) + titleTxt.slice(titleCount + 1);
			}
			document.title += stringToAdd;
		}

		if (titleCount < titleTxt.length) {
			titleCount++;
			setTimeout(titleTypeWriter, typeSpeed);
		}
	}

	function titleSpinner() {
		if (titleCount < 4){
			document.title += '. ';
			setTimeout(spinner1, spinSpeed);
			titleCount++;
		} else {
			titleCount = 0;
			document.title = '';
			typeWriter();
		}
	}

	/*
		Slideshow functions for all the hero images
	*/

	if (document.getElementById("slideshow")) {

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
	}

	/*
		Code to update hamburger menu
	*/
	
	if (document.getElementById("jumbotron")) {
		$("#jumbotron").on('DOMSubtreeModified', function() {
			if (($("#jumbotron").html() === atob('YXBwbGU=')) && ($("#mySidenav > a").length === 1)) {
				$("#mySidenav").append(atob('PGEgaHJlZj0iZGlyZWN0b3J5ZG9lc25vdGV4aXN0L0QtTElOS05BUy8iPk5BUzwvYT4KPGEgaHJlZj0idHJ1bXBkaWQ5MTEuaHRtbCI+VHJ1bXA8L2E+'));
			}
		});
	}
});