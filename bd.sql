DROP TYPE IF EXISTS categ_prajitura;
DROP TYPE IF EXISTS tipuri_produse;

CREATE TYPE categ_prajitura AS ENUM( 'comanda speciala', 'aniversara', 'editie limitata', 'pentru copii', 'dietetica','comuna');
CREATE TYPE tipuri_produse AS ENUM('suplimente', 'accesorii', 'haine');

CREATE TABLE IF NOT EXISTS produs (
   id serial PRIMARY KEY,
   nume VARCHAR(50) UNIQUE NOT NULL,
   descriere TEXT,
   pret NUMERIC(8,2) NOT NULL,
   gramaj INT NOT NULL CHECK (gramaj>=0),   
   tip_produs tipuri_produse DEFAULT 'suplimente',
   calorii INT NOT NULL CHECK (calorii>=0),
   categorie categ_prajitura DEFAULT 'comuna',
   ingrediente VARCHAR [], --pot sa nu fie specificare deci nu punem NOT NULL
   pt_diabetici BOOLEAN NOT NULL DEFAULT FALSE,
   imagine VARCHAR(300),
   data_adaugare TIMESTAMP DEFAULT current_timestamp
);