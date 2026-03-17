let editTripId = null;
const BASE_URL = "http://localhost:5000/api";
const token = localStorage.getItem("token");
const tripId = localStorage.getItem("tripId");
// ================= REGISTER =================
async function register() {
  const email = document.getElementById("email")?.value;
  const password = document.getElementById("password")?.value;

  if (!email || !password) {
    alert("Please fill all fields");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Registration failed");
      return;
    }

    alert("Registration successful 🎉");
    window.location.href = "login.html";
  } catch (err) {
    console.error(err);
    alert("Server error");
  }
}

// ================= LOGIN =================
function login() {
  const email = document.getElementById("email")?.value;
  const password = document.getElementById("password")?.value;

  fetch("http://localhost:5000/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  })
  .then(res => res.json())   // ✅ THIS LINE IS MUST
  .then(data => {
    console.log("LOGIN DATA:", data); // ✅ now real data

    if (data.token) {
      localStorage.setItem("token", data.token);

      alert("Login successful ✅");
      window.location.href = "dashboard.html";
    } else {
      alert(data.message || "Invalid credentials ❌");
    }
  })
  .catch(err => {
    console.error(err);
    alert("Server error");
  });
}

// ================= LOGOUT =================
function logout() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}

// ================= FETCH TRIPS =================
async function fetchTrips() {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    const res = await fetch("http://localhost:5000/api/trips", {
      headers: { 
        "Content-Type": "application/json",
        Authorization: "Bearer " + token 
      },
    });

    const data = await res.json();
    const tripList = document.getElementById("tripList");
    if (!tripList) return;

    tripList.innerHTML = "";

    if (!data.trips || data.trips.length === 0) {
      tripList.innerHTML = "<p>No trips added yet.</p>";
      return;
    }

    data.trips.forEach((trip) => {
      const div = document.createElement("div");
      div.className = "trip-card";
      div.innerHTML = `
        <h3>${trip.title}</h3>
        <p>${trip.description}</p>
        <div class="trip-actions">
          <button onclick="editTrip('${trip._id}', '${trip.title}', '${trip.description}')">Edit</button>
          <button onclick="deleteTrip('${trip._id}')">Delete</button>
        </div>
      `;
      tripList.appendChild(div);
    });
  } catch (err) {
    console.error(err);
  }
}

// ================= ADD OR UPDATE TRIP =================
async function addTrip() {
  const title = document.getElementById("title")?.value;
  const description = document.getElementById("description")?.value;
  const token = localStorage.getItem("token");

  if (!title || !description) {
    alert("Please fill all fields");
    return;
  }

  try {
    let res;

    if (editTripId) {
      res = await fetch(`http://localhost:5000/api/trips/${editTripId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ title, description }),
      });
    } else {
      res = await fetch("http://localhost:5000/api/trips", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ title, description }),
      });
    }

    if (!res.ok) {
      alert("Action failed");
      return;
    }

    alert(editTripId ? "Trip updated! ✅" : "Trip added! 🎉");

    editTripId = null;

    if (document.getElementById("addBtn")) {
      document.getElementById("addBtn").textContent = "Add Trip";
    }

    if (document.getElementById("title")) {
      document.getElementById("title").value = "";
    }

    if (document.getElementById("description")) {
      document.getElementById("description").value = "";
    }

    fetchTrips();
  } catch (err) {
    console.error(err);
  }
}

// ================= EDIT TRIP =================
function editTrip(id, title, description) {
  editTripId = id;

  if (document.getElementById("title")) {
    document.getElementById("title").value = title;
  }

  if (document.getElementById("description")) {
    document.getElementById("description").value = description;
  }

  if (document.getElementById("addBtn")) {
    document.getElementById("addBtn").textContent = "Update Trip";
  }

  window.scrollTo(0, 0);
}

// ================= DELETE TRIP =================
async function deleteTrip(id) {
  const token = localStorage.getItem("token");

  if (!confirm("Are you sure you want to delete this trip?")) return;

  try {
    const res = await fetch(`http://localhost:5000/api/trips/${id}`, {
      method: "DELETE",
      headers: { Authorization: "Bearer " + token },
    });

    if (!res.ok) {
      alert("Failed to delete trip");
      return;
    }

    alert("Trip deleted! ✅");
    fetchTrips();
  } catch (err) {
    console.error(err);
  }
}

// ================= NAVIGATION =================
function goToAddPlace() {
  window.location.href = "addPlace.html";
}

function goToAddExpense() {
  window.location.href = "addExpense.html";
}

// ================= MAP =================
let map;

function initMap() {
  map = L.map("map").setView([17.3850, 78.4867], 10); // Hyderabad default

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap",
  }).addTo(map);
}
// ================= LOAD PLACES =================
function loadPlaces() {
  const container = document.getElementById("placesList");
  if (!container) return;

  const token = localStorage.getItem("token");
  const tripId = localStorage.getItem("tripId");

  fetch(`http://localhost:5000/api/places/${tripId}`, {
    headers: {
      Authorization: "Bearer " + token
    }
  })
    .then(res => res.json())
    .then(data => {
      container.innerHTML = "";

      if (!data.places || data.places.length === 0) {
        container.innerHTML = "<p>No places added yet</p>";
        return;
      }

      data.places.forEach(place => {
        container.innerHTML += `
          <div class="card">
            <h3>${place.name}</h3>
            <p>${place.latitude}, ${place.longitude}</p>

            <button onclick="deletePlace('${place._id}')">Delete</button>
            <button onclick="editPlace('${place._id}', '${place.name}', '${place.latitude}', '${place.longitude}')">Edit</button>
          </div>
        `;
      });
    })
    .catch(err => console.error(err));
}
// ================= ADD MARKERS =================
function addMarkers(places) {
  if (!map) return;

  places.forEach(place => {
    if (place.latitude && place.longitude) {
      L.marker([place.latitude, place.longitude])
        .addTo(map)
        .bindPopup(place.name);
    }
  });
}

// ================= LOAD EXPENSES =================
function loadExpenses() {
  const container = document.getElementById("expenseList");
  if (!container) return;

  fetch("http://localhost:5000/api/expenses")
    .then(res => res.json())
    .then(data => {
      container.innerHTML = "";

      let total = 0;

      data.forEach(exp => {
        total += Number(exp.amount);

        container.innerHTML += `
          <div class="card">
            <p>${exp.title} - ₹${exp.amount}</p>
          </div>
        `;
      });

      const totalEl = document.getElementById("total");
      if (totalEl) {
        totalEl.innerText = "₹" + total;
      }
    })
    .catch(err => console.error(err));
}
function loadDashboard() {
  const tripId = localStorage.getItem("tripId");

  fetch(`${BASE_URL}/trips/dashboard/${tripId}`, {
    headers: { Authorization: token }
  })
  .then(res => res.json())
  .then(data => {

    document.getElementById("tripTitle").innerText = data.trip.title;
    document.getElementById("total").innerText = "₹" + data.totalExpense;

    // Expenses
    const expList = document.getElementById("expenseList");
    expList.innerHTML = "";

    data.expenses.forEach(e => {
      expList.innerHTML += `
        <div>
          ${e.title} - ₹${e.amount} (${e.category})
        </div>
      `;
    });

    // Places
    const placeList = document.getElementById("placeList");
    placeList.innerHTML = "";

    data.places.forEach(p => {
      placeList.innerHTML += `
        <div>${p.name} (${p.latitude}, ${p.longitude})</div>
      `;
    });

  });
}
function addExpense() {
  const tripId = localStorage.getItem("tripId");

  const title = document.getElementById("expTitle").value;
  const amount = Number(document.getElementById("amount").value);
  const category = document.getElementById("category").value;

  fetch(`${BASE_URL}/expenses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token
    },
    body: JSON.stringify({
      tripId,
      title,
      amount,
      category
    })
  })
  .then(res => res.json())
  .then(() => {
    alert("Expense added 💸");
    loadDashboard();
  });
}
