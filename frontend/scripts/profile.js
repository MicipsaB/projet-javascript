// profile.js

// Charger les informations de profil de l'utilisateur dans le formulaire
async function loadProfile() {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch("http://localhost:3000/auth/user", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const user = await response.json();

      // Remplir les champs du formulaire avec les informations de l'utilisateur
      document.getElementById("name").value = user.name;
      document.getElementById("email").value = user.email;
    } else {
      console.error("Impossible de charger les informations de profil.");
    }
  } catch (error) {
    console.error(
      "Erreur lors du chargement des informations de profil :",
      error
    );
  }
}

// Enregistrer les modifications de profil
async function saveProfile(event) {
  event.preventDefault();
  const token = localStorage.getItem("token");

  // Récupérer les nouvelles valeurs depuis le formulaire
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;

  try {
    const response = await fetch("http://localhost:3000/auth/user", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, email }),
    });

    if (response.ok) {
      alert("Profil mis à jour avec succès !");
      loadProfile(); // Recharger le profil avec les informations mises à jour
    } else {
      alert("Erreur lors de la mise à jour du profil.");
    }
  } catch (error) {
    console.error(
      "Erreur lors de la sauvegarde des informations de profil :",
      error
    );
  }
}

// Charger le profil au démarrage de la page
document.addEventListener("DOMContentLoaded", () => {
  loadProfile();
  document
    .getElementById("profile-form")
    .addEventListener("submit", saveProfile);
});
