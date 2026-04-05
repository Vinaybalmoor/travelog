const token = localStorage.getItem("token");
const tripId = localStorage.getItem("tripId");

// ================= MAP =================
const map = L.map('map').setView([17.3850, 78.4867], 10);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap'
}).addTo(map);

let marker;

map.on('click', function(e) {
  const { lat, lng } = e.latlng;

  if (marker) {
    map.removeLayer(marker);
  }

  marker = L.marker([lat, lng]).addTo(map);

  document.getElementById("lat").value = lat;
  document.getElementById("lng").value = lng;
});

// ================= ADD PLACE =================
const form = document.getElementById("placeForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const latitude = document.getElementById("lat").value;
  const longitude = document.getElementById("lng").value;

  // 🔴 DEBUG
  console.log("TripId:", tripId);

  const data = {
    name,
    latitude,
    longitude,
    tripId
  };

  try {
    const res = await fetch("http://localhost:5000/api/places", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });

    const result = await res.json();

    if (!res.ok) {
      alert("Error: " + result.message);
      return;
    }

    alert("✅ Place Added!");

    // 🔥 clear form
    form.reset();

  } catch (err) {
    console.log(err);
    alert("Server error");
  }
});

// 🔙 BACK
function goBack() {
  window.location.href = "tripDetails.html";
}