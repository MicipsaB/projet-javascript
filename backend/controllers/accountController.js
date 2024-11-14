const Account = require("../models/Account");

// Créer un nouveau compte
exports.createAccount = async (req, res) => {
  try {
    const { accountName, accountType, balance, lowBalanceThreshold } = req.body;

    const account = new Account({
      userId: req.user.userId, // Assurez-vous que `req.user._id` est défini après authentification
      accountName,
      accountType,
      balance,
      lowBalanceThreshold,
    });

    await account.save();
    res.status(201).json({ message: "Account created successfully", account });
  } catch (error) {
    console.error("Error creating account:", error);
    res.status(500).json({ error: "Error creating account" });
  }
};

// Récupérer les comptes de l'utilisateur
exports.getAccounts = async (req, res) => {
  try {
    const accounts = await Account.find({ userId: req.user.userId }); // Filtre par utilisateur
    res.status(200).json(accounts);
  } catch (error) {
    console.error("Error fetching accounts:", error);
    res.status(500).json({ error: "Error fetching accounts" });
  }
};

// Récupérer un compte spécifique par ID
exports.getAccountById = async (req, res) => {
  try {
    const account = await Account.findOne({
      _id: req.params.accountId,
      userId: req.user.userId,
    });

    if (!account) {
      return res.status(404).json({ error: "Account not found" });
    }

    res.status(200).json(account);
  } catch (error) {
    console.error("Error fetching account:", error);
    res.status(500).json({ error: "Error fetching account" });
  }
};

// Mettre à jour un compte
exports.updateAccount = async (req, res) => {
  try {
    const { accountName, accountType, balance, lowBalanceThreshold } = req.body;

    const account = await Account.findOneAndUpdate(
      { _id: req.params.accountId, userId: req.user.userId },
      { accountName, accountType, balance, lowBalanceThreshold },
      { new: true, runValidators: true }
    );

    if (!account) {
      return res.status(404).json({ error: "Account not found" });
    }

    res.status(200).json({ message: "Account updated successfully", account });
  } catch (error) {
    console.error("Error updating account:", error);
    res.status(500).json({ error: "Error updating account" });
  }
};

// Supprimer un compte
exports.deleteAccount = async (req, res) => {
  try {
    const account = await Account.findOneAndDelete({
      _id: req.params.accountId,
      userId: req.user.userId,
    });

    if (!account) {
      return res.status(404).json({ error: "Account not found" });
    }

    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Error deleting account:", error);
    res.status(500).json({ error: "Error deleting account" });
  }
};
