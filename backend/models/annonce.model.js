const mongoose = require("mongoose");

const annonceSchema = new mongoose.Schema(
  {
    titre: {
      type: String,
      required: [true, "Le titre est obligatoire"],
      trim: true,
    },

    description: {
      type: String,
      required: [true, "La description est obligatoire"],
      trim: true,
    },

    prix: {
      type: Number,
      required: [true, "Le prix est obligatoire"],
      min: 0,
    },

    localisation: {
      type: String,
      required: [true, "La localisation est obligatoire"],
      trim: true,
    },

    image: {
      type: String,
      default: "",
    },

    categorie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Categorie",
      required: true,
    },

    vendeur: {
      type: String,
      required: [true, "Le nom du vendeur est obligatoire"],
      trim: true,
    },

    telephone: {
      type: String,
      required: [true, "Le numéro de téléphone est obligatoire"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "L'adresse e-mail est obligatoire"],
      trim: true,
      lowercase: true,
    },

    statut: {
      type: String,
      enum: ["Disponible", "Vendu"],
      default: "Disponible",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Annonce", annonceSchema);