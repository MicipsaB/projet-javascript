// middlewares/authMiddleware.js
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Récupère le token de l'entête Authorization

  if (!token) {
    return res.status(401).json({ error: "Access denied, token missing!" });
  }

  try {
    // Vérifie et décode le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Ajoute les informations de l'utilisateur à la requête
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token!" });
  }
};
