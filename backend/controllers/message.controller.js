const Message = require("../models/message.model");
const Annonce = require("../models/annonce.model");

// ===============================
// Envoyer un message
// ===============================
exports.envoyerMessage = async (req, res) => {
  try {
    const { annonce, nom, email, telephone, contenu } = req.body;

    // Vérifier si l'annonce existe
    const annonceExiste = await Annonce.findById(annonce);

    if (!annonceExiste) {
      return res.status(404).json({
        success: false,
        message: "Annonce introuvable.",
      });
    }

    const message = new Message({
      annonce,
      nom,
      email,
      telephone,
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
// Récupérer tous les messages
// ===============================
exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find()
      .populate("annonce")
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
    const message = await Message.findById(req.params.id).populate("annonce");

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message introuvable.",
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
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { lu: true },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message introuvable.",
      });
    }

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
    const message = await Message.findByIdAndDelete(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message introuvable.",
      });
    }

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
// Récupérer les messages d'une annonce
// ===============================
exports.getMessagesParAnnonce = async (req, res) => {
  try {
    const messages = await Message.find({
      annonce: req.params.annonceId,
    }).sort({ createdAt: -1 });

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