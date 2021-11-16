// Global Variables
focusMode = false;
seconds = 15;
interval = null;

// Functions
function warning() {
	alert('Get back to work!');
}

// Main
chrome.commands.onCommand.addListener(command => {
	if (command == 'toggleFocusMode') {

		if (focusMode) {
			alert('Starting focus mode');

			interval = setInterval(() => {
				chrome.idle.queryState(seconds, state => {
					if (state == 'idle') {
						warning();
					}
				});
			}, seconds * 1000);
		}
		
		else {
			alert('All done :)');

			clearInterval(interval);
		}

		focusMode = ! focusMode;

	}
});
