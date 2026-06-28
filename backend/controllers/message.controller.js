const Message = require("../models/message.model");
const Annonce = require("../models/annonce.model");

// ===============================
// Envoyer un message
// ===============================
exports.envoyerMessage = async (req, res) => {
  try {
    const { annonce, contenu } = req.body;

    // Vérifier si l'annonce existe
    const annonceExiste = await Annonce.findById(annonce);

    if (!annonceExiste) {
      return res.status(404).json({
        success: false,
        message: "Annonce introuvable.",
      });
    }

    // le destinataire est le propriétaire de l'annonce
    const destinataire = annonceExiste.utilisateur;

    // empêcher de s'envoyer un message à soi-même
    if (destinataire.toString() === req.utilisateur.id) {
      return res.status(400).json({
        success: false,
        message: "Vous ne pouvez pas vous envoyer un message à vous-même.",
      });
    }

    const message = new Message({
      annonce,
      expediteur: req.utilisateur.id,
      destinataire,
      contenu,
    });

    await message.save();

    res.status(201).json({
      success: true,
      message: "Message envoyé avec succès.",
      data: message,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Récupérer tous les messages de l'utilisateur connecté
// (envoyés ou reçus)
// ===============================
exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { expediteur: req.utilisateur.id },
        { destinataire: req.utilisateur.id },
      ],
    })
      .populate("annonce")
      .populate("expediteur", "nom prenom email")
      .populate("destinataire", "nom prenom email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: messages.length,
      data: messages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Récupérer un message par ID
// ===============================
exports.getMessageById = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id)
      .populate("annonce")
      .populate("expediteur", "nom prenom email")
      .populate("destinataire", "nom prenom email");

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message introuvable.",
      });
    }

    // vérifier que l'utilisateur connecté fait partie de la conversation
    if (
      message.expediteur._id.toString() !== req.utilisateur.id &&
      message.destinataire._id.toString() !== req.utilisateur.id
    ) {
      return res.status(403).json({
        success: false,
        message: "Vous n'êtes pas autorisé à voir ce message.",
      });
    }

    res.status(200).json({
      success: true,
      data: message,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Marquer un message comme lu
// ===============================
exports.marquerCommeLu = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message introuvable.",
      });
    }

    // seul le destinataire peut marquer comme lu
    if (message.destinataire.toString() !== req.utilisateur.id) {
      return res.status(403).json({
        success: false,
        message: "Vous n'êtes pas autorisé à modifier ce message.",
      });
    }

    message.lu = true;
    await message.save();

    res.status(200).json({
      success: true,
      message: "Message marqué comme lu.",
      data: message,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Supprimer un message
// ===============================
exports.supprimerMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message introuvable.",
      });
    }

    // seul l'expéditeur ou le destinataire peut supprimer
    if (
      message.expediteur.toString() !== req.utilisateur.id &&
      message.destinataire.toString() !== req.utilisateur.id
    ) {
      return res.status(403).json({
        success: false,
        message: "Vous n'êtes pas autorisé à supprimer ce message.",
      });
    }

    await message.deleteOne();

    res.status(200).json({
      success: true,
      message: "Message supprimé avec succès.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Récupérer les messages d'une annonce (pour l'utilisateur connecté)
// ===============================
exports.getMessagesParAnnonce = async (req, res) => {
  try {
    const messages = await Message.find({
      annonce: req.params.annonceId,
      $or: [
        { expediteur: req.utilisateur.id },
        { destinataire: req.utilisateur.id },
      ],
    })
      .populate("expediteur", "nom prenom email")
      .populate("destinataire", "nom prenom email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: messages.length,
      data: messages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};