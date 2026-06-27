const Categorie = require("../models/categorie.model");

// ===============================
// Ajouter une catégorie
// ===============================
exports.ajouterCategorie = async (req, res) => {
  try {
    const { nom, description } = req.body;

    // Vérifier si la catégorie existe déjà
    const existe = await Categorie.findOne({ nom });

    if (existe) {
      return res.status(400).json({
        success: false,
        message: "Cette catégorie existe déjà.",
      });
    }

    const categorie = new Categorie({
      nom,
      description,
    });

    await categorie.save();

    res.status(201).json({
      success: true,
      message: "Catégorie ajoutée avec succès.",
      data: categorie,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Récupérer toutes les catégories
// ===============================
exports.getCategories = async (req, res) => {
  try {
    const categories = await Categorie.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: categories.length,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Récupérer une catégorie par ID
// ===============================
exports.getCategorieById = async (req, res) => {
  try {
    const categorie = await Categorie.findById(req.params.id);

    if (!categorie) {
      return res.status(404).json({
        success: false,
        message: "Catégorie introuvable.",
      });
    }

    res.status(200).json({
      success: true,
      data: categorie,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Modifier une catégorie
// ===============================
exports.modifierCategorie = async (req, res) => {
  try {
    const categorie = await Categorie.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!categorie) {
      return res.status(404).json({
        success: false,
        message: "Catégorie introuvable.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Catégorie modifiée avec succès.",
      data: categorie,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Supprimer une catégorie
// ===============================
exports.supprimerCategorie = async (req, res) => {
  try {
    const categorie = await Categorie.findByIdAndDelete(req.params.id);

    if (!categorie) {
      return res.status(404).json({
        success: false,
        message: "Catégorie introuvable.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Catégorie supprimée avec succès.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};