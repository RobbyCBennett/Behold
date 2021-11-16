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

function viewDaily() {
	dailyButton.classList = 'selected';
	weeklyButton.classList = '';
	monthlyButton.classList = '';
}
dailyButton.onclick = viewDaily;

function viewWeekly() {
	dailyButton.classList = '';
	weeklyButton.classList = 'selected';
	monthlyButton.classList = '';
}
weeklyButton.onclick = viewWeekly;

function viewMonthly() {
	dailyButton.classList = '';
	weeklyButton.classList = '';
	monthlyButton.classList = 'selected';
}
monthlyButton.onclick = viewMonthly;
