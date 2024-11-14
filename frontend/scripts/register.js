document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("register-form");

  registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Récupération des données du formulaire
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    // Vérification que le mot de passe et la confirmation correspondent
    if (password !== confirmPassword) {
      alert("Les mots de passe ne correspondent pas.");
      return;
    }

    // Appel de l'API pour l'inscription de l'utilisateur
    const response = await registerUser(name, email, password);

    if (response.success) {
      // Si l'inscription réussie, rediriger l'utilisateur vers la page de connexion
      window.location.href = "../pages/login.html"; // Redirection vers la page Connexion
    } else {
      // Si l'inscription échoue, afficher un message d'erreur
      alert(response.message || "Erreur lors de l'inscription");
    }
  });
});

// Fonction pour envoyer les données du formulaire à l'API
async function registerUser(name, email, password) {
  const url = "http://localhost:3000/auth/register"; // L'URL de l'API pour l'inscription
  const data = { name, email, password };

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
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
}
