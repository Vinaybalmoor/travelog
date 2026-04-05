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

    const list = document.getElementById("expensesList"); // ✅ FIXED
    list.innerHTML = "";

    let total = 0;

    data.expenses.forEach(exp => {
      const li = document.createElement("li");

      li.innerHTML = `
        ${exp.title} - ₹${exp.amount}
      `;

      list.appendChild(li);
      total += exp.amount;
    });

    document.getElementById("totalExpense").innerText = total;

  } catch (err) {
    console.error(err);
  }
}

// ================= LOAD PLACES =================
async function loadPlaces() {
  try {
    const res = await fetch(`http://localhost:5000/api/places/${tripId}`, {
      headers: {
        Authorization: `Bearer ${token}` // ✅ IMPORTANT FIX
      }
    });

    const data = await res.json();

    const list = document.getElementById("placesList");
    list.innerHTML = "";

    if (!data.places || data.places.length === 0) {
      list.innerHTML = "<li>No places added</li>";
      return;
    }

    data.places.forEach(place => {
      const li = document.createElement("li");

      li.innerHTML = `
        📍 <b>${place.name}</b>
      `;

      list.appendChild(li);
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