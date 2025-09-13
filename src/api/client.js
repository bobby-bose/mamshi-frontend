import axios from "axios";

// Use the Render backend in production
// const baseURL = "https://mamshi-backend.onrender.com/api/v1";
const baseURL = "https://mamshi-backend.onrender.com/api/v1";
// "https://mamshi-backend.onrender.com/api/v1";
// window.location.hostname.includes("netlify.app")
//   ? "https://mamshi-backend.onrender.com/api/v1"
//   : ""; // optional: local EC2 for development

const client = axios.create({
  baseURL,
  withCredentials: true, // needed if backend uses cookies
  headers: { "Content-Type": "application/json" },
});

export default client;
