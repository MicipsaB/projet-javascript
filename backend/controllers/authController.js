// controllers/authController.js
const User = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Fonction d'inscription
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = new User({ name, email, password });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error registering user" });
  }
};

// Fonction de connexion
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token, message: "Login successful" });
  } catch (error) {
    res.status(500).json({ error: "Error logging in" });
  }
};

// New function to get user information
exports.getUserInfo = async (req, res) => {
  try {
    // Get user ID from the authenticated request
    const userId = req.user.userId;

    // Retrieve user information from the database, excluding the password field
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des informations utilisateur:",
      error
    );
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// Contrôleur pour mettre à jour le profil de l'utilisateur
exports.updateUserProfile = async (req, res) => {
  const userId = req.user.userId; // Assurez-vous que le middleware d'authentification ajoute l'ID utilisateur dans req.user
  const { name, email } = req.body;

  try {
    // Mettre à jour les informations de l'utilisateur dans la base de données
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    res.status(200).json({
      message: "Profil mis à jour avec succès.",
      user: { name: updatedUser.name, email: updatedUser.email },
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du profil :", error);
    res
      .status(500)
      .json({ message: "Erreur lors de la mise à jour du profil." });
  }
};

// Fonction de déconnexion
exports.logout = (req, res) => {
  res.json({ message: "User logged out" });
};
