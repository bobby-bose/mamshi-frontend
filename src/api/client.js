import axios from "axios";

const baseURL =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) ||
  process.env.REACT_APP_API_URL ||
  "/api/v1"; // fallback if using Netlify proxy

const client = axios.create({
  baseURL,
  withCredentials: true, // needed if backend uses cookies
  headers: { "Content-Type": "application/json" },
});

export default client;
