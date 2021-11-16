function back() {
	main = document.getElementById('main');
	summary = document.getElementById('summary');

	main.classList = '';
	summary.classList = 'hidden';
}
document.getElementById('back').onclick = back;

function summary() {
	main = document.getElementById('main');
	summary = document.getElementById('summary');

	main.classList = 'hidden';
	summary.classList = '';
}
document.getElementById('summaryButton').onclick = summary;
