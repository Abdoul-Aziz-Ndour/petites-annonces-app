const express = require("express");
const router = express.Router();

const categorieController = require("../controllers/categorie.controller");
const { verifierToken, verifierAdmin } = require("../middlewares/auth.middleware");

// ===============================
// Ajouter une catégorie (admin uniquement)
// POST /api/categories
// ===============================
router.post("/", verifierToken, verifierAdmin, categorieController.ajouterCategorie);

// ===============================
// Récupérer toutes les catégories
// GET /api/categories
// ===============================
router.get("/", categorieController.getCategories);

// ===============================
// Récupérer une catégorie par ID
// GET /api/categories/:id
// ===============================
router.get("/:id", categorieController.getCategorieById);

// ===============================
// Modifier une catégorie (admin uniquement)
// PUT /api/categories/:id
// ===============================
router.put("/:id", verifierToken, verifierAdmin, categorieController.modifierCategorie);

// ===============================
// Supprimer une catégorie (admin uniquement)
// DELETE /api/categories/:id
// ===============================
router.delete("/:id", verifierToken, verifierAdmin, categorieController.supprimerCategorie);

module.exports = router;