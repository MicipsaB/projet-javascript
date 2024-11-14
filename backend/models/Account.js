// models/Account.js
const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  accountName: {
    type: String,
    required: true,
    trim: true,
  },
  accountType: {
    type: String,
    enum: ["courant", "épargne", "business"], // Types possibles de comptes
    required: true,
  },
  balance: {
    type: Number,
    default: 0,
    min: 0,
  },
  lowBalanceThreshold: {
    type: Number,
    default: 0, // Seuil de solde bas pour les notifications
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Account", accountSchema);
