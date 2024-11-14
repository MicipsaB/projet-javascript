// routes/authRoutes.js
const express = require("express");
const authController = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

const {
  validateUserRegistration,
} = require("../middlewares/validationMiddleware");
const router = express.Router();

// Route pour l'inscription de l'utilisateur
router.post("/register", validateUserRegistration, authController.register);

// Route pour la connexion de l'utilisateur
router.post("/login", authController.login);

// New route to get user information (protected)
router.get("/user", authMiddleware, authController.getUserInfo);

// Route pour mettre à jour le profil de l'utilisateur
router.put("/user", authMiddleware, authController.updateUserProfile);

module.exports = router;
