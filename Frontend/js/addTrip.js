const API = "http://localhost:5000/api/trips";
const token = localStorage.getItem("token");

const form = document.getElementById("tripForm");
const msg = document.getElementById("msg");

// 🔙 BACK BUTTON
function goBack() {
  window.location.href = "dashboard.html";
}

// ================= ADD TRIP =================
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.getElementById("name").value;
  const description = document.getElementById("description").value;

  const data = { title, description };

  try {
    const res = await fetch(API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });

    const result = await res.json();

    if (!res.ok) {
      msg.innerText = "Error: " + result.message;
      return;
    }

    msg.innerText = "✅ Trip Created!";

  } catch (err) {
    console.error(err);
    msg.innerText = "Server error";
  }
});