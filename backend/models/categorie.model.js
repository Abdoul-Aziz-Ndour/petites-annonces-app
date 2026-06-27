const mongoose = require("mongoose");

const categorieSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      required: [true, "Le nom de la catégorie est obligatoire"],
      unique: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Categorie", categorieSchema);