// server.js
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
app.use(cors());

// Import des routes
const authRoutes = require("./routes/authRoutes.js");
const accountRoutes = require("./routes/accountRoutes.js");
const transactionRoutes = require("./routes/transactionRoutes.js");
const notificationRoutes = require("./routes/notificationRoutes.js");

// Import du middleware de gestion des erreurs
const errorHandler = require("./middlewares/errorHandlerMiddleware");

// Connexion à la base de données MongoDB
mongoose
  .connect("mongodb://localhost:27017/bankingApp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB:", err));

// Middleware pour parser le corps des requêtes en JSON
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/accounts", accountRoutes);
app.use("/transactions", transactionRoutes);
app.use("/notifications", notificationRoutes);

// Middleware de gestion des erreurs
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
