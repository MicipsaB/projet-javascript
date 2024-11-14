// routes/notificationRoutes.js
const express = require("express");
const notificationController = require("../controllers/notificationController");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

// Toutes les routes de notifications nécessitent l'authentification
router.use(authMiddleware);

// Route pour définir un seuil de notification pour un compte
router.post("/:accountId/set-threshold", notificationController.setThreshold);

// Route pour récupérer toutes les notifications de l'utilisateur
router.get("/", notificationController.getNotifications);

// Route pour vérifier si un solde est en dessous du seuil
router.get(
  "/:accountId/check",
  notificationController.checkBalanceNotification
);

module.exports = router;
