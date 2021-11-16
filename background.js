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

function year() {
	today = new Date();
	yyyy = today.getFullYear();
	return 'year' + yyyy;
}
function month() {
	today = new Date();
	mm = String(today.getMonth() + 1).padStart(2, '0');
	return 'month' + mm;
}
function date() {
	today = new Date();
	dd = String(today.getDate()).padStart(2, '0');
	return 'date' + dd;
}

function debugStorage() {
	get(null, (result) => {
		console.log(result);
	});
}

// Functions
function addDistraction() {
	get('distractions', (result) => {
		// Get distractions and current day
		distractions = result.distractions;
		currentYear = year();
		currentMonth = month();
		currentDate = date();

		// Make the missing objects
		if (! distractions)
			distractions = {'total': 0};
		if (! distractions[currentYear])
			distractions[currentYear] = {'total': 0};
		if (! distractions[currentYear][currentMonth])
			distractions[currentYear][currentMonth] = {'total': 0};
		if (! distractions[currentYear][currentMonth][currentDate])
			distractions[currentYear][currentMonth][currentDate] = 0;

		// Add one to each total
		distractions['total'] += 1;
		distractions[currentYear]['total'] += 1;
		distractions[currentYear][currentMonth]['total'] += 1;
		distractions[currentYear][currentMonth][currentDate]['total'] += 1;

		// Save the distractions object
		set({'distractions': distractions}, debugStorage);
	});
}

function warning() {
	get('workMode', (result) => {
		if (result.workMode) {
			var sound = new Audio('buzzing.wav');
			sound.play();

			addDistraction();

			// alert('Get back to work!');
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
				console.log('1 second')
			}, 1000);
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
	} else if (command == 'debug') {
		set({'workMode': true}, (result) => {
			warning();
		});
	}
});
