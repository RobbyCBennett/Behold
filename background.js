// Global Variables
seconds = 15;
interval = null;

// API Helper Functions
function getLocal(key, callback = null) {
	chrome.storage.local.get(key, callback);
}

function setLocal(keyValue, callback = null) {
	chrome.storage.local.set(keyValue, callback);
}

function getSync(key, callback = null) {
	chrome.storage.sync.get(key, callback);
}

function setSync(keyValue, callback = null) {
	chrome.storage.sync.set(keyValue, callback);
}

// Functions
function saveCurrentTime() {
	
}

function warning() {
	getLocal('workMode', (result) => {
		if (result.workMode) {
			alert('Get back to work!');
			saveCurrentTime();
		} else {
			clearInterval(interval);
		}
	});
}

function changeWorkMode(withAlerts = false) {
	getLocal('workMode', (result) => {
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

		setLocal({'workMode': !workMode});
	});
}

// Main
chrome.commands.onCommand.addListener(command => {
	if (command == 'toggleWorkMode') {
		changeWorkMode(true);
	}
});
