const Utilisateur = require('../models/user.model');
const jwt = require('jsonwebtoken');

// générer un token JWT
const genererToken = (utilisateur) => {
  return jwt.sign(
    { id: utilisateur._id, email: utilisateur.email, role: utilisateur.role },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
};

// inscription
exports.inscription = async (req, res) => {
  try {
    const { nom, prenom, email, mot_de_passe, telephone } = req.body;

    // vérifier si l'email existe déjà
    const utilisateurExistant = await Utilisateur.findOne({ email });
    if (utilisateurExistant) {
      return res.status(400).json({ message: "Cet email est déjà utilisé" });
    }

    const nouvelUtilisateur = await Utilisateur.create({
      nom,
      prenom,
      email,
      mot_de_passe,
      telephone,
    });

    const token = genererToken(nouvelUtilisateur);

    res.status(201).json({
      message: "Inscription réussie",
      token,
      utilisateur: {
        id: nouvelUtilisateur._id,
        nom: nouvelUtilisateur.nom,
        prenom: nouvelUtilisateur.prenom,
        email: nouvelUtilisateur.email,
        role: nouvelUtilisateur.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de l'inscription", error: error.message });
  }
};

// connexion
exports.connexion = async (req, res) => {
  try {
    const { email, mot_de_passe } = req.body;

    const utilisateur = await Utilisateur.findOne({ email });
    if (!utilisateur) {
      return res.status(400).json({ message: "Email ou mot de passe incorrect" });
    }

    if (utilisateur.est_bloque) {
      return res.status(403).json({ message: "Ce compte a été bloqué" });
    }

    const motDePasseValide = await utilisateur.comparerMotDePasse(mot_de_passe);
    if (!motDePasseValide) {
      return res.status(400).json({ message: "Email ou mot de passe incorrect" });
    }

    const token = genererToken(utilisateur);

    res.json({
      message: "Connexion réussie",
      token,
      utilisateur: {
        id: utilisateur._id,
        nom: utilisateur.nom,
        prenom: utilisateur.prenom,
        email: utilisateur.email,
        role: utilisateur.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la connexion", error: error.message });
  }
};