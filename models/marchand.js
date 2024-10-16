const db = require('../config/database');

// Ajouter un marchand avec un pavillon et mettre à jour la catégorie et le loyer du pavillon
const addMarchandWithPavillon = (nom, cin, telephone, pavillon_numero, callback) => {
  const insertQuery = `INSERT INTO Marchand (nom, cin, telephone, pavillon_numero) VALUES (?, ?, ?, ?)`;

  // Insérer le marchand dans la table Marchand
  db.run(insertQuery, [nom, cin, telephone, pavillon_numero], (err) => {
    if (err) {
      console.error('Erreur lors de l\'insertion dans la table Marchand:', err.message);
      return callback(err); // Retourne l'erreur via callback en cas d'échec
    }

    // Appelle le callback sans erreur (null) si l'insertion s'est bien passée
    callback(null);
  });
};

// Fonction pour mettre à jour la catégorie et le loyer d'un pavillon
const updatePavillon = (pavillon_numero, categorie, loyer, callback) => {
  const updateQuery = `UPDATE Pavillon SET Categorie = ?, Loyer = ? WHERE Numero = ?`;

  db.run(updateQuery, [categorie, loyer, pavillon_numero], (err) => {
    if (err) {
      console.error('Erreur lors de la mise à jour du pavillon:', err.message);
      return callback(err); // Retourne l'erreur via callback en cas d'échec
    }

    // Appelle le callback sans erreur (null) si la mise à jour s'est bien passée
    callback(null);
  });
};



// Ajouter un marchand dans la table Marchand
const addMarchandWithPlace = (nom, cin, telephone, numeroplace, callback) => {
  const query = `INSERT INTO Marchand (nom, cin, telephone, numeroplace) VALUES (?, ?, ?, ?)`;
  db.run(query, [nom, cin, telephone, numeroplace], (err) => {
    if (err) {
      console.error('Erreur lors de l\'insertion dans la table Marchand:', err.message);
    }
    callback(err);
  });
};

// Ajouter une place dans la table Place
const addPlace = (numeroplace, localite, categorie, ticket, callback) => {
  const query = `INSERT INTO Place (NumeroPlace, Localite, Categorie, Ticket) VALUES (?, ?, ?, ?)`;
  db.run(query, [numeroplace, localite, categorie, ticket], (err) => {
    if (err) {
      console.error('Erreur lors de l\'insertion dans la table Place:', err.message);
    }
    callback(err);
  });
};

const getAllPlacesWithMarchands = (callback) => {
  const query = `
    SELECT Place.NumeroPlace, Place.Localite, Place.Categorie, Place.Ticket, Marchand.NumeroMarchand, Marchand.nom
    FROM Place
    LEFT JOIN Marchand ON Place.NumeroPlace = Marchand.numeroplace;
  `;
  db.all(query, [], callback);
};



// Mettre à jour une place existante
const updatePlace = (NumeroPlace, updatedPlace, callback) => {
  const { Localite, Categorie, Ticket } = updatedPlace;
  const query = `
    UPDATE Place
    SET Localite = ?, Categorie = ?, Ticket = ?
    WHERE NumeroPlace = ?;
  `;
  db.run(query, [Localite, Categorie, Ticket, NumeroPlace], callback);
};

// Supprimer une place
const deletePlace = (NumeroPlace, callback) => {
  const query = `DELETE FROM Place WHERE NumeroPlace = ?;`;
  db.run(query, [NumeroPlace], callback);
};






// Fonction pour récupérer tous les marchands
const getAllMarchands = (callback) => {
  const query = `SELECT * FROM Marchand;`;
  db.all(query, [], callback);
};

// Fonction pour ajouter un régisseur
const addRegi = (nom_reg, cin_reg, zone_occupe, callback) => {
  const query = `INSERT INTO Regisseur (nom_reg, cin_reg, zone_occupe) VALUES (?, ?, ?)`;
  db.run(query, [nom_reg, cin_reg, zone_occupe], callback);
};

// Fonction pour récupérer tous les régisseurs
const getAllRegisseurs = (callback) => {
  const query = `SELECT * FROM Regisseur;`;
  db.all(query, [], callback);
};

// Fonction pour mettre à jour un marchand
const updateMarchand = (cin, nom, telephone, callback) => {
  const query = `UPDATE Marchand SET nom = ?, telephone = ? WHERE cin = ?`;
  db.run(query, [nom, telephone, cin], callback);
};



// Fonction pour supprimer un marchand par CIN
const deleteMarchand = (NumeroMarchand, callback) => {
  const getMarchandQuery = `SELECT numeroplace, pavillon_numero FROM Marchand WHERE NumeroMarchand = ?`;

  // Récupérer les informations du marchand avant la suppression
  db.get(getMarchandQuery, [NumeroMarchand], (err, row) => {
    if (err) {
      console.error('Erreur lors de la récupération des informations du marchand:', err.message);
      return callback(err);
    }

    if (!row) {
      console.log('Aucun marchand trouvé avec ce NumeroMarchand.');
      return callback(new Error('Aucun marchand trouvé avec ce NumeroMarchand.'));
    }

    const { numeroplace, pavillon_numero } = row;

    // Supprimer le marchand
    const deleteQuery = `DELETE FROM Marchand WHERE NumeroMarchand = ?`;
    db.run(deleteQuery, [NumeroMarchand], (err) => {
      if (err) {
        console.error('Erreur lors de la suppression du marchand:', err.message);
        return callback(err);
      }

      console.log('Marchand supprimé avec succès.');
      
      // Si un `numeroplace` est associé au marchand, supprimer la place correspondante
      if (numeroplace) {
        const deletePlaceQuery = `DELETE FROM Place WHERE NumeroPlace = ?`;
        db.run(deletePlaceQuery, [numeroplace], (err) => {
          if (err) {
            console.error('Erreur lors de la suppression de la place:', err.message);
            return callback(err);
          }
          console.log(`La place numéro ${numeroplace} a été supprimée.`);
          callback(null);
        });
      } 
      // Si un `pavillon_numero` est associé, mettre à jour sa disponibilité
      else if (pavillon_numero) {
        updatePavillonDisponibilite(pavillon_numero, 'Libre', (err) => {
          if (err) {
            return callback(err);
          }

          updatePavillon(pavillon_numero, 'Neant', 'Neant', (err) => {
            if (err) {
              return callback(err);
            }

            console.log(`Le pavillon numéro ${pavillon_numero} a été libéré.`);
            callback(null);
          });
        });
      } 
      // Si aucun numeroplace ni pavillon_numero, juste terminer
      else {
        callback(null);
      }
    });
  });
};



// Fonction pour mettre à jour un regisseur
const updatedRegi = (cin_reg, nom_reg, zone_occupe, callback) => {
  const query = `UPDATE Regisseur SET nom_reg = ?, zone_occupe = ? WHERE cin_reg = ?`;
  db.run(query, [nom_reg, zone_occupe, cin_reg], callback);
};
// Fonction pour supprimer un marchand par CIN
const deleteRegi = (cin_reg, callback) => {
  const query = `DELETE FROM Regisseur WHERE cin_reg = ?`;
  db.run(query, [cin_reg], callback);
};

// Ajouter un pavillon
const addPavillon = (Type, Numero, Localite, Disponibilite, Categorie, Loyer, callback) => {
  const query = 'INSERT INTO Pavillon (Type, Numero, Localite, Disponibilite, Categorie, Loyer) VALUES (?, ?, ?, ?, ?, ?)';
  db.run(query, [Type, Numero, Localite, Disponibilite, Categorie, Loyer], (err) => {
    if (err) {
      return callback(err);
    }
    callback(null);
  });
};

// Récupérer tous les pavillons
const getAllPavillons = (callback) => {
  const query = `SELECT * FROM Pavillon;`;
  db.all(query, [], callback);
};


// Mettre à jour un pavillon avec Loyer
// const updatePavillon = (Numero, Type, Localite, Disponibilite, Categorie, Loyer, callback) => {
//   const query = 'UPDATE Pavillon SET Type = ?, Localite = ?, Disponibilite = ?, Categorie=?, Loyer = ? WHERE Numero = ?';
//   db.run(query, [Type, Localite, Disponibilite, Categorie, Loyer, Numero], (err) => {
//     if (err) {
//       return callback(err);
//     }
//     callback(null);
//   });
// };


// Supprimer un pavillon
const deletePavillon = (Numero, callback) => {
  const query = 'DELETE FROM Pavillon WHERE Numero = ?';
  db.run(query, [Numero], (err) => {
    if (err) {
      return callback(err);
    }
    callback(null);
  });
};
// Récupérer les pavillons libres
const getPavillonsLibres = (callback) => {
  const query = `SELECT * FROM Pavillon WHERE Disponibilite = 'Libre'`;
  db.all(query, [], callback);
};

// Mettre à jour la disponibilité d'un pavillon
const updatePavillonDisponibilite = (pavillon_numero, disponibilite, callback) => {
  const query = `UPDATE Pavillon SET Disponibilite = ? WHERE Numero = ?`;
  db.run(query, [disponibilite, pavillon_numero], (err) => {
    if (err) {
      console.error('Erreur lors de la mise à jour de la disponibilité du pavillon:', err.message);
      return callback(err);
    }
    callback(null); // Appelle le callback sans erreur (null) si tout s'est bien passé
  });
};

// Récupérer toutes les catégories de pavillons
const getAllCategoriePavillon = () => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM CategoriePavillon', [], (err, rows) => {
      if (err) {
        console.error('Erreur lors de la récupération des catégories:', err);
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

// Ajouter une nouvelle catégorie de pavillon
const addCategoriePavillon = (TypeCategorie, NumeroCategorie, Loyer, Localite) => {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO CategoriePavillon (TypeCategorie, NumeroCategorie, Loyer, Localite)
      VALUES (?, ?, ?, ?)
    `;
    db.run(query, [TypeCategorie, NumeroCategorie, Loyer, Localite], (err) => {
      if (err) {
        console.error('Erreur SQL lors de l\'ajout de la catégorie:', err.message);
        reject(err);
      } else {
        resolve();
      }
    });
  });
};
// Modifier une catégorie de pavillon
const updateCategoriePavillon = (NumeroCategorie, TypeCategorie, Loyer, Localite) => {
  return new Promise((resolve, reject) => {
    const query = `
      UPDATE CategoriePavillon
      SET TypeCategorie = ?, Loyer = ?, Localite = ?
      WHERE NumeroCategorie = ?
    `;
    db.run(query, [TypeCategorie, Loyer, Localite, NumeroCategorie], (err) => {
      if (err) {
        console.error('Erreur lors de la modification de la catégorie:', err);
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

// Supprimer une catégorie de pavillon
const deleteCategoriePavillon = (NumeroCategorie) => {
  return new Promise((resolve, reject) => {
    const query = `
      DELETE FROM CategoriePavillon WHERE NumeroCategorie = ?
    `;
    db.run(query, [NumeroCategorie], (err) => {
      if (err) {
        console.error('Erreur lors de la suppression de la catégorie:', err);
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

// Fonction pour récupérer les catégories par localité
const getCategoriesByLocalite = (localite, callback) => {
  const sql = `SELECT TypeCategorie, NumeroCategorie FROM CategoriePavillon WHERE Localite = ?`;

  db.all(sql, [localite], (err, rows) => {
    if (err) {
      console.error('Erreur lors de la récupération des catégories:', err.message);
      return callback(err);
    }

    // Vérifiez si rows est vide
    if (!rows.length) {
      return callback(null, []); // Pas de catégories trouvées
    }

    // Formatage des catégories pour correspondre à la structure attendue par le frontend
    const categories = rows.map(row => ({
      TypeCategorie: row.TypeCategorie,    // Nom de la catégorie
      NumeroCategorie: row.NumeroCategorie // Identifiant unique de la catégorie
    }));

    callback(null, categories);
  });
};

// 
// Fonction pour récupérer le loyer par TypeCategorie
const getLoyerByCategorie = (typeCategorie, callback) => {
  const sql = `SELECT Loyer FROM CategoriePavillon WHERE TypeCategorie = ?`;

  db.get(sql, [typeCategorie], (err, row) => {
    if (err) {
      console.error('Erreur lors de la récupération du loyer:', err.message);
      return callback(err);
    }

    // Vérifiez si un loyer a été trouvé
    if (!row) {
      return callback(null, null); // Aucun loyer trouvé pour ce type de catégorie
    }

    // Renvoie l'objet contenant le loyer
    callback(null, row);
  });
};


module.exports = {
  addMarchandWithPavillon,
  addMarchandWithPlace,
  addPlace,
  getAllPlacesWithMarchands,
  updatePlace,
deletePlace ,
  updatePavillonDisponibilite,
  getAllMarchands,
  addRegi,
  getAllRegisseurs,
  updateMarchand,
  deleteMarchand,
  updatedRegi,
  deleteRegi,
  addPavillon,
  getAllPavillons,
   updatePavillon ,
  deletePavillon,
  getPavillonsLibres,
  getAllCategoriePavillon,
  addCategoriePavillon,
  updateCategoriePavillon,
  deleteCategoriePavillon,
  getCategoriesByLocalite,
  getLoyerByCategorie
};
