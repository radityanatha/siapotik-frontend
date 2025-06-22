// src/api/antrean.js
import axios from "axios";

export const getAntrean = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get("https://ti054a04.agussbn.my.id/api/petugas/detail-antrean", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("Gagal mengambil data antrean:", error);
    throw error;
  }
};
