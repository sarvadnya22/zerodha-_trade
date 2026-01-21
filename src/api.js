// frontend/src/api.js

// 1. Check if we are on the laptop
const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

// 2. Set the URL dynamically
// If local, use localhost:3002. If live, use your new Render URL.
const API_URL = isLocal 
  ? "http://localhost:3002" 
  : "https://zenotrade-backend.onrender.com";

export default API_URL;