const express = require('express');
require('dotenv').config();
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API Petites Annonces fonctionne');
});

const annonceRoutes = require('./routes/annonce.route');
const categorieRoutes = require('./routes/categorie.route');
const messageRoutes = require('./routes/message.route');

app.use('/api/annonces', annonceRoutes);
app.use('/api/categories', categorieRoutes);
app.use('/api/messages', messageRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));