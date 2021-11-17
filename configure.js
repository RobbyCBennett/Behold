// Helper Functions
function getNestedObject(object, strings) {
	if (!object)
		return null;
	for (string of strings) {
		object = object[string]
		if (!object)
			return null;
	}
	return object;
}

// Page Navigation
function back() {
	main = document.getElementById('main');
	summary = document.getElementById('summary');

	main.classList.remove('hidden');
	summary.classList.add('hidden');
}
document.getElementById('back').onclick = back;

function summary() {
	main = document.getElementById('main');
	summary = document.getElementById('summary');

	main.classList.add('hidden');
	summary.classList.remove('hidden');

	viewDaily();
}
document.getElementById('summaryButton').onclick = summary;


// Toggle Work Mode
workModeSwitch = document.getElementById('workMode');
workModeSwitch.onclick = changeWorkMode;
get('workMode', (result) => {
	workMode = result.workMode;
	workModeSwitch.checked = workMode;
});

// Toggle Sound Mode
function changeSoundMode() {
	get('soundMode', (result) => {
		soundMode = result.soundMode;
		set({'soundMode': !soundMode});
	});
}
soundModeSwitch = document.getElementById('sound');
soundModeSwitch.onclick = changeSoundMode;
get('soundMode', (result) => {
	soundMode = result.soundMode;
	soundModeSwitch.checked = soundMode;
});

// Graph Navigation
dailyButton = document.getElementById('dailyButton');
weeklyButton = document.getElementById('weeklyButton');
monthlyButton = document.getElementById('monthlyButton');

function updateGraph(period) {
	get('distractions', (result) => {
		distractions = result.distractions;

		if (period == 'daily') {
			// Get info
			date = getNestedObject(distractions, year(), month(), date());

			// Get divs
			daily = document.getElementById('daily');
			bars = daily.getElementsByClassName('bars')[0];
			yAxis = daily.getElementsByClassName('yAxis')[0];

			// Clear
			bars.innerHTML = '';
			yAxis.innerHTML = '';
			xAxis.innerHTML = '';

			// Create x axis
		}
	});
}

function viewDaily() {
	dailyButton.classList = 'selected';
	weeklyButton.classList = '';
	monthlyButton.classList = '';
	updateGraph('daily');
}
dailyButton.onclick = viewDaily;

function viewWeekly() {
	dailyButton.classList = '';
	weeklyButton.classList = 'selected';
	monthlyButton.classList = '';
	updateGraph('weekly');
}
weeklyButton.onclick = viewWeekly;

function viewMonthly() {
	dailyButton.classList = '';
	weeklyButton.classList = '';
	monthlyButton.classList = 'selected';
	updateGraph('monthly');
}
monthlyButton.onclick = viewMonthly;
