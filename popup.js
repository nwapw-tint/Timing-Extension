var port = chrome.extension.connect({
	name: "popup"
});

//Tells the background script the popup script has opened
sendMessage({
	to: "background",
	from: "popup",
	action: "open"
});

//Creates the capability to receive messages from the background script
port.onMessage.addListener((msg) => {
	console.log("popup recieve");
	if (msg.to == "popup") {
		console.log("popup accept");
		console.log(msg);
	} else
		console.log("popup reject");
});

//Creates the capability to send messages to the background script
function sendMessage(msg) {
	console.log("popup send");
	port.postMessage(msg);
}



/*-------------------------End of Communication-------------------------*/



