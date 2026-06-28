const express = require('express');
const router = express.Router();
const { inscription, connexion } = require('../controllers/auth.controller');
const { verifierToken, verifierAdmin  } = require('../middlewares/auth.middleware');
const { deconnexion } = require('../controllers/auth.controller');
const { motDePasseOublie, reinitialiserMotDePasse } = require('../controllers/auth.controller');
const { getProfil, modifierProfil } = require('../controllers/auth.controller');
const uploadPhotoProfil = require('../middlewares/uploadPhotoProfil.middleware');
const { changerPhotoProfil } = require('../controllers/auth.controller');
const { getUtilisateurs, toggleBloquerUtilisateur } = require('../controllers/auth.controller');
const { verifierEmail } = require('../controllers/auth.controller');




router.post('/inscription', inscription);
router.post('/connexion', connexion);
router.post('/deconnexion', verifierToken, deconnexion);
router.post('/mot-de-passe-oublie', motDePasseOublie);
router.put('/reinitialiser-mot-de-passe/:token', reinitialiserMotDePasse);
router.get('/profil', verifierToken, getProfil);
router.put('/profil', verifierToken, modifierProfil);
router.put('/photo-profil', verifierToken, uploadPhotoProfil.single('photo'), changerPhotoProfil);
router.get('/admin/utilisateurs', verifierToken, verifierAdmin, getUtilisateurs);
router.put('/admin/utilisateurs/:id/bloquer', verifierToken, verifierAdmin, toggleBloquerUtilisateur);
router.get('/verifier-email/:token', verifierEmail);



module.exports = router;