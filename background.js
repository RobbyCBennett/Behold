// Global Variables
seconds = 15;
interval = null;

// API Helper Functions
function get(key, callback = null) {
	chrome.storage.local.get(key, callback);
}

function set(keyValue, callback = null) {
	chrome.storage.local.set(keyValue, callback);
}

// Functions
function saveCurrentTime() {
	
}

function warning() {
	get('workMode', (result) => {
		if (result.workMode) {
			alert('Get back to work!');
			var sound = new Audio('buzzing.wav');
			sound.play();
			saveCurrentTime();
		} else {
			clearInterval(interval);
		}
	});
}


function changeWorkMode(withAlerts = false) {
	get('workMode', (result) => {
		workMode = result.workMode;
		if (!workMode) {
			if (withAlerts === true) {
				alert('Starting work mode');
			}

			interval = setInterval(() => {
				chrome.idle.queryState(seconds, state => {
					if (state == 'idle') {
						warning();
					}
				});
			}, seconds * 1000);
		}
		
		else {
			if (withAlerts === true) {
				alert('All done :)');
			}

			clearInterval(interval);
		}

		set({'workMode': !workMode});
	});
}

// Main
chrome.commands.onCommand.addListener(command => {
	if (command == 'toggleWorkMode') {
		changeWorkMode(true);
	}
});

//claire's test comment
