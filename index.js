const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const setupDatabase = require('./database/setup'); // Exécute la configuration de la base de données
const marchandRoutes = require('./routes/marchand');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Routes
app.use('/', marchandRoutes);

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur démarré sur http://192.168.43.72:${port}`);
});
