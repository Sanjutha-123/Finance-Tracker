import axios from "axios";

const BASE_URL = "http://localhost:5198/api";

 /*  AUTH (LOGIN)*/
export const login = async (email, password) => {
  try {
    const response = await axios.post(`${BASE_URL}/Users/Login`, {
      email,
      password,
    });

    return response.data; // { token }
  } catch (error) {
    throw new Error(error.response?.data?.message || "Login failed");
  }
};

// Signup / Register API
export const signup = async (username, email, password) => {
  try {
    const response = await axios.post(`${BASE_URL}/Users/Register`, {
      username,
      email,
      password,
    });
    return response.data; // could return success message or created user object
  } catch (error) {
    throw new Error(error.response?.data?.message || "Signup failed");
  }
};
