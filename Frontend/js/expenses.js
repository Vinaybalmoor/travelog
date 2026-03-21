const API = "http://localhost:5000/api/expenses";

const form = document.getElementById("expenseForm");
const list = document.getElementById("expenseList");
const totalEl = document.getElementById("total");

// ================= LOAD =================
async function loadExpenses() {
  const tripId = localStorage.getItem("tripId");
  const token = localStorage.getItem("token");

  if (!tripId) {
    alert("No trip selected");
    return;
  }

  try {
    // 🔍 DEBUG
    console.log("Loading expenses for tripId:", tripId);

    // ✅ GET EXPENSES
    const res = await fetch(`${API}/${tripId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();
    console.log("Expenses response:", data);

    // ❌ handle error response
    if (!res.ok) {
      console.error(data.message);
      return;
    }

    // ✅ clear UI
    list.innerHTML = "";

    // ✅ safe check
    if (!data.expenses || data.expenses.length === 0) {
      list.innerHTML = "<p>No expenses yet</p>";
    } else {
      data.expenses.forEach(exp => {
        const div = document.createElement("div");

        div.innerHTML = `
          <p>${exp.title} - ₹${exp.amount} <span>${exp.category}</span></p>
        `;

        list.appendChild(div);
      });
    }

    // ================= TOTAL =================
    const totalRes = await fetch(`${API}/total/${tripId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const totalData = await totalRes.json();
    console.log("Total response:", totalData);

    if (totalRes.ok) {
      totalEl.innerText = totalData.total;
    } else {
      totalEl.innerText = 0;
    }

  } catch (err) {
    console.error("LOAD ERROR:", err);
  }
}

// ================= ADD =================
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const tripId = localStorage.getItem("tripId");
  const token = localStorage.getItem("token");

  if (!tripId) {
    alert("Trip not selected");
    return;
  }

  const data = {
    title: document.getElementById("title").value,
    amount: Number(document.getElementById("amount").value),
    category: document.getElementById("category").value,
    transportMode: document.getElementById("transportMode").value,
    tripId
  };

  console.log("Sending data:", data); // 🔍 DEBUG

  try {
    const res = await fetch(API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });

    const result = await res.json();
    console.log("POST response:", result);

    if (!res.ok) {
      alert(result.message);
      return;
    }

    // ✅ reset form
    form.reset();

    // ✅ reload list
    loadExpenses();

  } catch (err) {
    console.error("POST ERROR:", err);
  }
});

// ================= INIT =================
window.onload = loadExpenses;
function goBack() {
  window.location.href = "dashboard.html";
}