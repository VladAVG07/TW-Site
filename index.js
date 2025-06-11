const express = require('express');
const path = require('path');
const fs = require('fs');
const sass = require('sass');
const pg = require('pg');
const sharp = require('sharp');

const Client = pg.Client;

client = new Client({
	database: 'tehniciwebproiect',
	user: 'vlad',
	password: 'vlad',
	host: 'localhost',
	port: 5432,
});

client.connect();
client.query('select * from produse', function (err, rezultat) {
	console.log(err);
	// console.log(rezultat);
});
// client.query(
// 	'select * from unnest(enum_range(null::categ_prajitura))',
// 	function (err, rezultat) {
// 		console.log(err);
// 		console.log(rezultat);
// 	}
// );
app = express();

// var persoana = {
//     nume: 'Ionescu',
//     prenume: 'Gigel',
// };

// a = {
//     prop: 10,
//     b: [100, { c: 17 }, 'abc'],
// };

// console.log(a.b[1].c);

// v = [10, 27, 30, 52, 21];

// a = v.find((a) => a % 2 == 1);

// console.log(a);

console.log('Folderul proiectului: ', __dirname);
console.log('Calea fisierului index.js: ', __filename);
console.log('Folderul curent de lucru: ', process.cwd());

app.set('view engine', 'ejs');

obGlobal = {
	obErori: null,
	obImagini: null,
	folderScss: path.join(__dirname, 'resurse/scss'),
	folderCss: path.join(__dirname, 'resurse/css'),
	folderBackup: path.join(__dirname, 'backup'),
	optiuniMeniu: null,
	galerie: null,
	ofertaCurenta: null,
};

function initErori() {
	let continut = fs
		.readFileSync(path.join(__dirname, 'resurse/json/erori.json'))
		.toString('utf-8');
	// console.log(continut);
	obGlobal.obErori = JSON.parse(continut);
	// console.log(obGlobal.obErori);

	obGlobal.obErori.eroare_default.imagine = path.join(
		obGlobal.obErori.cale_baza,
		obGlobal.obErori.eroare_default.imagine
	);
	for (let eroare of obGlobal.obErori.info_erori) {
		eroare.imagine = path.join(obGlobal.obErori.cale_baza, eroare.imagine);
	}
	// console.log(obGlobal.obErori);
}

initErori();

function afisareEroare(res, identificator, titlu, text, imagine) {
	let eroare = obGlobal.obErori.info_erori.find(function (elem) {
		return elem.identificator == identificator;
	});
	if (eroare) {
		if (eroare.status) res.status(identificator);
		var titluCustom = titlu || eroare.titlu;
		var textCustom = text || eroare.text;
		var imagineCustom = imagine || eroare.imagine;
	} else {
		var err = obGlobal.obErori.eroare_default;
		var titluCustom = titlu || err.titlu;
		var textCustom = text || err.text;
		var imagineCustom = imagine || err.imagine;
	}
	res.render('pagini/eroare', {
		//transmit obiectul locals
		titlu: titluCustom,
		text: textCustom,
		imagine: imagineCustom,
	});
}

vect_foldere = ['temp', 'backup', 'temp1'];
for (let folder of vect_foldere) {
	let caleFolder = path.join(__dirname, folder);
	if (!fs.existsSync(caleFolder)) {
		fs.mkdirSync(caleFolder);
	}
}

function compileazaScss(caleScss, caleCss) {
	// console.log('cale:', caleCss);
	if (!caleCss) {
		let numeFisExt = path.basename(caleScss); // "folder1/folder2/ceva.txt" -> "ceva.txt"
		let numeFis = numeFisExt.split('.')[0]; /// "a.scss"  -> ["a","scss"]
		caleCss = numeFis + '.css'; // output: a.css
	}

	if (!path.isAbsolute(caleScss))
		caleScss = path.join(obGlobal.folderScss, caleScss);
	if (!path.isAbsolute(caleCss))
		caleCss = path.join(obGlobal.folderCss, caleCss);

	let caleBackup = path.join(obGlobal.folderBackup, 'resurse/css');
	if (!fs.existsSync(caleBackup)) {
		fs.mkdirSync(caleBackup, { recursive: true });
	}

	// la acest punct avem cai absolute in caleScss si  caleCss

	let numeFisCss = path.basename(caleCss);
	if (fs.existsSync(caleCss)) {
		fs.copyFileSync(
			caleCss,
			path.join(obGlobal.folderBackup, 'resurse/css', numeFisCss)
		); // +(new Date()).getTime()
	}
	rez = sass.compile(caleScss, { sourceMap: true });
	fs.writeFileSync(caleCss, rez.css);
	// console.log("Compilare SCSS",rez);
}
//compileazaScss("a.scss");

//la pornirea serverului
vFisiere = fs.readdirSync(obGlobal.folderScss);
for (let numeFis of vFisiere) {
	if (path.extname(numeFis) == '.scss') {
		compileazaScss(numeFis);
	}
}

fs.watch(obGlobal.folderScss, function (eveniment, numeFis) {
	// console.log(eveniment, numeFis);
	if (eveniment == 'change' || eveniment == 'rename') {
		let caleCompleta = path.join(obGlobal.folderScss, numeFis);
		if (fs.existsSync(caleCompleta)) {
			compileazaScss(caleCompleta);
		}
	}
});

function resizeImageIfNotExists(originalPath, destSmall, destMedium) {
	if (!fs.existsSync(destSmall)) {
		sharp(originalPath)
			.resize(400)
			.toFile(destSmall)
			.catch((err) => console.error('Eroare resize small:', err));
	}

	if (!fs.existsSync(destMedium)) {
		sharp(originalPath)
			.resize(800)
			.toFile(destMedium)
			.catch((err) => console.error('Eroare resize medium:', err));
	}
}

function genereazaOferte(interval, T2) {
	const reduceri = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50];
	const categorii = [
		'Echipament',
		'Suplimente',
		'Imbracaminte',
		'Accesorii',
		'Nutritie',
	];

	const randomReducere =
		reduceri[Math.floor(Math.random() * reduceri.length)];
	const randomCategorie =
		categorii[Math.floor(Math.random() * categorii.length)];

	const oferta = {
		reducere: randomReducere,
		categorie: randomCategorie,
		dataIncepere: new Date(),
		dataFinalizare: new Date(Date.now() + interval),
	};

	const caleOferte = path.join(__dirname, 'resurse/json/oferte.json');
	let oferte = [];
	if (fs.existsSync(caleOferte)) {
		const continut = JSON.parse(fs.readFileSync(caleOferte, 'utf-8'));
		oferte = continut.oferte;
	}
	oferte = oferte.filter((oferta) => {
		return Date.now() - oferta.dataFinalizare <= T2;
	});
	oferte.push(oferta);
	console.log(oferte);
	obGlobal.ofertaCurenta = oferta;
	fs.writeFileSync(caleOferte, JSON.stringify({ oferte: oferte }, null, 2));
}

setInterval(() => {
	genereazaOferte(30000, 15000);
}, 30000);

function readLastOferta() {
	const caleOferte = path.join(__dirname, 'resurse/json/oferte.json');
	let oferte = [];
	if (fs.existsSync(caleOferte)) {
		const continut = JSON.parse(fs.readFileSync(caleOferte, 'utf-8'));
		oferte = continut.oferte;
	}
	return oferte[oferte.length - 1];
}

// Funcție pentru verificarea dacă ora curentă este în interval
function esteInInterval(interval, oraCurenta) {
	const [start, end] = interval.split('-');
	const [hStart, mStart] = start.split(':').map(Number);
	const [hEnd, mEnd] = end.split(':').map(Number);

	const startMin = hStart * 60 + mStart;
	const endMin = hEnd * 60 + mEnd;
	const currentMin = oraCurenta.getHours() * 60 + oraCurenta.getMinutes();

	return currentMin >= startMin && currentMin <= endMin;
}

// Funcție care returnează imaginile filtrate
function obtineImaginiFiltrate() {
	const json = JSON.parse(fs.readFileSync('resurse/json/galerie.json'));
	const oraCurenta = new Date();
	const imaginiValide = json.imagini.filter((img) =>
		esteInInterval(img.timp, oraCurenta)
	);

	imaginiValide.forEach((img) => {
		const originalPath = path.join(
			__dirname,
			json.cale_galerie,
			img.cale_imagine
		);
		const destSmall = originalPath.replace('.jpg', '.small.jpg');
		const destMedium = originalPath.replace('.jpg', '.medium.jpg');

		resizeImageIfNotExists(originalPath, destSmall, destMedium);
	});

	return { cale_galerie: json.cale_galerie, imagini: imaginiValide };
}

obGlobal.galerie = obtineImaginiFiltrate();

app.use('/resurse', express.static(path.join(__dirname, 'resurse')));
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));

app.get('/favicon.ico', function (req, res) {
	res.sendFile(path.join(__dirname, 'resurse/imagini/favicon/favicon.ico'));
});

app.get(['/', '/index', '/home'], function (req, res) {
	const galerie = obGlobal.galerie;
	const ofertaCurenta = readLastOferta();
	res.render('pagini/index', {
		ip: req.ip,
		galerie: galerie,
		ofertaCurenta: ofertaCurenta,
	});
});

app.get('/navbar', function (req, res) {
	res.render('pagini/navbar');
});

app.get('/latest_oferta', function (req, res) {
	return res.json(readLastOferta());
});

app.get('/galerie', (req, res) => {
	const galerie = obGlobal.galerie;
	res.render('pagini/galerie', { galerie });
});

app.get('/despre', function (req, res) {
	res.render('pagini/despre');
});

app.get('/index/a', function (req, res) {
	res.render('pagini/index');
});

app.get('/cerere', function (req, res) {
	res.send("<p style='color:blue'>Buna ziua</p>");
});

app.get('/fisier', function (req, res, next) {
	res.sendfile(path.join(__dirname, 'package.json'));
});

app.get('/abc', function (req, res, next) {
	res.write('Data curenta: ');
	next();
});

app.get('/abc', function (req, res, next) {
	res.write(new Date() + '');
	res.end();
	next();
});

app.get('/abc', function (req, res, next) {
	console.log('------------');
});

app.get('/produse', async function (req, res) {
	try {
		let conditieQuery = '';
		if (req.query.tip) {
			conditieQuery = ` where tip_produs='${req.query.tip}'`;
		}

		const queries = {
			queryPret:
				'select min(pret) as pret_minim, max(pret) as pret_maxim, max(specificatie_numerica) as specificatie_maxima from produse',
			queryEtichete: 'select distinct unnest(etichete) from produse',
			queryOptiuni:
				'select * from unnest(enum_range(null::enum_categorie_mare))',
			queryCulori: 'select * from unnest(enum_range(null::enum_culoare))',
			queryProduse: 'select * from produse' + conditieQuery,
		};

		const [rezPret, rezEtichete, rezOptiuni, rezCulori, rezProduse] =
			await Promise.all([
				client.query(queries.queryPret),
				client.query(queries.queryEtichete),
				client.query(queries.queryOptiuni),
				client.query(queries.queryCulori),
				client.query(queries.queryProduse),
			]);

		// Citește oferta activă
		const caleOferte = path.join(__dirname, 'resurse/json/oferte.json');
		let ofertaActiva = null;
		if (fs.existsSync(caleOferte)) {
			const continut = JSON.parse(fs.readFileSync(caleOferte, 'utf-8'));
			if (continut.oferte && continut.oferte.length > 0) {
				ofertaActiva = continut.oferte[0];
			}
		}

		res.render('pagini/produse', {
			produse: rezProduse.rows,
			optiuni: rezOptiuni.rows,
			culori: rezCulori.rows,
			etichete: rezEtichete.rows,
			pretInfo: rezPret.rows[0],
			ofertaActiva: ofertaActiva,
		});
	} catch (err) {
		console.log(err);
		afisareEroare(res, 2);
	}
});

app.get('/seturi', async function (req, res) {
	try {
		const rezultat = await client.query(`
            SELECT s.*, json_agg(json_build_object(
                'id', p.id,
                'nume', p.nume,
                'imagine', p.imagine,
                'pret', p.pret
            )) as produse
            FROM seturi s
            INNER JOIN asociere_set sp ON s.id = sp.id_set
            INNER JOIN produse p ON sp.id_produs = p.id
            GROUP BY s.id, s.nume_set, s.descriere_set
            ORDER BY s.id
        `);

		res.render('pagini/seturi', {
			seturi: rezultat.rows,
		});
	} catch (err) {
		console.log(err);
		afisareEroare(res, 2);
	}
});

app.get('/produs/:id', async function (req, res) {
	try {
		// Get product info
		const rezultatProdus = await client.query(
			`SELECT * FROM produse WHERE id=$1`,
			[req.params.id]
		);

		// Get sets containing this product
		const rezultatSeturi = await client.query(
			`
            SELECT s.*, json_agg(json_build_object(
                'id', p.id,
                'nume', p.nume,
                'imagine', p.imagine,
                'pret', p.pret
            )) as produse
            FROM seturi s
            INNER JOIN asociere_set sp ON s.id = sp.id_set
            INNER JOIN produse p ON sp.id_produs = p.id
            WHERE EXISTS (
                SELECT 1 FROM asociere_set 
                WHERE id_set = s.id AND id_produs = $1
            )
            GROUP BY s.id, s.nume_set, s.descriere_set
        `,
			[req.params.id]
		);

		res.render('pagini/produs', {
			prod: rezultatProdus.rows[0],
			seturi: rezultatSeturi.rows,
		});
	} catch (err) {
		console.log(err);
		afisareEroare(res, 2);
	}
});

app.get(/^\/resurse\/[a-zA-Z0-9_\/]*$/, function (req, res, next) {
	afisareEroare(res, 403);
});

app.get('/resurse/', function (req, res, next) {
	afisareEroare(res, 403);
});

app.get(/^\/.*\.ejs$/, function (req, res, next) {
	afisareEroare(res, 400);
});

app.get('/*splat', function (req, res, next) {
	try {
		res.render('pagini' + req.url, function (err, rezultatRandare) {
			if (err) {
				console.log(err);
				if (err.message.startsWith('Failed to lookup view')) {
					afisareEroare(res, 404);
				} else {
					afisareEroare(res);
				}
			} else {
				res.send(rezultatRandare);
				// console.log(rezultatRandare);
			}
		});
	} catch (errRandare) {
		if (errRandare.message.startsWith('Cannot find module')) {
			afisareEroare(res, 404);
		} else {
			afisareEroare(res);
		}
	}
});

app.listen(8080);
console.log('Serverul a pornit');
