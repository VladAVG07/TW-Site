window.onload = function () {
	const btn = document.getElementById('filtrare');
	btn.onclick = filtrareProduse;

	// Reusable filter function
	function filtrareProduse() {
		let checkedColors = Array.from(
			document.querySelectorAll('input[name="culori"]:checked')
		).map((checkbox) => checkbox.value);

		let inpNume = document
			.getElementById('inp-nume')
			.value.trim()
			.toLowerCase();

		let vectRadio = document.getElementsByName('gr_rad');

		let inpCalorii = null;
		let minCalorii = null;
		let maxCalorii = null;
		for (let rad of vectRadio) {
			if (rad.checked) {
				inpCalorii = rad.value;
				if (inpCalorii != 'toate') {
					[minCalorii, maxCalorii] = inpCalorii
						.split(':')
						.map(Number);
				}
				break;
			}
		}

		let inpPret = parseFloat(document.getElementById('inp-pret').value);

		let inpCategorie = document
			.getElementById('inp-categorie')
			.value.trim()
			.toLowerCase();

		let inpNumericCalorii = parseInt(
			document.getElementById('inp-calorii').value.trim()
		);

		let selectedValues = Array.from(
			document.getElementById('select-multiplu').selectedOptions
		).map((option) => option.value.toLowerCase());

		let produse = document.getElementsByClassName('produs');
		for (let prod of produse) {
			prod.style.display = 'none';

			let etichete = prod
				.getElementsByClassName('val-etichete')[0]
				.innerHTML.trim()
				.toLowerCase()
				.split(',');

			let cond7 =
				selectedValues.length === 0 ||
				selectedValues.some((val) => etichete.includes(val));

			let culoare = prod
				.getElementsByClassName('val-culoare')[0]
				.innerHTML.trim();

			let cond6 =
				checkedColors.length === 0 || checkedColors.includes(culoare);

			let nume = prod
				.getElementsByClassName('val-nume')[0]
				.innerHTML.trim()
				.toLowerCase();
			let cond1 = nume.startsWith(inpNume);

			let calorii = parseInt(
				prod
					.getElementsByClassName('val-specificatie-numerica')[0]
					.innerHTML.trim()
			);
			let cond2 =
				inpCalorii === 'toate' ||
				(minCalorii <= calorii && calorii < maxCalorii);

			let pret = parseFloat(
				prod.getElementsByClassName('val-pret')[0].innerHTML.trim()
			);
			let cond3 = inpPret <= pret;

			let categorie = prod
				.getElementsByClassName('val-categorie')[0]
				.innerHTML.trim()
				.toLowerCase();
			let cond4 = inpCategorie === 'toate' || inpCategorie === categorie;

			let cond5 = calorii <= inpNumericCalorii;

			if (cond1 && cond2 && cond3 && cond4 && cond5 && cond6 && cond7) {
				prod.style.display = 'block';
			}
		}
	}

	// Bind onchange/oninput listeners
	document.getElementById('inp-nume').oninput = filtrareProduse;
	document
		.querySelectorAll('input[name="culori"]')
		.forEach((checkbox) => (checkbox.onchange = filtrareProduse));
	document
		.getElementsByName('gr_rad')
		.forEach((radio) => (radio.onchange = filtrareProduse));
	document.getElementById('inp-pret').oninput = function () {
		document.getElementById('infoRange').innerHTML = `(${this.value})`;
		filtrareProduse();
	};
	document.getElementById('inp-categorie').onchange = filtrareProduse;
	document.getElementById('inp-calorii').oninput = filtrareProduse;
	document.getElementById('select-multiplu').onchange = filtrareProduse;

	// Reset Button
	document.getElementById('resetare').onclick = function () {
		document.getElementById('inp-nume').value = '';
		document
			.querySelectorAll('input[name="culori"]')
			.forEach((checkbox) => (checkbox.checked = true));
		document.getElementById('i_rad4').checked = true;
		document.getElementById('inp-pret').value = 0;
		document.getElementById('infoRange').innerHTML = '(0)';
		document.getElementById('inp-calorii').value = 10000;
		document.getElementById('inp-categorie').value = 'toate';
		let selectMultiple = document.getElementById('select-multiplu');
		Array.from(selectMultiple.options).forEach((option) => {
			option.selected = false;
		});
		filtrareProduse(); // Show all
	};

	// Sorting
	document.getElementById('sortCrescNume').onclick = function () {
		sorteaza(1);
	};
	document.getElementById('sortDescrescNume').onclick = function () {
		sorteaza(-1);
	};

	function sorteaza(semn) {
		let produse = document.getElementsByClassName('produs');
		let vProduse = Array.from(produse);
		vProduse.sort(function (a, b) {
			let pretA = parseFloat(
				a.getElementsByClassName('val-pret')[0].innerHTML.trim()
			);
			let pretB = parseFloat(
				b.getElementsByClassName('val-pret')[0].innerHTML.trim()
			);
			if (pretA != pretB) return semn * (pretA - pretB);
			let numeA = a
				.getElementsByClassName('val-nume')[0]
				.innerHTML.trim()
				.toLowerCase();
			let numeB = b
				.getElementsByClassName('val-nume')[0]
				.innerHTML.trim()
				.toLowerCase();
			return semn * numeA.localeCompare(numeB);
		});
		for (let prod of vProduse) {
			prod.parentNode.appendChild(prod);
		}
	}

	// Alt + C shortcut
	window.onkeydown = function (e) {
		if (e.key === 'c' && e.altKey) {
			let produse = document.getElementsByClassName('produs');
			let sumaPreturi = 0;
			for (let prod of produse) {
				if (prod.style.display != 'none') {
					let pret = parseFloat(
						prod
							.getElementsByClassName('val-pret')[0]
							.innerHTML.trim()
					);
					sumaPreturi += pret;
				}
			}
			if (!document.getElementById('suma_preturi')) {
				let pRezultat = document.createElement('p');
				pRezultat.innerHTML = sumaPreturi;
				pRezultat.id = 'suma_preturi';
				let p = document.getElementById('p-suma');
				p.parentNode.insertBefore(pRezultat, p.nextElementSibling);
				setTimeout(() => {
					let p1 = document.getElementById('suma_preturi');
					if (p1) p1.remove();
				}, 2000);
			}
		}
	};
};
