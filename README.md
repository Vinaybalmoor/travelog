Overview

This is a backend project I built to understand how APIs work and how data is handled in a real application.
It allows users to create and manage trips, and all the data is stored in MongoDB.

**Tech Stack:** Node.js
Express.js
MongoDB (Atlas)


**Features:** Create a trip,
Get all trips,
Get a specific trip,
Update trip details,
Delete a trip,
JWT-based authentication,
Protected routes using middleware

**How it Works**: Server starts from index.js
Database is connected using MongoDB Atlas
Routes handle API requests
Controllers contain the logic (CRUD operations)
Middleware is used to protect routes using JWT

**Authentication**: I implemented JWT authentication to secure some routes.
After login, a token is generated
The token is sent in headers for protected requests
Middleware verifies the token before allowing access
