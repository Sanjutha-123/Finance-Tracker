import axios from "axios";

// Get JWT token from localStorage
const token = localStorage.getItem("token");

const api = axios.create({
  baseURL: "http://localhost:5198/api", // your API base URL
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`, // attach JWT automatically
  },
});

export default api;
