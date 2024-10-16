const express = require('express');
const router = express.Router();
const marchandModel = require('../models/marchand');


// Route pour ajouter un marchand Pavillon
router.post('/addWithPavillon', (req, res) => {
  const { nom, cin, telephone, pavillon_numero, categorie, loyer } = req.body;

  // Vérification des champs manquants
  if (!nom || !cin || !telephone || !pavillon_numero || !categorie || !loyer) {
    console.error('Erreur: Informations manquantes.');
    return res.status(400).send("Des informations manquent.");
  }

  // Mise à jour des informations du pavillon et disponibilité
  marchandModel.updatePavillon(pavillon_numero, categorie, loyer, (err) => {
    if (err) {
      console.error('Erreur lors de la mise à jour du pavillon:', err.message);
      return res.status(500).send(`Erreur lors de la mise à jour du pavillon: ${err.message}`);
    }

    // Mise à jour de la disponibilité du pavillon
    marchandModel.updatePavillonDisponibilite(pavillon_numero, 'Prise', (err) => {
      if (err) {
        console.error('Erreur lors de la mise à jour de la disponibilité du pavillon:', err.message);
        return res.status(500).send(`Erreur lors de la mise à jour de la disponibilité: ${err.message}`);
      }

      // Ajout du marchand avec pavillon
      marchandModel.addMarchandWithPavillon(nom, cin, telephone, pavillon_numero, (err) => {
        if (err) {
          console.error('Erreur lors de l\'ajout du marchand:', err.message);
          return res.status(500).send(`Erreur lors de l'ajout du marchand: ${err.message}`);
        }
        res.status(200).send("Marchand ajouté avec succès !");
      });
    });
  });
});



// Route pour ajouter un marchand avec place
router.post('/addWithPlace', (req, res) => {
  const { nom, cin, telephone, numeroplace, localite, categorie, ticket } = req.body;

  // Vérifiez si les champs sont manquants
  if (!nom || !cin || !telephone || !numeroplace || !localite || !categorie || !ticket) {
    console.error('Erreur: Informations manquantes.');
    return res.status(400).send("Des informations manquent.");
  }

  // Ajout de la place
  marchandModel.addPlace(numeroplace, localite, categorie, ticket, (err) => {
    if (err) {
      console.error('Erreur lors de l\'ajout de la place:', err.message);
      return res.status(500).send(`Erreur lors de l'ajout de la place: ${err.message}`);
    }

    // Ajout du marchand avec numeroplace
    marchandModel.addMarchandWithPlace(nom, cin, telephone, numeroplace, (err) => {
      if (err) {
        console.error('Erreur lors de l\'ajout du marchand:', err.message);
        return res.status(500).send(`Erreur lors de l'ajout du marchand: ${err.message}`);
      }
      res.status(200).send("Marchand avec place ajouté avec succès !");
    });
  });
});





// Route pour récupérer la liste des marchands
router.get('/marchands', (req, res) => {
  marchandModel.getAllMarchands((err, rows) => {
    if (err) {
      console.error('Query error:', err.message);
      return res.status(500).json({ error: 'Erreur lors de la requête SQL' });
    }

    if (!rows.length) {
      return res.status(404).json({ message: 'Aucun marchand trouvé' });
    }

    res.status(200).json({
      message: 'Succès',
      data: rows
    });
  });
});

// Route pour ajouter un régisseur
router.post('/addRegi', (req, res) => {
  const { nom_reg, cin_reg, zone_occupe } = req.body;

  marchandModel.addRegi(nom_reg, cin_reg, zone_occupe, (err) => {
    if (err) {
      console.error(err.message);
      return res.status(500).send("Erreur lors de l'ajout du régisseur.");
    }
    res.send("Régiseur ajouté avec succès !");
  });
});

//routes  liste Régisseur
router.get('/regisseur', (req, res) => {
  marchandModel.getAllRegisseurs((err, rows) => {
    if (err) {
      console.error('Query error:', err.message);
      return res.status(500).json({ error: 'Erreur lors de la requête SQL' });
    }

    if (!rows.length) {
      return res.status(404).json({ message: 'Aucun régisseur trouvé' });
    }

    res.status(200).json({
      message: 'Succès',
      data: rows
    });
  });
});

// Route pour modifier un marchand
router.put('/marchands/:cin', (req, res) => {
  const { cin } = req.params;
  const { nom, telephone } = req.body;

  marchandModel.updateMarchand(cin, nom, telephone, (err) => {
    if (err) {
      console.error('Erreur lors de la mise à jour du marchand:', err.message);
      return res.status(500).send('Erreur lors de la mise à jour du marchand.');
    }
    res.send('Marchand mis à jour avec succès !');
  });
});


// Route pour supprimer un marchand et libérer la place associée
router.delete('/marchands/:NumeroMarchand', (req, res) => {
  const NumeroMarchand = req.params.NumeroMarchand;

  marchandModel.deleteMarchand(NumeroMarchand, (err) => {
    if (err) {
      if (err.message === 'Aucun marchand trouvé avec ce NumeroMarchand.') {
        return res.status(404).json({ error: 'Aucun marchand trouvé avec ce NumeroMarchand.' });
      }
      console.error('Erreur lors de la suppression du marchand:', err.message);
      return res.status(500).json({ error: 'Erreur lors de la suppression' });
    }
    res.status(200).json({ message: 'Marchand supprimé avec succès' });
  });
});


// Route pour modifier un régisseur
router.put('/regisseurs/:cin_reg', (req, res) => {
  const { cin_reg } = req.params;
  const { nom_reg, zone_occupe } = req.body;

  marchandModel.updatedRegi(cin_reg, nom_reg, zone_occupe, (err) => {
    if (err) {
      console.error('Erreur lors de la mise à jour du régisseur:', err.message);
      return res.status(500).send('Erreur lors de la mise à jour du régisseur.');
    }
    res.send('Régisseur mis à jour avec succès !');
  });
});

// Route pour supprimer un regisseur
router.delete('/regisseurs/:cin_reg', (req, res) => {
  const cin_reg = req.params.cin_reg;

  marchandModel.deleteRegi(cin_reg, (err) => {
    if (err) {
      console.error('Erreur lors de la suppression du régisseur:', err.message);
      return res.status(500).json({ error: 'Erreur lors de la suppression' });
    }
    res.status(200).json({ message: 'Régisseur supprimé avec succès' });
  });
});


// Route pour ajouter un pavillon
router.post('/addPavi', (req, res) => {
  const { Type, Numero, Localite, Disponibilite, Categorie, Loyer } = req.body;

  marchandModel.addPavillon(Type, Numero, Localite, Disponibilite,Categorie, Loyer, (err) => {
    if (err) {
      console.error(err.message);
      return res.status(500).send("Erreur lors de l'ajout du pavillon.");
    }
    res.send("Pavillon ajouté avec succès !");
  });
});

// Route pour récupérer la liste des pavillons
router.get('/pavillons', (req, res) => {
  marchandModel.getAllPavillons((err, rows) => {
    if (err) {
      console.error('Erreur lors de la requête SQL:', err.message); // Affiche le message d'erreur
      return res.status(500).json({ error: 'Erreur lors de la requête SQL' });
    }

    if (!rows.length) {
      return res.status(404).json({ message: 'Aucun pavillon trouvé' });
    }

    res.status(200).json({
      message: 'Succès',
      data: rows,
    });
  });
});


// Route pour mettre à jour la disponibilité d'un pavillon
router.put('/pavillons/:numero', (req, res) => {
  const pavillon_numero = req.params.numero;
  const { Disponibilite } = req.body;

  marchandModel.updatePavillonDisponibilite(pavillon_numero, Disponibilite, (err) => {
    if (err) {
      console.error('Erreur lors de la mise à jour du pavillon:', err.message);
      return res.status(500).send(`Erreur lors de la mise à jour du pavillon: ${err.message}`);
    }
    res.status(200).send("Disponibilité du pavillon mise à jour avec succès.");
  });
});


// Route pour supprimer un pavillon
router.delete('/pavillons/:Numero', (req, res) => {
  const { Numero } = req.params;

  marchandModel.deletePavillon(Numero, (err) => {
    if (err) {
      console.error('Erreur lors de la suppression du pavillon:', err.message);
      return res.status(500).json({ error: 'Erreur lors de la suppression' });
    }
    res.status(200).json({ message: 'Pavillon supprimé avec succès' });
  });
});

// Route pour récupérer les pavillons libres
router.get('/pavillons/libres', (req, res) => {
  marchandModel.getPavillonsLibres((err, rows) => {
    if (err) {
      console.error('Erreur lors de la requête SQL pour les pavillons libres:', err.message);
      return res.status(500).json({ error: 'Erreur lors de la requête SQL pour les pavillons libres' });
    }

    if (!rows.length) {
      return res.status(404).json({ message: 'Aucun pavillon libre trouvé' });
    }

    res.status(200).json({
      message: 'Succès',
      data: rows,
    });
  });
});

// Récupérer toutes les catégories de pavillons
router.get('/categoriePavillon', async (req, res) => {
  try {
    const categories = await marchandModel.getAllCategoriePavillon();
    res.status(200).json({ data: categories });
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des catégories.' });
  }
});

// Ajouter une nouvelle catégorie
router.post('/addCategoriePavillon', async (req, res) => {
  const { TypeCategorie, NumeroCategorie, Loyer, Localite } = req.body;
  
  // Validation de base
  if (!TypeCategorie || !Loyer || !Localite) {
    return res.status(400).json({ error: 'Veuillez fournir toutes les informations.' });
  }

  try {
    await marchandModel.addCategoriePavillon(TypeCategorie, NumeroCategorie, Loyer, Localite);
    res.status(200).json({ message: 'Catégorie ajoutée avec succès.' });
  } catch (error) {
    console.error('Erreur lors de l\'ajout de la catégorie:', error.message);
    res.status(500).json({ error: 'Erreur lors de l\'ajout de la catégorie.' });
  }
});

// Modifier une catégorie
router.put('/categoriePavillon/:NumeroCategorie', async (req, res) => {
  const { NumeroCategorie } = req.params;
  const { TypeCategorie, Loyer, Localite } = req.body;

  if (!TypeCategorie || !Loyer || !Localite) {
    return res.status(400).json({ error: 'Veuillez fournir toutes les informations.' });
  }

  try {
    await marchandModel.updateCategoriePavillon(NumeroCategorie, TypeCategorie, Loyer, Localite);
    res.status(200).json({ message: 'Catégorie modifiée avec succès.' });
  } catch (error) {
    console.error('Erreur lors de la modification de la catégorie:', error);
    res.status(500).json({ error: 'Erreur lors de la modification de la catégorie.' });
  }
});

// Supprimer une catégorie
router.delete('/categoriePavillon/:NumeroCategorie', async (req, res) => {
  const { NumeroCategorie } = req.params;

  try {
    await marchandModel.deleteCategoriePavillon(NumeroCategorie);
    res.status(200).json({ message: 'Catégorie supprimée avec succès.' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la catégorie:', error);
    res.status(500).json({ error: 'Erreur lors de la suppression de la catégorie.' });
  }
});

// Route pour récupérer les catégories par localité
router.get('/categories/:localite', (req, res) => {
  const localite = req.params.localite; // Récupérer la localité des paramètres de la requête

  marchandModel.getCategoriesByLocalite(localite, (err, categories) => {
    if (err) {
      console.error('Erreur lors de la requête SQL pour les catégories:', err.message);
      return res.status(500).json({ error: 'Erreur lors de la requête SQL pour les catégories' });
    }

    if (!categories.length) {
      return res.status(404).json({ message: `Aucune catégorie trouvée pour la localité ${localite}` });
    }

    res.status(200).json({
      message: 'Succès',
      data: categories, // Envoi des données de catégories récupérées
    });
  });
});

router.get('/loyerByCategorie/:typeCategorie', (req, res) => {
  const typeCategorie = req.params.typeCategorie;

  marchandModel.getLoyerByCategorie(typeCategorie, (err, loyer) => {
    if (err) {
      console.error('Erreur lors de la récupération du loyer:', err.message);
      return res.status(500).json({ error: 'Erreur serveur lors de la récupération du loyer' });
    }

    if (!loyer) {
      return res.status(404).json({ error: 'Aucun loyer trouvé pour cette catégorie' });
    }

    return res.status(200).json({
      message: 'Succès',
      loyer: loyer.Loyer, // Assurez-vous que c'est le bon champ (selon la requête SQL)
    });
  });
});
//////////////////////////
router.get('/places', (req, res) => {
  marchandModel.getAllPlacesWithMarchands((err, rows) => {
    if (err) {
      console.error('Erreur de requête:', err.message);
      return res.status(500).json({ error: 'Erreur lors de la requête SQL' });
    }

    if (!rows.length) {
      return res.status(404).json({ message: 'Aucune place trouvée' });
    }

    res.status(200).json({
      message: 'Succès',
      data: rows,
    });
  });
});

// Mettre à jour une place
router.put('/places/:NumeroPlace', (req, res) => {
  const { NumeroPlace } = req.params;
  const { Localite, Categorie, Ticket } = req.body;

  marchandModel.updatePlace(NumeroPlace, { Localite, Categorie, Ticket }, (err) => {
    if (err) {
      console.error('Erreur de requête:', err.message);
      return res.status(500).json({ error: 'Erreur lors de la mise à jour de la place' });
    }

    res.status(200).json({ message: 'Place mise à jour avec succès.' });
  });
});

// Supprimer une place
router.delete('/places/:NumeroPlace', (req, res) => {
  const { NumeroPlace } = req.params;

  marchandModel.deletePlace(NumeroPlace, (err) => {
    if (err) {
      console.error('Erreur de requête:', err.message);
      return res.status(500).json({ error: 'Erreur lors de la suppression de la place' });
    }

    res.status(200).json({ message: 'Place supprimée avec succès.' });
  });
});




module.exports = router;
