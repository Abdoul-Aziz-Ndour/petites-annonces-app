const express = require("express");
const router = express.Router();

const categorieController = require("../controllers/categorie.controller");

// ===============================
// Ajouter une catégorie
// POST /api/categories
// ===============================
router.post("/", categorieController.ajouterCategorie);

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
// Modifier une catégorie
// PUT /api/categories/:id
// ===============================
router.put("/:id", categorieController.modifierCategorie);

// ===============================
// Supprimer une catégorie
// DELETE /api/categories/:id
// ===============================
router.delete("/:id", categorieController.supprimerCategorie);

module.exports = router;