document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Récupération des données du formulaire
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Appel de l'API pour la connexion
    const response = await loginUser(email, password);

    if (response.success) {
      // Si la connexion réussie, rediriger l'utilisateur vers le Dashboard
      localStorage.setItem("token", response.token); // Stocker le token dans localStorage
      window.location.href = "../pages/dashboard.html"; // Redirection vers la page Dashboard
    } else {
      // Si la connexion échoue, afficher un message d'erreur
      alert(response.message || "Erreur lors de la connexion");
    }
  });
});

// Fonction pour envoyer les données de connexion à l'API
async function loginUser(email, password) {
  const url = "http://localhost:3000/auth/login"; // L'URL de l'API pour la connexion
  const data = { email, password };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Erreur serveur");
    }

    return {
      success: true,
      token: result.token, // Le token JWT renvoyé par l'API
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
}
