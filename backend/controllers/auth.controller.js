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

    // générer un token de vérification email
    const verifToken = crypto.randomBytes(32).toString('hex');
    nouvelUtilisateur.verification_token = verifToken;
    await nouvelUtilisateur.save();

    const lienVerification = `http://localhost:5000/api/auth/verifier-email/${verifToken}`;

    await transporter.sendMail({
      from: '"Petites Annonces" <no-reply@petites-annonces.com>',
      to: nouvelUtilisateur.email,
      subject: "Vérifiez votre adresse email",
      html: `
        <p>Bonjour ${nouvelUtilisateur.prenom},</p>
        <p>Merci de vous être inscrit. Cliquez sur ce lien pour vérifier votre email :</p>
        <a href="${lienVerification}">${lienVerification}</a>
      `,
    });

    const token = genererToken(nouvelUtilisateur);

    res.status(201).json({
      message: "Inscription réussie. Vérifiez votre email pour activer votre compte.",
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

// déconnexion
exports.deconnexion = async (req, res) => {
  try {
    // avec JWT stateless, la déconnexion réelle se fait côté client
    // (suppression du token stocké). Cette route confirme l'action
    // et peut être étendue plus tard avec une blacklist de tokens si besoin.
    res.json({ message: "Déconnexion réussie" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la déconnexion", error: error.message });
  }
};

const crypto = require('crypto');
const transporter = require('../config/mailer');

// demande de réinitialisation
exports.motDePasseOublie = async (req, res) => {
  try {
    const { email } = req.body;

    const utilisateur = await Utilisateur.findOne({ email });
    if (!utilisateur) {
      return res.status(404).json({ message: "Aucun compte associé à cet email" });
    }

    // générer un token aléatoire
    const resetToken = crypto.randomBytes(32).toString('hex');

    utilisateur.reinitialisation_token = resetToken;
    utilisateur.reinitialisation_expire = Date.now() + 3600000; // 1 heure
    await utilisateur.save();

    const lienReinitialisation = `http://localhost:5173/reinitialiser-mot-de-passe/${resetToken}`;

    await transporter.sendMail({
      from: '"Petites Annonces" <no-reply@petites-annonces.com>',
      to: utilisateur.email,
      subject: "Réinitialisation de votre mot de passe",
      html: `
        <p>Bonjour ${utilisateur.prenom},</p>
        <p>Vous avez demandé à réinitialiser votre mot de passe.</p>
        <p>Cliquez sur ce lien pour continuer (valable 1 heure) :</p>
        <a href="${lienReinitialisation}">${lienReinitialisation}</a>
      `,
    });

    res.json({ message: "Email de réinitialisation envoyé" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de l'envoi de l'email", error: error.message });
  }
};

// réinitialiser le mot de passe avec le token
exports.reinitialiserMotDePasse = async (req, res) => {
  try {
    const { token } = req.params;
    const { nouveau_mot_de_passe } = req.body;

    const utilisateur = await Utilisateur.findOne({
      reinitialisation_token: token,
      reinitialisation_expire: { $gt: Date.now() },
    });

    if (!utilisateur) {
      return res.status(400).json({ message: "Token invalide ou expiré" });
    }

    utilisateur.mot_de_passe = nouveau_mot_de_passe;
    utilisateur.reinitialisation_token = undefined;
    utilisateur.reinitialisation_expire = undefined;
    await utilisateur.save();

    res.json({ message: "Mot de passe réinitialisé avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la réinitialisation", error: error.message });
  }
};

// récupérer le profil de l'utilisateur connecté
exports.getProfil = async (req, res) => {
  try {
    const utilisateur = await Utilisateur.findById(req.utilisateur.id).select('-mot_de_passe');

    if (!utilisateur) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    res.json({ utilisateur });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération du profil", error: error.message });
  }
};

// modifier le profil de l'utilisateur connecté
exports.modifierProfil = async (req, res) => {
  try {
    const { nom, prenom, telephone } = req.body;

    const utilisateur = await Utilisateur.findById(req.utilisateur.id);

    if (!utilisateur) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    utilisateur.nom = nom || utilisateur.nom;
    utilisateur.prenom = prenom || utilisateur.prenom;
    utilisateur.telephone = telephone || utilisateur.telephone;

    await utilisateur.save();

    res.json({
      message: "Profil mis à jour avec succès",
      utilisateur: {
        id: utilisateur._id,
        nom: utilisateur.nom,
        prenom: utilisateur.prenom,
        email: utilisateur.email,
        telephone: utilisateur.telephone,
        role: utilisateur.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la modification du profil", error: error.message });
  }
};

// uploader/changer la photo de profil
exports.changerPhotoProfil = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Aucune image envoyée" });
    }

    const utilisateur = await Utilisateur.findById(req.utilisateur.id);

    if (!utilisateur) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    utilisateur.photo = req.file.path; // URL Cloudinary
    await utilisateur.save();

    res.json({
      message: "Photo de profil mise à jour",
      photo: utilisateur.photo,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de l'upload", error: error.message });
  }
};

// lister tous les utilisateurs (admin uniquement)
exports.getUtilisateurs = async (req, res) => {
  try {
    const utilisateurs = await Utilisateur.find().select('-mot_de_passe');

    res.json({
      total: utilisateurs.length,
      utilisateurs,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des utilisateurs", error: error.message });
  }
};

// bloquer / débloquer un utilisateur (admin uniquement)
exports.toggleBloquerUtilisateur = async (req, res) => {
  try {
    const utilisateur = await Utilisateur.findById(req.params.id);

    if (!utilisateur) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    utilisateur.est_bloque = !utilisateur.est_bloque;
    await utilisateur.save();

    res.json({
      message: utilisateur.est_bloque ? "Utilisateur bloqué" : "Utilisateur débloqué",
      utilisateur: {
        id: utilisateur._id,
        nom: utilisateur.nom,
        prenom: utilisateur.prenom,
        email: utilisateur.email,
        est_bloque: utilisateur.est_bloque,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour", error: error.message });
  }
};

// vérifier l'email avec le token reçu par mail
exports.verifierEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const utilisateur = await Utilisateur.findOne({ verification_token: token });
    if (!utilisateur) {
      return res.status(400).json({ message: "Lien de vérification invalide" });
    }
    utilisateur.email_verifie = true;
    utilisateur.verification_token = undefined;
    await utilisateur.save();
    res.json({ message: "Email vérifié avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la vérification", error: error.message });
  }
};