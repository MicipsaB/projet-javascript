// Fonction pour obtenir l'ID du compte depuis l'URL
function getAccountId() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("accountId");
}

// Charger les détails du compte et l'historique des transactions
async function loadAccountDetails() {
  const accountId = getAccountId();
  try {
    const response = await fetch(
      `http://localhost:3000/accounts/${accountId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    const account = await response.json();

    const accountDetails = document.getElementById("account-details");
    accountDetails.innerHTML = `
          <p>Nom du compte : ${account.accountName}</p>
          <p>Type : ${account.accountType}</p>
          <p>Solde : ${account.balance.toFixed(2)} €</p>
          <p>Seuil de solde bas : ${account.lowBalanceThreshold.toFixed(
            2
          )} €</p>
        `;

    // Afficher l'alerte si le solde est inférieur au seuil bas
    const lowBalanceAlert = document.getElementById("low-balance-alert");
    if (Number(account.balance) < Number(account.lowBalanceThreshold)) {
      lowBalanceAlert.style.display = "block";
    } else {
      lowBalanceAlert.style.display = "none";
    }

    // Charger l'historique des transactions
    loadTransactions(accountId);
  } catch (error) {
    console.error("Erreur lors du chargement des détails du compte :", error);
  }
}

// Charger l'historique des transactions avec filtres
async function loadTransactions(accountId) {
  // Récupérer les filtres
  const transactionTypeFilter = document.getElementById("filter-type").value;
  const startDate = document.getElementById("filter-start-date").value;

  // Créer les paramètres de requête en fonction des filtres
  let url = `http://localhost:3000/transactions/history/${accountId}`;

  if (transactionTypeFilter) {
    url = `http://localhost:3000/transactions/filter/${accountId}/type?type=${transactionTypeFilter}`;
  }
  if (startDate) {
    url = `http://localhost:3000/transactions/filter/${accountId}/period?period=${startDate}`;
  }

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const transactions = await response.json();

    console.log(url);

    const transactionsList = document.getElementById("transactions-list");
    transactionsList.innerHTML = "";

    if (transactions.transactions.length === 0) {
      transactionsList.innerHTML =
        "<p>Aucune transaction trouvée avec les filtres appliqués.</p>";
      return;
    }

    transactions.transactions.forEach((transaction) => {
      const transactionItem = document.createElement("div");
      transactionItem.classList.add("transaction-item");
      transactionItem.innerHTML = `
          <p>Type : ${transaction.type}</p>
          <p>Montant : ${transaction.amount.toFixed(2)} €</p>
          <p>Date : ${new Date(transaction.date).toLocaleString()}</p>
        `;
      transactionsList.appendChild(transactionItem);
    });
  } catch (error) {
    console.error("Erreur lors du chargement des transactions :", error);
  }
}

// Gérer la transaction
document
  .getElementById("transaction-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const accountId = getAccountId();
    const transactionType = document.getElementById("transaction-type").value;
    const amount = parseFloat(
      document.getElementById("transaction-amount").value
    );

    try {
      const response = await fetch(`http://localhost:3000/transactions/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          accountId: accountId,
          type: transactionType,
          amount: amount,
        }),
      });

      if (response.ok) {
        alert("Transaction réussie!");
        loadAccountDetails(); // Recharger les détails du compte avec le solde mis à jour
      } else {
        alert("Erreur lors de la transaction.");
      }
    } catch (error) {
      console.error("Erreur lors de la transaction :", error);
    }
  });

// Supprimer le compte
document
  .getElementById("delete-account-btn")
  .addEventListener("click", async () => {
    const accountId = getAccountId();
    if (confirm("Voulez-vous vraiment supprimer ce compte ?")) {
      try {
        const response = await fetch(
          `http://localhost:3000/accounts/${accountId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.ok) {
          alert("Compte supprimé.");
          window.location.href = "../pages/dashboard.html"; // Redirige vers le dashboard après la suppression
        } else {
          alert("Erreur lors de la suppression du compte.");
        }
      } catch (error) {
        console.error("Erreur lors de la suppression du compte :", error);
      }
    }
  });

// Charger les détails du compte et l'historique des transactions au démarrage de la page
document.addEventListener("DOMContentLoaded", loadAccountDetails);

// Ajouter un événement pour le filtre
document.getElementById("filter-form").addEventListener("submit", (event) => {
  event.preventDefault();
  loadTransactions(getAccountId()); // Recharger les transactions avec les nouveaux filtres
});
