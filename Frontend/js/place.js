const API = "http://localhost:5000/api/places";

// Get tripId from localStorage
const tripId = localStorage.getItem("tripId");

const form = document.getElementById("placeForm");
const table = document.getElementById("placesTable");

// ================= LOAD PLACES =================
async function loadPlaces() {
  if (!tripId) {
    alert("No trip selected");
    return;
  }

  try {
    const res = await fetch(`${API}/${tripId}`);
    const data = await res.json();

    table.innerHTML = "";

    data.places.forEach(place => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${place.name}</td>
        <td>${place.latitude}</td>
        <td>${place.longitude}</td>
        <td>
          <button onclick="editPlace('${place._id}', '${place.name}', ${place.latitude}, ${place.longitude})">Edit</button>
          <button onclick="deletePlace('${place._id}')">Delete</button>
        </td>
      `;

      table.appendChild(row);
    });

  } catch (err) {
    console.error("Error loading places:", err);
  }
}

// ================= ADD / UPDATE =================
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = document.getElementById("placeId").value;
  const name = document.getElementById("name").value;
  const latitude = document.getElementById("lat").value;
  const longitude = document.getElementById("lng").value;

  const data = { name, latitude, longitude, tripId };

  try {
    if (id) {
      // UPDATE
      await fetch(`${API}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });
    } else {
      // CREATE
      await fetch(API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });
    }

    form.reset();
    document.getElementById("placeId").value = "";
    loadPlaces();

  } catch (err) {
    console.error("Error saving place:", err);
  }
});

// ================= DELETE =================
async function deletePlace(id) {
  if (!confirm("Are you sure?")) return;

  try {
    await fetch(`${API}/${id}`, {
      method: "DELETE"
    });

    loadPlaces();
  } catch (err) {
    console.error("Error deleting:", err);
  }
}

// ================= EDIT =================
function editPlace(id, name, lat, lng) {
  document.getElementById("placeId").value = id;
  document.getElementById("name").value = name;
  document.getElementById("lat").value = lat;
  document.getElementById("lng").value = lng;
}

// ================= INITIAL LOAD =================
window.onload = loadPlaces;