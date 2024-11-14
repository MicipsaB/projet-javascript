// controllers/notificationController.js
const Account = require("../models/Account");
const Notification = require("../models/Notification");

// Définit un seuil de solde bas pour un compte
exports.setThreshold = async (req, res) => {
  try {
    const { accountId } = req.params;
    const { lowBalanceThreshold } = req.body;

    const account = await Account.findOne({
      _id: accountId,
      userId: req.user.userId,
    });
    if (!account) return res.status(404).json({ error: "Account not found" });

    // Mettre à jour le seuil de solde bas
    account.lowBalanceThreshold = lowBalanceThreshold;
    await account.save();

    res.json({
      message: "Low balance threshold set successfully",
      threshold: lowBalanceThreshold,
    });
  } catch (error) {
    res.status(500).json({ error: "Error setting low balance threshold" });
  }
};

// Vérifie si le solde est en dessous du seuil défini pour un compte donné
exports.checkBalanceNotification = async (req, res) => {
  try {
    const { accountId } = req.params;

    const account = await Account.findOne({
      _id: accountId,
      userId: req.user.userId,
    });
    if (!account) return res.status(404).json({ error: "Account not found" });

    // Vérifie si le solde est en dessous du seuil
    if (account.balance < account.lowBalanceThreshold) {
      const notification = new Notification({
        userId: req.user.userId,
        accountId,
        message: `Your account balance for ${account.accountName} is below the threshold.`,
      });
      await notification.save();

      res.json({ notification, alert: "Low balance notification triggered" });
    } else {
      res.json({ message: "Balance is above the threshold" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error checking balance notification" });
  }
};

// Récupère toutes les notifications pour l'utilisateur
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: "Error fetching notifications" });
  }
};
