const tripId = localStorage.getItem("tripId");
const token = localStorage.getItem("token");

// 🔙 Back
function goBack() {
  window.location.href = "dashboard.html";
}

// ➕ Navigation
function goToAddPlace() {
  window.location.href = "addPlace.html";
}

function goToAddExpense() {
  window.location.href = "addExpense.html";
}

// ================= LOAD EXPENSES =================
async function loadExpenses() {
  try {
    const res = await fetch(`http://localhost:5000/api/expenses/${tripId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();

    const list = document.getElementById("expenseList");
    list.innerHTML = "";

    let total = 0;

    data.expenses.forEach(exp => {
      const div = document.createElement("div");

      div.innerHTML = `
        <p>${exp.title} - ₹${exp.amount}</p>
      `;

      list.appendChild(div);

      total += exp.amount;
    });

    document.getElementById("total").innerText = total;

  } catch (err) {
    console.error(err);
  }
}

// ================= LOAD PLACES =================
async function loadPlaces() {
  try {
    const res = await fetch(`http://localhost:5000/api/places/${tripId}`);
    const data = await res.json();

    const list = document.getElementById("placesList");
    list.innerHTML = "";

    data.places.forEach(place => {
      const div = document.createElement("div");

      div.innerHTML = `
        <p>${place.name}</p>
      `;

      list.appendChild(div);
    });

  } catch (err) {
    console.error(err);
  }
}

// ================= INIT =================
window.onload = () => {
  if (!tripId) {
    alert("No trip selected");
    return;
  }

  loadPlaces();
  loadExpenses();
};