// src/api/api.js
import axios from "axios";

const API_BASE = "http://127.0.0.1:8000/api";

export const fetchEvents = async () => {
  try {
    const response = await axios.get(`${API_BASE}/events/test/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching events:", error);
    return null;
  }
};

export const fetchUsers = async () => {
  try {
    const response = await axios.get(`${API_BASE}/users/test/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    return null;
  }
};
