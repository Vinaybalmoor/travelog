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

  const name = document.getElementById("name").value;
  const destination = document.getElementById("destination").value;

  const data = { name, destination };

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

    // 🔥 REDIRECT AFTER SUCCESS
    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 1000);

  } catch (err) {
    console.error(err);
    msg.innerText = "Server error";
  }
});