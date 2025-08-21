import axios from "axios";

const REACT_API="http://localhost:4000"

const baseURL =
 REACT_API +
  "/api/v1"; // fallback if using Netlify proxy
console.log("The frontend URL is",baseURL);
const client = axios.create({
  baseURL,
  withCredentials: true, // needed if backend uses cookies
  headers: { "Content-Type": "application/json" },
});

export default client;
