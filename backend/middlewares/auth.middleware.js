const jwt = require("jsonwebtoken");

const verifierToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Accès refusé. Token manquant.",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.utilisateur = decoded; // contient { id, email, role }
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Token invalide ou expiré.",
    });
  }
};

// middleware optionnel pour les routes réservées aux admins
const verifierAdmin = (req, res, next) => {
  if (req.utilisateur.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Accès réservé aux administrateurs.",
    });
  }
  next();
};

module.exports = { verifierToken, verifierAdmin };