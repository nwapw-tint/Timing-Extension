maxInput = 10000;
document.addEventListener('DOMContentLoaded', () => {
	let canvas = document.createElement('canvas');
	let context = canvas.getContext('2d');
	colorWheelImg = document.getElementById('wheel_img');
	canvas.width = colorWheelImg.width;
	canvas.height = colorWheelImg.height;
	console.log(canvas.width, canvas.height);
	context.drawImage(colorWheelImg, 0, 0);
	colorWheelData = context.getImageData(0, 0, colorWheelImg.width, colorWheelImg.height);

	window.addEventListener('mousemove', (e) => {
		mouseX = e.screenX - window.screenX - 11;
		mouseY = e.screenY - window.screenY - 9;
	}, false);

	window.addEventListener('click', (e) => {
		let color = getColorFromWheel(mouseX - colorWheelImg.x, mouseY - colorWheelImg.y);
		if (color)
			if (addToBlacklisted)
				bColor = color;
			else
				nColor = color;
	});
	
	addClickListener('add_session_button', () => {
		var input = document.getElementById('time_input').value;
		if (input.length == 0)
			showError("Input is empty!");
		else if (isNaN(input)) {
			showError("Input is not a number!");
			document.getElementById('time_input').value = "";
		}
		else if (input > maxInput) {
			showError("Input is too high!");
			document.getElementById('time_input').value = "";
		}
		else
			addSession(input);
	});
	
	addClickListener('add_site_button', () => {
		let site = document.getElementById('site_input').value;
		if (site.length == 0)
			showError("Site is empty!");
		else {
			let siteAlreadyBlacklisted = false;
			for (let i = 0; i < blacklistedSites.length && !siteAlreadyBlacklisted; i++)
				if (blacklistedSites[i] == site)
					siteAlreadyBlacklisted = true;
			if (!siteAlreadyBlacklisted) {
				blacklistedSites.push(site);
				sendMessage({
					to: "background",
					from: "popup",
					action: "push",
					place: "blacklistedSites",
					blacklistedSite: site
				});
				document.getElementById('site_input').value = "";
			}
		}
	});
	
	addClickListener('start_session_button', () => {
		if (sessions.length == 0)
			showError("No sessions!");
		else if (sessionRunning)
			showError("Session already started!");
		else {
			sessionRunning = true;
			sendMessage({
				to: "background",
				from: "popup",
				action: "timer",
				mode: "start"
			});
		}
	});
	
	addClickListener('pause_session_button', () => {
		if (!sessionRunning)
			showError("Session not started!");
		else {
			sessionRunning = false;
			sendMessage({
				to: "background",
				from: "popup",
				action: "timer",
				mode: "stop"
			});
		}
	});

	addClickListener('cancel_session_button', () => {
		if (sessions.length == 0)
			showError("No sessions!");
		else {
			sessions.shift();
			if (sessions.length == 0)
				sessionRunning = false;
			updateSessionText();
			sendMessage({
				to: "background",
				from: "popup",
				action: "shift",
				place: "sessions"
			});
		}
	});
	
	addClickListener('whitelisted_radio', () => {
		addToBlacklisted = false;
	});
	
	addClickListener('blacklisted_radio', () => {
		addToBlacklisted = true;
	});
}, false);
