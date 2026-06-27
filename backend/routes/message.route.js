const express = require("express");
const router = express.Router();

const messageController = require("../controllers/message.controller");

// ===============================
// Envoyer un message
// POST /api/messages
// ===============================
router.post("/", messageController.envoyerMessage);

// ===============================
// Récupérer tous les messages
// GET /api/messages
// ===============================
router.get("/", messageController.getMessages);

// ===============================
// Récupérer les messages d'une annonce
// GET /api/messages/annonce/:annonceId
// ===============================
router.get(
  "/annonce/:annonceId",
  messageController.getMessagesParAnnonce
);

// ===============================
// Récupérer un message par ID
// GET /api/messages/:id
// ===============================
router.get("/:id", messageController.getMessageById);

// ===============================
// Marquer un message comme lu
// PUT /api/messages/:id/lu
// ===============================
router.put("/:id/lu", messageController.marquerCommeLu);

// ===============================
// Supprimer un message
// DELETE /api/messages/:id
// ===============================
router.delete("/:id", messageController.supprimerMessage);

module.exports = router;