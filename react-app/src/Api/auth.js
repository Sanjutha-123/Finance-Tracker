
// src/Api/auth.js
import axios from "axios";

const BASE_URL = "http://localhost:5198/api";

// ----------------------
// AUTH (LOGIN / REGISTER)
// ----------------------
export const login = async (email, password) => {
  try {
    const response = await axios.post(`${BASE_URL}/Users/Login`, { email, password });

    // Save token to localStorage
    if (response.data?.token) {
      localStorage.setItem("token", response.data.token);
    }

    return response.data; // { token }
  } catch (error) {
    const message = error.response?.data?.message || error.response?.statusText || "Login failed";
    throw new Error(message);
  }
};

export const signup = async (username, email, password) => {
  try {
    const response = await axios.post(`${BASE_URL}/Users/Register`, {
      username,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.response?.statusText || "Signup failed";
    throw new Error(message);
  }
};

// ----------------------
// HELPER: AUTH HEADER
// ----------------------
const authHeader = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Unauthorized: No token found. Please login again.");
  }

  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

// ----------------------
// CATEGORIES
// ----------------------
export const addCategory = async (data) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/Category/add`,
      {
        name: data.name,   // required
        type: data.type,   // required
      },
      authHeader()         // use helper for auth
    );
    return response.data;
  } catch (error) {
    console.error("Failed to add category:", error);
    throw new Error(error.response?.data?.message || "Failed to add category");
  }
};

export const getCategories = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/Category`, authHeader());
    return response.data;
  } catch (error) {
    throw new Error("Unable to load categories");
  }
};

// ----------------------
// TRANSACTIONS
// ----------------------
export const addTransaction = async (data) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/Transaction/add`,
      {
        amount: data.amount,
        type: data.type,
        categoryId: data.categoryId,
        description: data.description,
      },
      authHeader()
    );
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error("Unauthorized. Please login again.");
    }
    throw new Error(error.response?.data?.message || "Failed to add transaction");
  }
};
