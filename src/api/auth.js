import axios from "axios";

const API_URL = "https://ti054a04.agussbn.my.id/api";

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Login gagal atau koneksi bermasalah." };
  }
};
