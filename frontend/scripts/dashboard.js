// Fonction pour récupérer les informations de l'utilisateur et les afficher
async function loadUserData() {
  try {
    const response = await fetch("http://localhost:3000/auth/user", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const data = await response.json();

    if (response.ok) {
      document.getElementById("user-name").textContent = data.name;
    } else {
      alert("Erreur de chargement des données utilisateur");
    }
  } catch (error) {
    console.error("Erreur de chargement des données utilisateur:", error);
  }
}

// ***********************************************
// Fonction pour obtenir les comptes de l'utilisateur et calculer le solde total
async function loadTotalBalance() {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Utilisateur non connecté.");
    return;
  }

  try {
    // Supposons que l'API pour obtenir les comptes de l'utilisateur est '/accounts'
    const response = await fetch("http://localhost:3000/accounts", {
      headers: {
        Authorization: `Bearer ${token}`, // En-tête d'autorisation avec le token
      },
    });

    if (!response.ok) {
      alert("Erreur lors de la récupération des comptes.");
      return;
    }

    const accounts = await response.json();
    let totalBalance = 0;

    // Parcourir tous les comptes pour additionner les soldes
    accounts.forEach((account) => {
      totalBalance = Number(totalBalance) + Number(account.balance); // Ajouter le solde de chaque compte
    });

    // Afficher le solde total
    const totalBalanceElement = document.getElementById("total-balance");
    totalBalanceElement.textContent = `${totalBalance.toFixed(2)} €`;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des informations des comptes :",
      error
    );
  }
}
// ************************************************

// Fonction pour récupérer les comptes de l'utilisateur
async function loadAccounts() {
  try {
    const response = await fetch("http://localhost:3000/accounts", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const accounts = await response.json();

    const accountsList = document.getElementById("accounts-list");
    accountsList.innerHTML = ""; // Nettoie la liste existante

    accounts.forEach((account) => {
      const accountDiv = document.createElement("div");
      accountDiv.classList.add("account-item");
      accountDiv.setAttribute("data-account-id", account._id); // Ajouter l'ID du compte

      accountDiv.innerHTML = `
          <p>Nom du compte: ${account.accountName}</p>
          <p>Type de compte: ${account.accountType}</p>
          <p>Solde: ${account.balance.toFixed(2)} €</p>
        `;

      // Rendre chaque compte cliquable
      accountDiv.addEventListener("click", () => {
        window.location.href = `../pages/account.html?accountId=${account._id}`;
      });

      accountsList.appendChild(accountDiv);
    });
  } catch (error) {
    console.error("Erreur lors du chargement des comptes :", error);
  }
}

// Fonction pour récupérer l'historique des transactions
async function loadTransactions() {
  try {
    const response = await fetch(
      "http://localhost:3000/transactions/user-transactions",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    const transactions = await response.json();

    if (response.ok) {
      const transactionsList = document.getElementById("transactions-list");
      transactionsList.innerHTML = ""; // Clear existing content

      transactions.forEach((transaction) => {
        const transactionElement = document.createElement("div");
        transactionElement.className = "transaction";
        transactionElement.innerHTML = `
            <p>Date: ${new Date(transaction.date).toLocaleDateString()}</p>
            <p>Montant: ${transaction.amount.toFixed(2)} €</p>
            <p>Type: ${transaction.type}</p>
          `;
        transactionsList.appendChild(transactionElement);
      });
    } else {
      alert("Erreur de chargement des transactions");
    }
  } catch (error) {
    console.error("Erreur de chargement des transactions:", error);
  }
}

// ----------------------------------------------------
document
  .getElementById("download-csv-btn")
  .addEventListener("click", downloadCSV);

async function downloadCSV() {
  try {
    // Récupération des transactions via une requête API
    const response = await fetch(
      "http://localhost:3000/transactions/user-transactions",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (!response.ok) {
      alert("Erreur lors de la récupération des transactions.");
      return;
    }

    const transactions = await response.json();

    // Conversion des données en CSV
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Date,Type,Montant (€),Compte ID\n";

    transactions.forEach((transaction) => {
      const date = new Date(transaction.date).toLocaleDateString();
      const type = transaction.type === "deposit" ? "Dépôt" : "Retrait";
      const amount = transaction.amount.toFixed(2);
      const accountId = transaction.accountId;

      csvContent += `${date},${type},${amount},${accountId}\n`;
    });

    // Création d'un lien de téléchargement avec le contenu CSV
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "transactions.csv");
    document.body.appendChild(link);

    // Lancement du téléchargement
    link.click();

    // Suppression du lien après téléchargement
    document.body.removeChild(link);
  } catch (error) {
    console.error("Erreur lors du téléchargement des transactions:", error);
  }
}

// ----------------------------------------------------------

// // Fonction pour charger les notifications
// async function loadNotifications() {
//   try {
//     const response = await fetch("http://localhost:3000/notifications", {
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem("token")}`, // Envoie du token d'authentification
//       },
//     });

//     if (response.ok) {
//       const notifications = await response.json();
//       displayNotifications(notifications);
//     } else {
//       console.error("Erreur lors du chargement des notifications.");
//     }
//   } catch (error) {
//     console.error("Erreur lors de la récupération des notifications :", error);
//   }
// }

// // Fonction pour afficher les notifications sur le dashboard
// function displayNotifications(notifications) {
//   const notificationsList = document.getElementById("notifications-list");
//   notificationsList.innerHTML = ""; // Effacer les anciennes notifications

//   if (notifications.length === 0) {
//     notificationsList.innerHTML = "<p>Aucune notification pour le moment.</p>";
//     return;
//   }

//   notifications.forEach((notification) => {
//     const notificationItem = document.createElement("li");
//     notificationItem.classList.add("notification-item");
//     notificationItem.innerHTML = `
//         <p>${notification.message}</p>
//         <p><small>${new Date(notification.date).toLocaleString()}</small></p>
//       `;
//     notificationsList.appendChild(notificationItem);
//   });
// }

//*************************************************************** */
// Récupération des éléments
const addAccountBtn = document.getElementById("add-account-btn");
const modal = document.getElementById("add-account-modal");
const closeModal = document.getElementById("close-modal");
const addAccountForm = document.getElementById("add-account-form");

// Ouvrir la modale lorsqu'on clique sur le bouton "Ajouter un compte"
addAccountBtn.addEventListener("click", () => {
  modal.style.display = "block";
});

// Fermer la modale lorsqu'on clique sur la croix
closeModal.addEventListener("click", () => {
  modal.style.display = "none";
});

// Fermer la modale si on clique en dehors de la boîte de dialogue
window.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.style.display = "none";
  }
});

// Soumettre le formulaire pour ajouter un compte
addAccountForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  // Récupérer les valeurs des champs
  const accountName = document.getElementById("account-name").value;
  const accountType = document.getElementById("account-type").value;
  const initialDeposit = parseFloat(
    document.getElementById("initial-deposit").value
  );
  const lowBalanceThreshold = parseFloat(
    document.getElementById("low-balance-threshold").value
  );

  // Créer un objet avec les données du formulaire
  const accountData = {
    accountName: accountName,
    accountType: accountType,
    balance: initialDeposit,
    lowBalanceThreshold: lowBalanceThreshold,
  };

  try {
    const response = await fetch("http://localhost:3000/accounts/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`, // Si vous utilisez un token d'authentification
      },
      body: JSON.stringify(accountData),
    });

    const result = await response.json();

    if (response.ok) {
      // Ajouter le compte à l'affichage
      const accountsList = document.getElementById("accounts-list");
      const accountDiv = document.createElement("div");
      accountDiv.classList.add("account-item");
      accountDiv.innerHTML = `
        <p>Nom du compte: ${result.account.accountName}</p>
        <p>Type de compte: ${result.account.accountType}</p>
        <p>Solde: ${result.account.balance.toFixed(2)} €</p>
        <p>Seuil de solde bas: ${result.account.lowBalanceThreshold.toFixed(
          2
        )} €</p>
      `;
      accountsList.appendChild(accountDiv);

      // Fermer la modale et réinitialiser le formulaire
      modal.style.display = "none";
      addAccountForm.reset();
    } else {
      alert("Erreur lors de l'ajout du compte : " + result.error);
    }
  } catch (error) {
    alert("Une erreur est survenue. Veuillez réessayer plus tard.");
  }
});

//****************************************************************** */

// Chargement de toutes les données au chargement de la page
document.addEventListener("DOMContentLoaded", () => {
  loadUserData();
  loadAccounts();
  loadTransactions();
  loadTotalBalance();
});
