-- ENUM-uri
CREATE TYPE enum_categorie_mare AS ENUM ('Echipament', 'Suplimente', 'Imbracaminte', 'Accesorii', 'Nutritie');
CREATE TYPE enum_culoare AS ENUM ('Negru', 'Alb', 'Rosu', 'Albastru', 'Verde', 'Mov', 'Gri', 'Roz', 'Turcoaz', 'Transparent', 'Maro');

-- Tabelul produse
CREATE TABLE produse (
    id SERIAL PRIMARY KEY,
    nume VARCHAR(100) NOT NULL,  -- Increased from 50 to 100 to accommodate longer names
    descriere TEXT,
    imagine VARCHAR(300),
    categorie_mare enum_categorie_mare NOT NULL,
    subcategorie VARCHAR(50),  -- Changed from TEXT to VARCHAR(50) for better structure
    pret NUMERIC(10,2),
    specificatie_numerica NUMERIC(10,2),
    data_introducere DATE,
    culoare enum_culoare,
    etichete VARCHAR[],  -- Array of strings
    este_disponibil_posta BOOLEAN
);

-- Inserturi (unchanged from your original)
INSERT INTO produse (nume, descriere, imagine, categorie_mare, subcategorie, pret, specificatie_numerica, data_introducere, culoare, etichete, este_disponibil_posta) VALUES
('Gantera reglabile 10kg', 'Set gantere cu discuri ajustabile', '/img/gantere10kg.jpg', 'Echipament', 'Greutati', 199.99, 10.0, '2024-01-10', 'Negru', '{"antrenament","forta","acasa"}', true),
('Minge fitness 65cm', 'Minge antiderapanta pentru stretching', '/img/minge.jpg', 'Echipament', 'Mobilitate', 89.50, 65.0, '2024-01-15', 'Roz', '{"stretching","echilibru","postura"}', true),
('Shaker 700ml', 'Shaker fara BPA pentru suplimente', '/img/shaker.jpg', 'Accesorii', 'Plastic', 24.90, 700.0, '2024-03-01', 'Verde', '{"shaker","suplimente","usor"}', true),
('Colanti dama sport', 'Material compresiv si elastic', '/img/colanti.jpg', 'Imbracaminte', 'Compresie', 119.00, 0.2, '2024-03-12', 'Mov', '{"dama","fitness","compresie"}', false),
('Banda de alergare', '12 programe, pliabila', '/img/banda.jpg', 'Echipament', 'Cardio', 1890.00, 72.0, '2023-12-10', 'Gri', '{"cardio","pliabila","acasa"}', false),
('Proteina Whey 2kg', 'Aroma vanilie, pentru masa musculara', '/img/proteina.jpg', 'Suplimente', 'Praf', 149.90, 2000.0, '2024-02-15', 'Alb', '{"zer","vanilie","refacere"}', true),
('Baton proteic', 'Cu ciocolata si alune', '/img/baton.jpg', 'Nutritie', 'Snack', 12.50, 50.0, '2024-04-01', 'Maro', '{"proteic","ciocolata","energizant"}', false),
('Bluza termica barbati', 'Material tehnic pentru exterior', '/img/bluza.jpg', 'Imbracaminte', 'Termica', 149.90, 0.35, '2023-11-05', 'Negru', '{"barbati","iarna","termo"}', true),
('Gantera cauciucata 5kg', 'Pentru forta si tonifiere', '/img/gantera5kg.jpg', 'Echipament', 'Greutati', 89.00, 5.0, '2024-02-28', 'Rosu', '{"forta","gantera","individual"}', true),
('Coarda sarit', 'Cu rulmenti si manere ergonomice', '/img/coarda.jpg', 'Accesorii', 'Sport', 49.99, 2.3, '2024-01-25', 'Albastru', '{"cardio","sarit","coarda"}', true),
('Geanta sport impermeabila', 'Cu multiple compartimente', '/img/geanta.jpg', 'Accesorii', 'Textil', 139.00, 1.2, '2024-03-10', 'Turcoaz', '{"geanta","impermeabil","sala"}', true),
('Vitamina C 1000mg', 'Tablete pentru imunitate', '/img/vitamina.jpg', 'Suplimente', 'Tablete', 34.90, 120, '2024-01-20', 'Alb', '{"vitamina","imunitate","energie"}', true),
('Tricou sport barbati', 'Material respirabil cu uscare rapida', '/img/tricou.jpg', 'Imbracaminte', 'Bumbac', 89.99, 0.3, '2024-03-01', 'Rosu', '{"tricou","barbati","antrenament"}', false),
('Colagen lichid 500ml', 'Pentru piele si articulatii', '/img/colagen.jpg', 'Suplimente', 'Lichid', 89.99, 500.0, '2024-03-08', 'Transparent', '{"colagen","piele","sanatate"}', false),
('Proteina vegana', 'Fara lactoza, aroma cacao', '/img/proteina_vegana.jpg', 'Suplimente', 'Praf', 129.90, 1000.0, '2024-02-22', 'Verde', '{"vegan","proteina","cacao"}', false),
('Sort sport barbati', 'Material flexibil si respirabil', '/img/sort.jpg', 'Imbracaminte', 'Compresie', 99.00, 0.25, '2024-04-11', 'Gri', '{"barbati","sort","compresie"}', true),
('Ochelari sport UV', 'Protectie solara si anti-aburire', '/img/ochelari.jpg', 'Accesorii', 'Protectie', 149.99, 0.1, '2024-03-25', 'Negru', '{"protectie","soare","ochelari"}', false),
('Saltea yoga', 'Cauciuc ecologic, antiderapanta', '/img/saltea.jpg', 'Accesorii', 'Yoga', 99.90, 1.5, '2024-02-10', 'Roz', '{"yoga","stretch","antiderapanta"}', true),
('Bicicleta spinning', 'Rezistenta reglabila si display', '/img/bicicleta.jpg', 'Echipament', 'Cardio', 1499.00, 65.0, '2024-01-22', 'Albastru', '{"spinning","bicicleta","cardio"}', false),
('Supliment Omega 3', 'Pentru articulatii si inima', '/img/omega3.jpg', 'Suplimente', 'Capsule', 59.00, 90.0, '2024-03-18', 'Alb', '{"omega3","inima","sanatate"}', true),
('Casca protectie sport', 'Marime reglabila', '/img/casca.jpg', 'Accesorii', 'Protectie', 79.99, 0.8, '2024-04-15', 'Gri', '{"protectie","cap","exterior"}', true);