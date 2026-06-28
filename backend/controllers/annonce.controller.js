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
// Récupérer toutes les annonces (avec filtres et tri)
// ===============================
exports.getAnnonces = async (req, res) => {
  try {
    const { categorie, prix_min, prix_max, localisation, tri } = req.query;

    const filtre = {};

    if (categorie) {
      filtre.categorie = categorie;
    }

    if (localisation) {
      filtre.localisation = { $regex: localisation, $options: "i" };
    }

    if (prix_min || prix_max) {
      filtre.prix = {};
      if (prix_min) filtre.prix.$gte = Number(prix_min);
      if (prix_max) filtre.prix.$lte = Number(prix_max);
    }

    let triOptions = { createdAt: -1 };
    if (tri === "prix_asc") triOptions = { prix: 1 };
    if (tri === "prix_desc") triOptions = { prix: -1 };
    if (tri === "ancien") triOptions = { createdAt: 1 };

    const annonces = await Annonce.find(filtre)
      .populate("categorie")
      .populate("utilisateur", "nom prenom email telephone")
      .sort(triOptions);

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

    const estProprietaire = annonce.utilisateur && annonce.utilisateur.toString() === req.utilisateur.id;
    const estAdmin = req.utilisateur.role === "admin";

    if (!estProprietaire && !estAdmin) {
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

    const estProprietaire = annonce.utilisateur && annonce.utilisateur.toString() === req.utilisateur.id;
    const estAdmin = req.utilisateur.role === "admin";

    if (!estProprietaire && !estAdmin) {
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

// ===============================
// Activer/désactiver une annonce (toggle statut)
// ===============================
exports.toggleStatutAnnonce = async (req, res) => {
  try {
    const annonce = await Annonce.findById(req.params.id);

    if (!annonce) {
      return res.status(404).json({
        success: false,
        message: "Annonce introuvable.",
      });
    }

    const estProprietaire = annonce.utilisateur && annonce.utilisateur.toString() === req.utilisateur.id;
    const estAdmin = req.utilisateur.role === "admin";

    if (!estProprietaire && !estAdmin) {
      return res.status(403).json({
        success: false,
        message: "Vous n'êtes pas autorisé à modifier cette annonce.",
      });
    }

    annonce.statut = annonce.statut === "Disponible" ? "Vendu" : "Disponible";
    await annonce.save();

    res.status(200).json({
      success: true,
      message: `Annonce marquée comme "${annonce.statut}".`,
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
// Statistiques globales (admin uniquement)
// ===============================
exports.getStatistiques = async (req, res) => {
  try {
    const totalAnnonces = await Annonce.countDocuments();
    const annoncesDisponibles = await Annonce.countDocuments({ statut: "Disponible" });
    const annoncesVendues = await Annonce.countDocuments({ statut: "Vendu" });

    const annoncesParCategorie = await Annonce.aggregate([
      {
        $group: {
          _id: "$categorie",
          total: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "_id",
          as: "categorieInfo",
        },
      },
      {
        $project: {
          _id: 0,
          categorie: { $arrayElemAt: ["$categorieInfo.nom", 0] },
          total: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalAnnonces,
        annoncesDisponibles,
        annoncesVendues,
        annoncesParCategorie,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};