const express = require("express");
const router = express.Router();

const messageController = require("../controllers/message.controller");
const { verifierToken } = require("../middlewares/auth.middleware");

// ===============================
// Envoyer un message
// POST /api/messages
// ===============================
router.post("/", verifierToken, messageController.envoyerMessage);

// ===============================
// Récupérer tous les messages
// GET /api/messages
// ===============================
router.get("/", verifierToken, messageController.getMessages);

// ===============================
// Récupérer les messages d'une annonce
// GET /api/messages/annonce/:annonceId
// ===============================
router.get(
  "/annonce/:annonceId",
  verifierToken,
  messageController.getMessagesParAnnonce
);

// ===============================
// Récupérer un message par ID
// GET /api/messages/:id
// ===============================
router.get("/:id", verifierToken, messageController.getMessageById);

// ===============================
// Marquer un message comme lu
// PUT /api/messages/:id/lu
// ===============================
router.put("/:id/lu", verifierToken, messageController.marquerCommeLu);

// ===============================
// Supprimer un message
// DELETE /api/messages/:id
// ===============================
router.delete("/:id", verifierToken, messageController.supprimerMessage);

module.exports = router;