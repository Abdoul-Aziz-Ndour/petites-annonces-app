const Annonce = require("../models/annonce.model");

// ===============================
// Ajouter une annonce
// ===============================
exports.ajouterAnnonce = async (req, res) => {
  try {
    const annonce = new Annonce({
      titre: req.body.titre,
      description: req.body.description,
      prix: req.body.prix,
      localisation: req.body.localisation,
      categorie: req.body.categorie,
      utilisateur: req.utilisateur.id,
      statut: req.body.statut || "Disponible",
      image: req.file ? req.file.filename : "",
    });

    await annonce.save();

    res.status(201).json({
      success: true,
      message: "Annonce ajoutée avec succès.",
      data: annonce,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Récupérer toutes les annonces
// ===============================
exports.getAnnonces = async (req, res) => {
  try {
    const annonces = await Annonce.find()
      .populate("categorie")
      .populate("utilisateur", "nom prenom email telephone")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: annonces.length,
      data: annonces,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Récupérer une annonce par ID
// ===============================
exports.getAnnonceById = async (req, res) => {
  try {
    const annonce = await Annonce.findById(req.params.id)
      .populate("categorie")
      .populate("utilisateur", "nom prenom email telephone");

    if (!annonce) {
      return res.status(404).json({
        success: false,
        message: "Annonce introuvable.",
      });
    }

    res.status(200).json({
      success: true,
      data: annonce,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Modifier une annonce
// ===============================
exports.modifierAnnonce = async (req, res) => {
  try {
    const annonce = await Annonce.findById(req.params.id);

    if (!annonce) {
      return res.status(404).json({
        success: false,
        message: "Annonce introuvable.",
      });
    }

    // vérifier que c'est bien le propriétaire de l'annonce
    if (annonce.utilisateur.toString() !== req.utilisateur.id) {
      return res.status(403).json({
        success: false,
        message: "Vous n'êtes pas autorisé à modifier cette annonce.",
      });
    }

    annonce.titre = req.body.titre || annonce.titre;
    annonce.description = req.body.description || annonce.description;
    annonce.prix = req.body.prix || annonce.prix;
    annonce.localisation = req.body.localisation || annonce.localisation;
    annonce.categorie = req.body.categorie || annonce.categorie;
    annonce.statut = req.body.statut || annonce.statut;

    if (req.file) {
      annonce.image = req.file.filename;
    }

    await annonce.save();

    res.status(200).json({
      success: true,
      message: "Annonce modifiée avec succès.",
      data: annonce,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Supprimer une annonce
// ===============================
exports.supprimerAnnonce = async (req, res) => {
  try {
    const annonce = await Annonce.findById(req.params.id);

    if (!annonce) {
      return res.status(404).json({
        success: false,
        message: "Annonce introuvable.",
      });
    }

    // vérifier que c'est bien le propriétaire de l'annonce (ou un admin)
    if (
      annonce.utilisateur.toString() !== req.utilisateur.id &&
      req.utilisateur.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Vous n'êtes pas autorisé à supprimer cette annonce.",
      });
    }

    await annonce.deleteOne();

    res.status(200).json({
      success: true,
      message: "Annonce supprimée avec succès.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Rechercher des annonces
// ===============================
exports.rechercherAnnonce = async (req, res) => {
  try {
    const motCle = req.query.q;

    const annonces = await Annonce.find({
      $or: [
        { titre: { $regex: motCle, $options: "i" } },
        { description: { $regex: motCle, $options: "i" } },
        { localisation: { $regex: motCle, $options: "i" } },
      ],
    }).populate("categorie");

    res.status(200).json({
      success: true,
      total: annonces.length,
      data: annonces,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};