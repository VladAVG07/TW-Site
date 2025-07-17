function afiseazaContainerComparare() {
	const container = document.getElementById('container-comparare');
	const lista = document.getElementById('lista-comparare');
	let produse = JSON.parse(localStorage.getItem('produseDeComparat') || '[]');
	if (produse.length > 0) {
		container.style.display = 'block';
		lista.innerHTML = '';
		produse.forEach((prod) => {
			lista.innerHTML += `<li style="display:inline-block;margin-right:10px;">
                ${prod.nume}
                <button class="btn btn-sm btn-danger btn-remove-compare" data-id="${prod.id}" title="Șterge produsul">&times;</button>
            </li>`;
		});
		// Buton "Vezi comparare"
		let btn = document.getElementById('btn-vezi-comparare');
		if (produse.length >= 2) {
			if (!btn) {
				btn = document.createElement('a');
				btn.id = 'btn-vezi-comparare';
				btn.className = 'btn btn-success btn-sm ms-2';
				btn.innerText = 'Vezi comparare';
				btn.style.marginLeft = '10px';
				container.appendChild(btn);
			}
			const ids = produse.map((p) => p.id).join(',');
			btn.href = `/comparare?ids=${ids}`;
		} else if (btn) {
			btn.remove();
		}
	} else {
		container.style.display = 'none';
		let btn = document.getElementById('btn-vezi-comparare');
		if (btn) btn.remove();
	}
	// Eveniment ștergere produs
	document.querySelectorAll('.btn-remove-compare').forEach((btn) => {
		btn.onclick = function (e) {
			const id = this.getAttribute('data-id');
			let produse = JSON.parse(
				localStorage.getItem('produseDeComparat') || '[]'
			);
			produse = produse.filter((p) => p.id !== id);
			localStorage.setItem('produseDeComparat', JSON.stringify(produse));
			afiseazaContainerComparare();
		};
	});
	// Reactivare butoane "Compară"
	document.querySelectorAll('.btn-compara').forEach((btn) => {
		const id = btn.getAttribute('data-id');
		let produse = JSON.parse(
			localStorage.getItem('produseDeComparat') || '[]'
		);
		if (produse.length >= 2 && !produse.some((p) => p.id === id)) {
			btn.disabled = true;
		} else {
			btn.disabled = false;
		}
		if (produse.some((p) => p.id === id)) {
			btn.classList.add('btn-primary');
			btn.classList.remove('btn-outline-primary');
		} else {
			btn.classList.remove('btn-primary');
			btn.classList.add('btn-outline-primary');
		}
	});
}

document.addEventListener('DOMContentLoaded', function () {
	afiseazaContainerComparare();
	document.querySelectorAll('.btn-compara').forEach((btn) => {
		btn.addEventListener('click', function (e) {
			e.stopPropagation();
			const produsId = this.getAttribute('data-id');
			const produsNume =
				this.getAttribute('data-nume') ||
				this.closest('.produs')?.querySelector('.val-nume')
					?.textContent ||
				document.querySelector('.nume')?.textContent ||
				'Produs';
			let produse = JSON.parse(
				localStorage.getItem('produseDeComparat') || '[]'
			);
			if (!produse.some((p) => p.id === produsId)) {
				produse.push({ id: produsId, nume: produsNume });
				localStorage.setItem(
					'produseDeComparat',
					JSON.stringify(produse)
				);
			}
			afiseazaContainerComparare();
		});
	});
});
