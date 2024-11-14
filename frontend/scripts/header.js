// Fonction pour obtenir le nom de l'utilisateur à partir de l'API et l'afficher dans le header
// Fonction pour obtenir le nom de l'utilisateur à partir du localStorage
function getUserInfo() {
  const token = localStorage.getItem("token");
  if (token) {
    fetch("http://localhost:3000/auth/user", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const userNameElement = document.getElementById("user-name-h");
        if (data && data.name) {
          userNameElement.textContent = data.name; // Affiche le nom de l'utilisateur
          userNameElement.style.cursor = "pointer";
          userNameElement.addEventListener("click", () => {
            window.location.href = "../pages/profile.html";
          });
        }
      })
      .catch((error) => {
        console.error(
          "Erreur lors de la récupération des informations de l'utilisateur:",
          error
        );
      });
  } else {
    console.log("Utilisateur non connecté");
  }
}

// Fonction pour gérer la déconnexion de l'utilisateur
function handleLogout() {
  localStorage.removeItem("token"); // Supprimer le token du localStorage
  window.location.href = "../pages/login.html"; // Rediriger vers la page de connexion
}

// Fonction pour injecter dynamiquement le contenu du header et initialiser les événements
function loadHeader() {
  const headerElement = document.getElementById("header-container");

  // Charger et insérer le contenu du header depuis header.html
  fetch("../pages/header.html")
    .then((response) => response.text())
    .then((data) => {
      headerElement.innerHTML = data; // Insérer le contenu du header

      // Après l'injection, attacher les événements au DOM nouvellement inséré
      const logoutButton = document.getElementById("logout-btn");
      if (logoutButton) {
        logoutButton.addEventListener("click", handleLogout); // Associer la déconnexion
      }

      // Charger les informations de l'utilisateur après l'injection du header
      getUserInfo();
    })
    .catch((error) => {
      console.error("Erreur lors du chargement du header :", error);
    });
}

// Charger le header et les informations de l'utilisateur lors du chargement de la page
document.addEventListener("DOMContentLoaded", loadHeader);
