// Importer les modules nécessaires
const express = require("express");
const router = express.Router();

// Importer le contrôleur des comptes bancaires
const accountController = require("../controllers/accountController");

// Importer les middlewares
const {
  validateBankAccountCreation,
} = require("../middlewares/validationMiddleware");
const authenticateUser = require("../middlewares/authMiddleware");

/**
 * @route   POST /api/accounts/create
 * @desc    Créer un nouveau compte bancaire
 * @access  Privé (nécessite authentification)
 */
router.post(
  "/create",
  authenticateUser, // Middleware d'authentification
  validateBankAccountCreation, // Middleware de validation des données
  accountController.createAccount // Contrôleur pour la création de compte
);

/**
 * @route   GET /api/accounts
 * @desc    Récupérer tous les comptes bancaires de l'utilisateur connecté
 * @access  Privé (nécessite authentification)
 */
router.get(
  "/",
  authenticateUser, // Middleware d'authentification
  accountController.getAccounts // Contrôleur pour récupérer les comptes
);

/**
 * @route   GET /api/accounts/:accountId
 * @desc    Récupérer les détails d'un compte bancaire spécifique
 * @access  Privé (nécessite authentification)
 */
router.get(
  "/:accountId",
  authenticateUser, // Middleware d'authentification
  accountController.getAccountById // Contrôleur pour récupérer un compte par ID
);

/**
 * @route   PUT /api/accounts/:accountId
 * @desc    Mettre à jour les informations d'un compte bancaire
 * @access  Privé (nécessite authentification)
 */
router.put(
  "/:accountId",
  authenticateUser, // Middleware d'authentification
  validateBankAccountCreation, // Middleware de validation des données
  accountController.updateAccount // Contrôleur pour mettre à jour le compte
);

/**
 * @route   DELETE /api/accounts/:accountId
 * @desc    Supprimer un compte bancaire
 * @access  Privé (nécessite authentification)
 */
router.delete(
  "/:accountId",
  authenticateUser, // Middleware d'authentification
  accountController.deleteAccount // Contrôleur pour supprimer le compte
);

// Exporter le routeur pour utilisation dans l'application principale
module.exports = router;
