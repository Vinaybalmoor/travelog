const API = "http://localhost:5000/api/trips";
const token = localStorage.getItem("token");

// 🔹 Load all trips
async function loadTrips() {
  try {
    const res = await fetch(API, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();

    const container = document.getElementById("tripList");
    container.innerHTML = "";

    data.trips.forEach(trip => {
      const card = document.createElement("div");

      card.style.border = "1px solid black";
      card.style.padding = "10px";
      card.style.margin = "10px";

      card.innerHTML = `
        <h3>${trip.name}</h3>
        <p>${trip.destination || ""}</p>
        <button onclick="openTrip('${trip._id}')">Open</button>
      `;

      container.appendChild(card);
    });

  } catch (err) {
    console.error("Error loading trips:", err);
  }
}

// 🔹 When user clicks a trip
function openTrip(tripId) {
  localStorage.setItem("tripId", tripId); // ⭐ IMPORTANT
  window.location.href = "tripDetails.html";
}

// 🔹 Go to add trip page
function goToAddTrip() {
  window.location.href = "addTrip.html";
}

// 🔹 Initial load
window.onload = loadTrips;