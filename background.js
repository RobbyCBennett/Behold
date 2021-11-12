// Documentation:
// https://developer.chrome.com/docs/extensions/reference/idle/

focusMode = true;

chrome.commands.onCommand.addListener(command => {
	if (command == 'focusMode') {
		if (focusMode) {
			alert('Starting focus mode');
		} else {
			alert('All done :)');
		}

		focusMode = ! focusMode;
	}
});

function warning() {
	if (focusMode) {
		alert('Inactive for 30 seconds');
	}
}

chrome.idle.queryState(30, warning);
