// middlewares/validationMiddleware.js
const Joi = require("joi");

// Validation pour la création d'un compte utilisateur
const validateUserRegistration = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  next();
};

// Validation pour l'ajout d'un compte bancaire
const validateBankAccountCreation = (req, res, next) => {
  // Définir le schéma de validation
  const schema = Joi.object({
    accountName: Joi.string()
      .required()
      .min(3)
      .max(50) // Le nom du compte doit être entre 3 et 50 caractères
      .trim()
      .messages({
        "string.base": "Le nom du compte doit être une chaîne de caractères.",
        "string.empty": "Le nom du compte ne peut pas être vide.",
        "string.min": "Le nom du compte doit avoir au moins 3 caractères.",
        "string.max": "Le nom du compte ne peut pas dépasser 50 caractères.",
        "any.required": "Le nom du compte est obligatoire.",
      }),

    accountType: Joi.string()
      .valid("courant", "épargne", "business") // Permet uniquement les types 'courant', 'épargne' ou 'business'
      .required()
      .messages({
        "string.base": "Le type de compte doit être une chaîne de caractères.",
        "any.only":
          "Le type de compte doit être soit 'courant', 'épargne' ou 'business'.",
        "any.required": "Le type de compte est obligatoire.",
      }),

    balance: Joi.number()
      .optional()
      .min(0) // Le solde doit être un nombre positif ou égal à zéro
      .messages({
        "number.base": "Le solde doit être un nombre.",
        "number.min": "Le solde ne peut pas être négatif.",
      }),

    lowBalanceThreshold: Joi.number()
      .optional()
      .min(0) // Le seuil de solde bas doit être un nombre positif ou égal à zéro
      .messages({
        "number.base": "Le seuil de solde bas doit être un nombre.",
        "number.min": "Le seuil de solde bas ne peut pas être négatif.",
      }),
  });

  // Valider le corps de la requête par rapport au schéma
  const { error } = schema.validate(req.body);

  if (error) {
    // Retourner les erreurs de validation
    return res.status(400).json({
      error: error.details.map((err) => err.message), // Envoyer les messages d'erreur sous forme de tableau
    });
  }

  // Passer à la fonction suivante si la validation passe
  next();
};

// Validation pour les transactions
const validateTransaction = (req, res, next) => {
  const schema = Joi.object({
    transactionType: Joi.string().valid("deposit", "withdraw").required(),
    amount: Joi.number().positive().required(),
    date: Joi.date().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  next();
};

module.exports = {
  validateUserRegistration,
  validateBankAccountCreation,
  validateTransaction,
};
