const Transaction = require("../models/Transaction");
const Account = require("../models/Account");
const User = require("../models/User"); // Modèle utilisateur si nécessaire

// Fonction pour ajouter une transaction (dépôt ou retrait)
exports.addTransaction = async (req, res) => {
  const { accountId, type, amount } = req.body;

  try {
    // Vérifier que le compte existe
    const account = await Account.findById(accountId);
    if (!account) {
      return res.status(404).json({ message: "Compte bancaire non trouvé." });
    }

    // Vérifier si le type de transaction est valide
    if (!["deposit", "withdrawal"].includes(type)) {
      return res.status(400).json({ message: "Type de transaction invalide." });
    }

    // Vérifier que le montant est valide et suffisant pour un retrait
    if (type === "withdrawal" && account.balance < amount) {
      return res
        .status(400)
        .json({ message: "Solde insuffisant pour effectuer un retrait." });
    }

    // Créer la transaction
    const transaction = new Transaction({
      accountId,
      type,
      amount,
      date: new Date(),
    });

    await transaction.save();

    // Mettre à jour le solde du compte
    if (type === "deposit") {
      account.balance = Number(account.balance) + Number(amount);
    } else if (type === "withdrawal") {
      account.balance = Number(account.balance) - Number(amount);
    }
    await account.save();

    res
      .status(201)
      .json({ message: "Transaction ajoutée avec succès.", transaction });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

// Obtenir toutes les transactions d'un utilisateur spécifique
exports.getUserTransactions = async (req, res) => {
  try {
    const userId = req.user.userId; // L'identifiant utilisateur du JWT

    // Récupérer tous les comptes de l'utilisateur
    const accounts = await Account.find({ userId });

    // Extraire les IDs des comptes
    const accountIds = accounts.map((account) => account._id);

    // Récupérer toutes les transactions liées à ces comptes
    const transactions = await Transaction.find({
      accountId: { $in: accountIds },
    });

    res.json(transactions);
  } catch (error) {
    res.status(500).json({
      error: "Erreur lors de la récupération des transactions de l'utilisateur",
    });
  }
};

// Fonction pour récupérer l'historique des transactions pour un compte spécifique
exports.getTransactions = async (req, res) => {
  const { accountId } = req.params;

  try {
    // Vérifier que le compte existe
    const account = await Account.findById(accountId);
    if (!account) {
      return res.status(404).json({ message: "Compte bancaire non trouvé." });
    }

    // Récupérer les transactions associées au compte
    const transactions = await Transaction.find({ accountId }).sort({
      date: -1,
    });

    res.json({ transactions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

// Fonction pour filtrer les transactions par type (dépôt ou retrait)
exports.filterTransactionsByType = async (req, res) => {
  const { accountId } = req.params;
  const { type } = req.query; // Utiliser un paramètre de requête pour spécifier le type de transaction

  try {
    // Vérifier que le compte existe
    const account = await Account.findById(accountId);
    if (!account) {
      return res.status(404).json({ message: "Compte bancaire non trouvé." });
    }

    // Filtrer les transactions par type
    const transactions = await Transaction.find({ accountId, type }).sort({
      date: -1,
    });

    res.json({ transactions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

// Controller function to get all transactions for all accounts
exports.getAllTransactions = async (req, res) => {
  try {
    // Assuming user ID is available in the token and added to the request by auth middleware
    const userId = req.user.id;

    // Fetch all transactions associated with the user's accounts
    const transactions = await Transaction.find({ userId }).sort({ date: -1 });

    res.status(200).json({
      success: true,
      transactions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve transactions",
      error: error.message,
    });
  }
};

// Fonction pour filtrer les transactions par période
exports.filterTransactionsByPeriod = async (req, res) => {
  const { accountId } = req.params;
  const { period } = req.query; // Utiliser un paramètre de requête pour spécifier la période en jours

  try {
    // Vérifier que le compte existe
    const account = await Account.findById(accountId);
    if (!account) {
      return res.status(404).json({ message: "Compte bancaire non trouvé." });
    }

    // Calculer la date de début en fonction de la période
    const dateFrom = new Date();
    dateFrom.setDate(dateFrom.getDate() - parseInt(period, 10)); // Convertir la période en entier

    // Filtrer les transactions par période
    const transactions = await Transaction.find({
      accountId,
      date: { $gte: dateFrom },
    }).sort({ date: -1 });

    res.json({ transactions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};
