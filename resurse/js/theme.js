document.addEventListener('DOMContentLoaded', () => {
	const themeToggle = document.getElementById('theme-toggle');
	const themeIcon = document.getElementById('theme-icon');

	// Check for saved theme preference
	const savedTheme = localStorage.getItem('theme') || 'light';
	document.documentElement.setAttribute('data-theme', savedTheme);
	updateIcon(savedTheme);

	// Toggle theme
	themeToggle.addEventListener('click', () => {
		console.log('aiaus');
		const currentTheme =
			document.documentElement.getAttribute('data-theme');
		const newTheme = currentTheme === 'light' ? 'dark' : 'light';

		document.documentElement.setAttribute('data-theme', newTheme);
		localStorage.setItem('theme', newTheme);
		updateIcon(newTheme);
	});

	function updateIcon(theme) {
		themeIcon.className =
			theme === 'light' ? 'bi bi-sun-fill' : 'bi bi-moon-fill';
	}
});
