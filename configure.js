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
getLocal('workMode', (result) => {
	workMode = result.workMode;
	workModeSwitch.checked = workMode;
});

// Graph Navigation
dailyButton = document.getElementById('dailyButton');
weeklyButton = document.getElementById('weeklyButton');
monthlyButton = document.getElementById('monthlyButton');

function daily() {
	dailyButton.classList = 'selected';
	weeklyButton.classList = '';
	monthlyButton.classList = '';
}
dailyButton.onclick = daily;

function weekly() {
	dailyButton.classList = '';
	weeklyButton.classList = 'selected';
	monthlyButton.classList = '';
}
weeklyButton.onclick = weekly;

function monthly() {
	dailyButton.classList = '';
	weeklyButton.classList = '';
	monthlyButton.classList = 'selected';
}
monthlyButton.onclick = monthly;
