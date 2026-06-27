const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    annonce: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Annonce",
      required: true,
    },

    nom: {
      type: String,
      required: [true, "Le nom est obligatoire"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "L'email est obligatoire"],
      trim: true,
      lowercase: true,
    },

    telephone: {
      type: String,
      trim: true,
      default: "",
    },

    contenu: {
      type: String,
      required: [true, "Le message est obligatoire"],
      trim: true,
    },

    lu: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Message", messageSchema);