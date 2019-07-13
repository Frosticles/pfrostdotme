WebFont.load({
custom: {
	families: ['Roboto Mono', 'Fira Sans'],
	urls: ['/Roboto-Mono/roboto.css', '/Fira-Lightened/fira.css']
	}
});

var lines = [
	"What... is the capital of Assyria",
	"\'Tis but a scratch!",
	"some farcical aquatic ceremony.",
	"Right. One... two... five!",
	"It's just a flesh wound.",
	"Ni!",
	"Help! Help! I'm being repressed!",
	"We're an anarcho-syndicalist commune",
	"A scratch? Your arm's off!",
	"You've got no arms left!",
	"What have the Romans ever done for us?",
	"Yippee-ki-yay.",
	"Life was like a box of chocolates.",
	"Run, Forrest! Run!",
	"Pining for the fjords",
	"This... is an ex parrot",
	"They'll never take our freedom!",
	"Are you not entertained‽",
	"It's one louder than 10",
	"The Royale with cheese.",
	"Wax on, wax off.",
	"hello world",
	"0xDEADBEEF",
	"Good morning, Vietnam!",
	"My precious.",
	"It's alive!",
	"Go ahead, make my day.",
	"Do I feel lucky?",
	"I'm having an old friend for dinner.",
	"Shaken, not stirred.",
	"We don't need roads.",
	"Say hello to my little friend!",
	"And don't call me Shirley.",
	"Here's Johnny!",
	"Houston, we have a problem.",
	"You can't handle the truth!",
	"I'll be back.",
	"Why... so... serious?",
	"I am your father.",
	"You don't talk about Fight Club.",
	"You're gonna need a bigger boat.",
	"Good luck, we're all counting on you.",
	"foobar",
	"0xA5A5A5A5",
	"undefined reference",
	"#define + -",
	"precise bus fault",
	"for (char i = 0; i < 256; i++) {}"
];

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
	var jumboTxt = lines[Math.floor(Math.random * lines.length)];
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
		if (titleCount < 3){
			document.title += '.';
			setTimeout(titleSpinner, 500);
			titleCount++;
		} else {
			titleCount = 0;
			document.title = '';
			titleTypeWriter();
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
