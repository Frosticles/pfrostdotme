if (window.location.pathname.includes("/blog/"))
{
	WebFont.load({ 
		custom: {
			families:  ['Roboto Mono', 'Fira Sans'],
			urls: ['../fonts/roboto/roboto.css', '../fonts/fira/fira.css']
		}
	});
}
else
{
	WebFont.load({ 
		custom: {
			families: ['Roboto Mono', 'Fira Sans'],
			urls: ['fonts/roboto/roboto.css', 'fonts/fira/fira.css']
		}
	});
}





class common {
	readyFunction() 
	{
		this.initTypewritter();
		this.initHamburger();
		this.initSlideshow();
		this.initAddressBarAnimation();
	}

	initAddressBarAnimation()
	{
		var frameIndex = 0
		var frameCount = 0
		var advanceRight = true
		var countUp = true
		const animationFrames = [
			'(•_•)', 10,
			'(\u0701•_•)', 12,
			'(\u0701•_•)>⌐◾-◾', 13,
			'(\u0701•⌐)>-◾', 14,
			'(\u0701◾_◾)', 15,
			'(◾_◾)', 25
		];

		setInterval(function() 
		{ 
			let frameUpdate = (decodeURI(window.location.hash) != ('#' + animationFrames[frameIndex]))
			
			if (frameUpdate == true)
			{
				window.location.replace('#' + animationFrames[frameIndex])
			}

			
			if (frameIndex >= (animationFrames.length - 2)) {
				advanceRight = false;
			} else if (frameIndex <= 0) {
				advanceRight = true;
			}

			if (frameCount >= animationFrames[(animationFrames.length - 1)]) {
				countUp = false;
			} else if (frameCount <= 0) {
				countUp = true;
			}

			if ((frameCount >= animationFrames[frameIndex + 1]) && (advanceRight == true)) {
				frameIndex += 2
			} else if ((frameCount <= animationFrames[frameIndex - 1]) && (advanceRight == false)) {
				frameIndex -= 2
			}

			frameCount += countUp ? 1 : -1
		}, 100);
	}

	initSlideshow()
	{
		function transitionPicture(picture)
		{
			for (let i = 0; i < picture.length; i++) 
			{
				if (picture[i].style.opacity != 0)
				{
					let nextPicture = (i == (picture.length - 1)) ? 0 : (i + 1);
					picture[i].style.opacity = 0;
					picture[nextPicture].style.display = 'inline';
					
					// The timeout is to fix a really annoying bug where if the display
					// style changes at the same time as the opacity, the css animation
					// won't occur, and the image will just pop in.
					setTimeout(() => { picture[nextPicture].style.opacity = 1; }, 100);
					return;
				}
			}
			console.log("Hmm, didn't find a frame in there with a non-zero opacity: " + picture);
		}

		if (document.getElementById("slideshow")) 
		{

			setInterval(function() 
			{ 
				if (document.hasFocus()) 
				{
					transitionPicture(document.getElementById("slideshow").querySelectorAll("div"));
				}
			}, (4000 + (Math.random()*2000)));

			setInterval(function() 
			{ 
				if (document.hasFocus()) 
				{
					transitionPicture(document.getElementById("slideshow2").querySelectorAll("div"));
				}
			}, (4000 + (Math.random()*2000)));

			setInterval(function() 
			{ 
				if (document.hasFocus()) 
				{
					transitionPicture(document.getElementById("slideshow3").querySelectorAll("div"));
				}
			}, (4000 + (Math.random()*2000)));

			setInterval(function() 
			{ 
				if (document.hasFocus()) 
				{
					transitionPicture(document.getElementById("slideshow4").querySelectorAll("div"));
				}
			}, (4000 + (Math.random()*2000)));
		}
	}

	initHamburger()
	{
		var hamburger = document.querySelector(".hamburger");
		var sideMenu = document.querySelector(".sidenav");
					
		hamburger.addEventListener("click", function() 
		{
			sideMenu.classList.toggle("is-active");  
			hamburger.classList.toggle("is-active");
			
			if (hamburger.classList.contains("is-active")) 
			{
				document.getElementById("menu-hamburger").style.transform = "translate3d(250px, 0, 0)";

			}
			else 
			{
				document.getElementById("menu-hamburger").style.transform = "translate3d(0px, 0, 0)";
			}
		});
	}

	initTypewritter()
	{
		const lines = [
			"What... is the capital of Assyria?",
			"'Tis but a scratch!",
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
			"Life is like a box of chocolates.",
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
			"Good morning Vietnam!",
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
			"imprecise bus fault",
			"for (uint8_t i = 0; i < 256; i++) {}",
			"you can't fight in here, this is the war room!",
			"0x8BADF00D",
			"Sometimes, I dream about cheese"
		];
		const titleTxt = 'Peter Frost';
		const numSpins = 4;
		var frameCount = 0;
		var jumboTxt = lines[Math.floor(Math.random() * lines.length)] + " ";
		var typeInverval = 80;
		var numSpaces = 0;
		var jumbotronElement = document.getElementById("jumbotron");

		if (jumbotronElement) 
		{
			if (jumbotronElement.title.length > 0)
			{
				jumboTxt = jumbotronElement.title
			}
		}

		var jumbotronTimer = setInterval(jumbotronTypewriter, typeInverval);

		function jumbotronTypewriter() 
		{ 
			if (frameCount < numSpins)
			{
				switch (jumbotronElement.innerHTML) {
					case '|':
						jumbotronElement.innerHTML = '/';
						break;
					case '/':
						jumbotronElement.innerHTML = '—';
						break;
					case '—':
						jumbotronElement.innerHTML = '\\';
						break;
					case '\\':
						jumbotronElement.innerHTML = '|';
						document.title += '.';
						frameCount++;
						break;
				}
			}
			else
			{
				if (frameCount == numSpins)
				{
					jumbotronElement.innerHTML = '';
					document.title = '';
				}

				if (jumbotronElement.innerHTML.length < jumboTxt.length) 
				{
					jumbotronElement.innerHTML += jumboTxt.charAt(frameCount - numSpins);
				}

				if (document.title.length < titleTxt.length)
				{
					var stringToAdd = titleTxt.charAt((frameCount - numSpins) + numSpaces);

					if (stringToAdd == ' ') 
					{
						stringToAdd += titleTxt.charAt((frameCount - numSpins) + numSpaces + 1);
						numSpaces++;
					}
					document.title += stringToAdd;
				}

				if ((jumbotronElement.innerHTML.length >= jumboTxt.length) && 
					(document.title.length >= titleTxt.length))
				{
					clearInterval(jumbotronTimer);
				}
				frameCount++;
			}
		}
	}
}

const commonScript = new common();

if (document.readyState === "complete" ||
	(document.readyState !== "loading" && !document.documentElement.doScroll)) 
{
	commonScript.readyFunction();
} 
else 
{
	document.addEventListener("DOMContentLoaded", commonScript.readyFunction());
}
