const API = "http://localhost:5000/api/expenses";
const tripId = localStorage.getItem("tripId");
const token = localStorage.getItem("token"); // ✅ IMPORTANT

const form = document.getElementById("expenseForm");
const totalEl = document.getElementById("total");

// ================= ADD EXPENSE =================
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value;
  const amount = document.getElementById("amount").value;
  const category = document.getElementById("category").value;
  const transportMode = document.getElementById("transportMode").value;

  try {
    const res = await fetch(API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token // ✅ FIX
      },
      body: JSON.stringify({
        title,
        amount,
        category,
        transportMode,
        tripId
      })
    });

    const data = await res.json();
    console.log(data);

    loadTotal();
    form.reset();

  } catch (err) {
    console.error(err);
  }
});

// ================= LOAD TOTAL =================
async function loadTotal() {
  if (!tripId) return;

  try {
    const res = await fetch(`${API}/total/${tripId}`, {
      headers: {
        "Authorization": token // ✅ FIX
      }
    });

    const data = await res.json();
    totalEl.innerText = data.total;

  } catch (err) {
    console.error("Error loading total:", err);
  }
}

window.onload = loadTotal;