const express = require('express');
const router = express.Router();
const { inscription, connexion } = require('../controllers/auth.controller');
const { verifierToken } = require('../middlewares/auth.middleware');
const { deconnexion } = require('../controllers/auth.controller');
const { motDePasseOublie, reinitialiserMotDePasse } = require('../controllers/auth.controller');



router.post('/inscription', inscription);
router.post('/connexion', connexion);
router.post('/deconnexion', verifierToken, deconnexion);
router.post('/mot-de-passe-oublie', motDePasseOublie);
router.put('/reinitialiser-mot-de-passe/:token', reinitialiserMotDePasse);

module.exports = router;