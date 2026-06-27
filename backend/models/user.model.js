const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
  },
  prenom: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  mot_de_passe: {
    type: String,
    required: true,
  },
  telephone: {
    type: String,
  },
  photo: {
    type: String,
    default: '',
  },
  role: {
    type: String,
    enum: ['utilisateur', 'admin'],
    default: 'utilisateur',
  },
  est_bloque: {
    type: Boolean,
    default: false,
  },
  email_verifie: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

// hacher le mot de passe avant sauvegarde
userSchema.pre('save', async function () {
  if (!this.isModified('mot_de_passe')) return;
  const salt = await bcrypt.genSalt(10);
  this.mot_de_passe = await bcrypt.hash(this.mot_de_passe, salt);
});

// méthode pour comparer le mot de passe à la connexion
userSchema.methods.comparerMotDePasse = async function (motDePasseSaisi) {
  return await bcrypt.compare(motDePasseSaisi, this.mot_de_passe);
};

module.exports = mongoose.model('Utilisateur', userSchema);