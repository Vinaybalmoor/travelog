let editTripId = null; // stores trip being edited

// ================= REGISTER =================
async function register() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

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
async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email || !password) {
    alert("Please fill all fields");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Login failed");
      return;
    }

    localStorage.setItem("token", data.token);
    alert("Login successful 🎉");
    window.location.href = "dashboard.html";
  } catch (err) {
    console.error(err);
    alert("Server error");
  }
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
      headers: { Authorization: "Bearer " + token },
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
    if (editTripId) {
      // UPDATE MODE
      const res = await fetch(`http://localhost:5000/api/trips/${editTripId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ title, description }),
      });

      if (!res.ok) {
        alert("Failed to update trip");
        return;
      }

      alert("Trip updated successfully ✅");
      editTripId = null;
      document.getElementById("addBtn").textContent = "Add Trip";
    } else {
      // ADD MODE
      const res = await fetch("http://localhost:5000/api/trips", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ title, description }),
      });

      if (!res.ok) {
        alert("Failed to add trip");
        return;
      }

      alert("Trip added successfully 🎉");
    }

    document.getElementById("title").value = "";
    document.getElementById("description").value = "";
    fetchTrips();
  } catch (err) {
    console.error(err);
  }
}

// ================= EDIT FUNCTION =================
function editTrip(id, title, description) {
  editTripId = id;
  document.getElementById("title").value = title;
  document.getElementById("description").value = description;
  document.getElementById("addBtn").textContent = "Update Trip";
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

    alert("Trip deleted successfully ✅");
    fetchTrips();
  } catch (err) {
    console.error(err);
  }
}