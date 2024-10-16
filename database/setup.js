const db = require('../config/database');

// Fonction pour configurer la base de données
function setupDatabase() {
  db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
      console.error('Erreur lors de l\'ouverture de la base de données:', err.message);
    } else {
      
      console.log('Connecté à la base de données SQLite.');
      createTable();
    }
  });
}

// Crée la table si elle n'existe pas
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS Marchand (
      NumeroMarchand INTEGER PRIMARY KEY AUTOINCREMENT,
      nom TEXT NOT NULL,
      cin INTEGER,
      telephone INTEGER,
      pavillon_numero TEXT,
      numeroplace TEXT,
      FOREIGN KEY (pavillon_numero) REFERENCES Pavillon(Numero),
      FOREIGN KEY (numeroplace) REFERENCES Place(NumeroPlace),
      CHECK ((pavillon_numero IS NOT NULL AND numeroplace IS NULL) OR (pavillon_numero IS NULL AND numeroplace IS NOT NULL))
    )
  `, (err) => {
    if (err) {
      console.error('Erreur lors de la création de la table Marchand:', err.message);
    } else {
      console.log('Table Marchand créée ou existe déjà.');
    }
  });
  


  // regisseur
  db.run(`
    CREATE TABLE IF NOT EXISTS Regisseur (
      nom_reg TEXT NOT NULL,
      cin_reg TEXT PRIMARY KEY,
      zone_occupe TEXT
    )
  `, (err) => {
    if (err) {
      console.error('Erreur lors de la création de la table:', err.message);
    } else {
      console.log('Table Régisseur créée ou existe déjà.');
    }
  });

  ///////Pavillon
  db.run(`
    CREATE TABLE IF NOT EXISTS Pavillon (
      Type TEXT NOT NULL,
      Numero TEXT PRIMARY KEY,
      Localite TEXT,
      Categorie TEXT,
      Disponibilite TEXT,
      Loyer TEXT
    )
  `, (err) => {
    if (err) {
      console.error('Erreur lors de la création de la table:', err.message);
    } else {
      console.log('Table Pavillon créée ou existe déjà.');
    }
  });
  
  ///////Place
  db.run(`
    CREATE TABLE IF NOT EXISTS Place(
      NumeroPlace TEXT PRIMARY KEY,
      Localite TEXT,
      Categorie TEXT,
      Ticket TEXT
    )
  `, (err) => {
    if (err) {
      console.error('Erreur lors de la création de la table:', err.message);
    } else {
      console.log('Table Place créée ou existe déjà.');
    }
  });

  db.run(`
    CREATE TABLE IF NOT EXISTS CategoriePavillon(
      TypeCategorie TEXT NOT NULL,
      NumeroCategorie INTEGER PRIMARY KEY AUTOINCREMENT,
      Loyer INTEGER ,
      Localite TEXT
    
    )
  `, (err) => {
    if (err) {
      console.error('Erreur lors de la création de la table:', err.message);
    } else {
      console.log('Table CategoriePavillon créée ou existe déjà.');
    }
  });

});



// Ferme la connexion après avoir configuré la base de données
// db.close((err) => {
//   if (err) {
//     console.error('Erreur lors de la fermeture de la base de données:', err.message);
//   } else {
//     console.log('Connexion à la base de données fermée.');
//   }
// });