const express = require("express");
const router = express.Router();

const annonceController = require("../controllers/annonce.controller");
const upload = require("../middleware/upload.middleware");

// ===============================
// Ajouter une annonce avec image
// POST /api/annonces
// ===============================
router.post(
  "/",
  upload.single("image"),
  annonceController.ajouterAnnonce
);

// ===============================
// Rechercher une annonce
// GET /api/annonces/recherche?q=...
// ===============================
router.get(
  "/recherche",
  annonceController.rechercherAnnonce
);

// ===============================
// Récupérer toutes les annonces
// GET /api/annonces
// ===============================
router.get(
  "/",
  annonceController.getAnnonces
);

// ===============================
// Récupérer une annonce par ID
// GET /api/annonces/:id
// ===============================
router.get(
  "/:id",
  annonceController.getAnnonceById
);

// ===============================
// Modifier une annonce
// PUT /api/annonces/:id
// ===============================
router.put(
  "/:id",
  upload.single("image"),
  annonceController.modifierAnnonce
);

// ===============================
// Supprimer une annonce
// DELETE /api/annonces/:id
// ===============================
router.delete(
  "/:id",
  annonceController.supprimerAnnonce
);

module.exports = router;