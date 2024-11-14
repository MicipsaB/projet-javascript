const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transactionController");
const authMiddleware = require("../middlewares/authMiddleware");

// Route pour ajouter une transaction
router.post("/add", transactionController.addTransaction);

// Route pour obtenir toutes les transactions d'un utilisateur
router.get(
  "/user-transactions",
  authMiddleware,
  transactionController.getUserTransactions
);

// Route pour récupérer l'historique des transactions d'un compte spécifique
router.get("/history/:accountId", transactionController.getTransactions);

// Route pour filtrer les transactions par type
router.get(
  "/filter/:accountId/type",
  transactionController.filterTransactionsByType
);

// Route pour filtrer les transactions par période
router.get(
  "/filter/:accountId/period",
  transactionController.filterTransactionsByPeriod
);

// Route to get all transactions across all accounts
router.get("/all", authMiddleware, transactionController.getAllTransactions);

module.exports = router;
