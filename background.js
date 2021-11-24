// Global Variables
seconds = 15;
idleInterval = null;
workingHoursInterval = null;
inConfigWindow = false;

// API Helper Functions
function get(key, callback = null) {
	chrome.storage.local.get(key, callback);
}
function set(keyValue, callback = null) {
	chrome.storage.local.set(keyValue, callback);
}

function year(day=new Date()) {
	yyyy = day.getFullYear();
	return 'year' + yyyy;
}
function monthNumber(day=new Date()) {
	return day.getMonth() + 1;
}
function month(day=new Date()) {
	mm = String(day.getMonth() + 1).padStart(2, '0');
	return 'month' + mm;
}
function date(day=new Date()) {
	dd = String(day.getDate()).padStart(2, '0');
	return 'date' + dd;
}
function weekday(day=new Date()) {
	return day.getDay();
}
function time(day=new Date()) {
	return String(day.getHours()).padStart(2, '0') + ':' + String(day.getMinutes()).padStart(2, '0');
}
function timeCompare(time1, time2) {
	time1 = time1.split(':');
	time2 = time2.split(':');
	hours1 = parseInt(time1[0]);
	hours2 = parseInt(time2[0]);
	minutes1 = parseInt(time1[1]);
	minutes2 = parseInt(time2[1]);
	totalMinutes1 = hours1 * 60 + minutes1;
	totalMinutes2 = hours2 * 60 + minutes2;

	if (totalMinutes1 < totalMinutes2)
		return '<';
	else if (totalMinutes1 > totalMinutes2)
		return '>';
	else
		return '=';
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
		distractions[currentYear][currentMonth][currentDate] += 1;

		// Save the distractions object
		set({'distractions': distractions});
	});
}


function warning() {
	get('workMode', (result) => {
		if (result.workMode) {

			chrome.tabs.executeScript(null, {
				file: 'reminder.js'
			}, function(results) {
				poppedUp = results[0];
				if (poppedUp) {
					addDistraction();

					get('soundMode', (result) => {
						if (result.soundMode) {
							var sound = new Audio('buzzing.wav');
							sound.play();
						}
					});
				}
			});

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
		}
		
		else {
			if (withAlerts === true) {
				alert('All done :)');
			}
		}

		set({'workMode': !workMode});
	});
}

idleInterval = setInterval(() => {
	chrome.idle.queryState(seconds, state => {
		if (state == 'idle') {
			warning();
		}
	});
}, 1000);

function checkWorkingHours() {
	workingHoursInterval = setInterval(() => {
		get(null, (result) => {
			beginTime = result.beginTime;
			endTime = result.endTime;
			currentTime = time();

			if (beginTime == currentTime) {
				set({'workMode': true});
				alert('Starting work mode');
			}
			else if (endTime == currentTime) {
				set({'workMode': false});
				alert('All done! :)');
			}
		});
	}, 60 * 1000);
}
checkWorkingHours();

// Main
chrome.commands.onCommand.addListener(command => {
	if (command == 'toggleWorkMode') {
		changeWorkMode(true);
	} else if (command == 'keyTest') {
		set({'workMode': true}, (result) => {
			warning();
		})
	}
});
