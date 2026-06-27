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

    utilisateur: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Utilisateur",
      required: true,
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