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
      body: JSON.stringify({ email, password })
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
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Login failed");
      return;
    }

    // ✅ SAVE JWT TOKEN (THIS IS THE IMPORTANT CHANGE)
    localStorage.setItem("token", data.token);

    alert("Login successful 🎉");
    window.location.href = "dashboard.html";

  } catch (err) {
    alert("Server error");
  }
}
// LOGOUT
function logout() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}


// FETCH TRIPS
async function fetchTrips() {
  const token = localStorage.getItem("token");

  try {
    const res = await fetch("http://localhost:5000/api/trips", {
      headers: {
        "Authorization": "Bearer " + token
      }
    });

    const data = await res.json();

    console.log("TRIPS RESPONSE:", data);

    const tripList = document.getElementById("tripList");
    tripList.innerHTML = "";

    data.trips.forEach(trip => {
      const li = document.createElement("li");
      li.textContent = `${trip.title} - ${trip.description}`;
      tripList.appendChild(li);
    });

  } catch (err) {
    console.error(err);
  }
}

// ADD TRIP
async function addTrip() {
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const token = localStorage.getItem("token");

  if (!title || !description) {
    alert("Please fill all fields");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/trips", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify({ title, description })
    });

    if (!res.ok) {
      alert("Failed to add trip");
      return;
    }

    document.getElementById("title").value = "";
    document.getElementById("description").value = "";

    fetchTrips();

  } catch (err) {
    console.error(err);
  }
}