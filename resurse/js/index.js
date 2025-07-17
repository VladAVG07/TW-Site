window.addEventListener('DOMContentLoaded', function () {
	const ofertaDiv = document.getElementById('oferta-anunt');
	if (!ofertaDiv) return;

	let dataFinalizareStr = ofertaDiv.getAttribute('data-finalizare');
	if (!dataFinalizareStr) return;

	let dataFinalizare = new Date(dataFinalizareStr);

	function updateOfertaNoua(oferta) {
		ofertaDiv.querySelector(
			'h3'
		).textContent = `Ofertă Specială la ${oferta.categorie}!`;
		ofertaDiv.querySelector('strong').textContent = `${oferta.reducere}%`;
		dataFinalizare = new Date(oferta.dataFinalizare);
		ofertaDiv.setAttribute('data-finalizare', oferta.dataFinalizare);
		document.getElementById('oferta-expira').textContent =
			dataFinalizare.toLocaleString('ro-RO');
	}

	function updateTimer() {
		const now = new Date();
		let diff = Math.floor((dataFinalizare - now) / 1000);
		if (diff < 0) diff = 0;
		const h = Math.floor(diff / 3600);
		const m = Math.floor((diff % 3600) / 60);
		const s = diff % 60;
		const timerElem = document.getElementById('timer-oferta');
		timerElem.textContent = `${h}h ${m}m ${s}s`;
		// Schimbă culoarea în ultimele 10 secunde
		if (diff <= 10) {
			timerElem.style.color = 'red';
			timerElem.style.animation = 'blinker 1s linear infinite';
		} else {
			timerElem.style.color = '';
			timerElem.style.animation = '';
		}
		if (diff === 0) {
			// Ia noua ofertă și actualizează DOM-ul
			fetch('/latest_oferta')
				.then((r) => r.json())
				.then((oferta) => {
					updateOfertaNoua(oferta);
					updateTimer(); // repornește timerul pentru noua ofertă
				});
		}
	}

	document.getElementById('oferta-expira').textContent =
		dataFinalizare.toLocaleString('ro-RO');
	updateTimer();
	setInterval(updateTimer, 1000);

	// Efect vizual pentru ultimele 10 secunde
	const style = document.createElement('style');
	style.innerHTML = `
    @keyframes blinker { 50% { opacity: 0.3; } }
    `;
	document.head.appendChild(style);
});

