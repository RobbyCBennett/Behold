// Global Variables
inConfigWindow = true;

// Helper Functions
function getNestedObject(object, strings) {
	if (!object)
		return null;
	for (string of strings) {
		object = object[string];
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

function closeWindow() {
	window.close();
}
document.getElementById('close').onclick = closeWindow;

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

// Working Hours
beginTimeField = document.getElementById('beginTime');
endTimeField = document.getElementById('endTime');
function loadWorkingTime() {
	get(null, (result) => {
		beginTime = result.beginTime;
		endTime = result.endTime;

		if (beginTime)
			beginTimeField.value = beginTime;
		if (endTime)
			endTimeField.value = endTime;
	});
}
loadWorkingTime();
function changeWorkingTime(event) {
	key = event.target.id;
	value = event.target.value;

	// Set the time
	set({[key]: value}, () => {

		// Toggle the working mode switch when the work time is changed
		get(null, (result) => {
			beginTime = result.beginTime;
			endTime = result.endTime;
			currentTime = time();
			workMode = result.workMode;
			if (beginTime && endTime) {
				begin = timeCompare(currentTime, beginTime);
				end = timeCompare(currentTime, endTime);
				duringWorkingTime = (begin == '>' || begin == '=') && end == '<';
				if (duringWorkingTime && !workMode || !duringWorkingTime && workMode) {
					workModeSwitch.click();
				}
			}
		});
	});
}
beginTimeField.onchange = changeWorkingTime;
endTimeField.onchange = changeWorkingTime;

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
function updateGraph(period) {
	get('distractions', (result) => {
		distractions = result.distractions;

		if (period == 'daily') {
			// Get the last 7 days
			total = 0;
			max = 0;
			dayDistractions = [];
			day = new Date();
			for (i=0; i<7; i++) {
				distraction = getNestedObject(distractions, [year(day), month(day), date(day)]);
				if (distraction) {
					total += distraction;
					dayDistractions.push(distraction);
					if (distraction > max)
						max = distraction;
				}
				else {
					dayDistractions.push(0);
				}
				day.setDate(day.getDate() - 1);
			}

			// Round max up to the nearest 4, because there are 4 y-axis labels
			yAxisLabels = 4;
			max += (yAxisLabels - max % yAxisLabels);

			// Get divs
			daily = document.getElementById('daily');
			bars = daily.getElementsByClassName('bars')[0];
			yAxis = daily.getElementsByClassName('yAxis')[0];
			xAxis = daily.getElementsByClassName('xAxis')[0];

			// Clear
			bars.innerHTML = '';
			yAxis.innerHTML = '';
			xAxis.innerHTML = '';

			// Set total
			document.getElementById('total').innerHTML = total;
			document.getElementById('timeSpan').innerHTML = 'reminders in the last 7 days';

			// Create y-axis
			for (i=0; i<=yAxisLabels; i++) {
				yAxis.innerHTML += '<p>' + (i/yAxisLabels * max) + '</p>';
			}

			// Create x-axis
			weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
			i = weekday() + 1;
			if (i == 7)
				i = 0;
			while (i != weekday()) {
				xAxis.innerHTML += '<p>' + weekdays[i] + '</p>';
				i += 1;
				if (i == 7)
					i = 0;
			}
			xAxis.innerHTML += '<p>' + weekdays[i] + '</p>';

			// Create bars
			for (i=6; i>=0; i--) {
				height = (dayDistractions[i] / max * 100);
				bars.innerHTML += '<div class="bar" style="height: ' + height + '%;"></div>';
			}
		}

		else if (period == 'weekly') {
			// Get the last 8 weeks
			total = 0;
			max = 0;
			weekDistractions = [];
			day = new Date();
			for (i=0; i<8; i++) {
				weekDistractions.push(0);
				distraction = getNestedObject(distractions, [year(day), month(day), date(day)]);
				if (!distraction)
					distraction = 0;
				weekDistractions[i] += distraction;
				while (day.getDay() != 0) {
					day.setDate(day.getDate() - 1);
					distraction = getNestedObject(distractions, [year(day), month(day), date(day)]);
					if (!distraction)
						distraction = 0;
					weekDistractions[i] += distraction;
				}
				day.setDate(day.getDate() - 1);
				total += weekDistractions[i];
				if (weekDistractions[i] > max)
					max = weekDistractions[i];
			}

			// Round max up to the nearest 4, because there are 4 y-axis labels
			yAxisLabels = 4;
			max += (yAxisLabels - max % yAxisLabels);

			// Get divs
			weekly = document.getElementById('weekly');
			bars = weekly.getElementsByClassName('bars')[0];
			yAxis = weekly.getElementsByClassName('yAxis')[0];
			xAxis = weekly.getElementsByClassName('xAxis')[0];

			// Clear
			bars.innerHTML = '';
			yAxis.innerHTML = '';
			xAxis.innerHTML = '';

			// Set total
			document.getElementById('total').innerHTML = total;
			document.getElementById('timeSpan').innerHTML = 'reminders in the last 8 weeks';

			// Create y-axis
			for (i=0; i<=yAxisLabels; i++) {
				yAxis.innerHTML += '<p>' + (i/yAxisLabels * max) + '</p>';
			}

			// Create x-axis
			weeks = ['7', '6', '5', '4', '3', '2', '1', '0'];
			for (i=0; i<weeks.length; i++) {
				xAxis.innerHTML += '<p>' + weeks[i] + '</p>';
			}

			// Create bars
			for (i=7; i>=0; i--) {
				height = (weekDistractions[i] / max * 100);
				bars.innerHTML += '<div class="bar" style="height: ' + height + '%;"></div>';
			}
		}

		else if (period == 'monthly') {
			// Get the last 12 months
			total = 0;
			max = 0;
			monthDistractions = [];
			day = new Date();
			day.setDate(1);
			for (i=0; i<12; i++) {
				distraction = getNestedObject(distractions, [year(day), month(day), 'total']);
				if (distraction) {
					total += distraction;
					monthDistractions.push(distraction);
					if (distraction > max)
						max = distraction;
				}
				else {
					monthDistractions.push(0);
				}
				day.setMonth(day.getMonth() - 1);
			}

			// Round max up to the nearest 4, because there are 4 y-axis labels
			yAxisLabels = 4;
			max += (yAxisLabels - max % yAxisLabels);

			// Get divs
			monthly = document.getElementById('monthly');
			bars = monthly.getElementsByClassName('bars')[0];
			yAxis = monthly.getElementsByClassName('yAxis')[0];
			xAxis = monthly.getElementsByClassName('xAxis')[0];

			// Clear
			bars.innerHTML = '';
			yAxis.innerHTML = '';
			xAxis.innerHTML = '';

			// Set total
			document.getElementById('total').innerHTML = total;
			document.getElementById('timeSpan').innerHTML = 'reminders in the last 12 months';

			// Create y-axis
			for (i=0; i<=yAxisLabels; i++) {
				yAxis.innerHTML += '<p>' + (i/yAxisLabels * max) + '</p>';
			}

			// Create x-axis
			months = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
			i = monthNumber();
			if (i == 12)
				i = 0;
			while (i != monthNumber() - 1) {
				xAxis.innerHTML += '<p>' + months[i] + '</p>';
				i += 1;
				if (i == 12)
					i = 0;
			}
			xAxis.innerHTML += '<p>' + months[i] + '</p>';

			// Create bars
			for (i=11; i>=0; i--) {
				height = (monthDistractions[i] / max * 100);
				bars.innerHTML += '<div class="bar" style="height: ' + height + '%;"></div>';
			}
		}

	});
}

dailyButton = document.getElementById('dailyButton');
weeklyButton = document.getElementById('weeklyButton');
monthlyButton = document.getElementById('monthlyButton');

dailySection = document.getElementById('daily');
weeklySection = document.getElementById('weekly');
monthlySection = document.getElementById('monthly');

function viewDaily() {
	dailyButton.classList = 'selected';
	weeklyButton.classList = '';
	monthlyButton.classList = '';

	dailySection.classList = '';
	weeklySection.classList = 'hidden';
	monthlySection.classList = 'hidden';

	updateGraph('daily');
}
dailyButton.onclick = viewDaily;

function viewWeekly() {
	dailyButton.classList = '';
	weeklyButton.classList = 'selected';
	monthlyButton.classList = '';

	dailySection.classList = 'hidden';
	weeklySection.classList = '';
	monthlySection.classList = 'hidden';

	updateGraph('weekly');
}
weeklyButton.onclick = viewWeekly;

function viewMonthly() {
	dailyButton.classList = '';
	weeklyButton.classList = '';
	monthlyButton.classList = 'selected';

	dailySection.classList = 'hidden';
	weeklySection.classList = 'hidden';
	monthlySection.classList = '';

	updateGraph('monthly');
}
monthlyButton.onclick = viewMonthly;
