const express = require('express');
const path = require('path');
const fs = require('fs');

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
};

function initErori() {
    let continut = fs
        .readFileSync(path.join(__dirname, 'resurse/json/erori.json'))
        .toString('utf-8');
    console.log(continut);
    obGlobal.obErori = JSON.parse(continut);
    console.log(obGlobal.obErori);

    obGlobal.obErori.eroare_default.imagine = path.join(
        obGlobal.obErori.cale_baza,
        obGlobal.obErori.eroare_default.imagine
    );
    for (let eroare of obGlobal.obErori.info_erori) {
        eroare.imagine = path.join(obGlobal.obErori.cale_baza, eroare.imagine);
    }
    console.log(obGlobal.obErori);
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

app.use('/resurse', express.static(path.join(__dirname, 'resurse')));

app.get('/favicon.ico', function (req, res) {
    res.sendFile(path.join(__dirname, 'resurse/imagini/favicon/favicon.ico'));
});

app.get(['/', '/index', '/home'], function (req, res) {
    res.render('pagini/index', {
        ip: req.ip,
    });
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

app.get(/^\/resurse\/[a-zA-Z0-9_\/]*$/, function (req, res, next) {
    afisareEroare(res, 403);
});

app.get(/^\/.*\.ejs$/, function (req, res, next) {
    afisareEroare(res, 400);
});

app.get('/*', function (req, res, next) {
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
                console.log(rezultatRandare);
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
