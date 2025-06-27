import axios from "axios";

export const getAntrean = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get("https://ti054a04.agussbn.my.id/api/petugas/antrian", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("Gagal mengambil antrean:", error);
    throw error;
  }
};

export const getDetailAntrean = async (idResep) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`https://ti054a04.agussbn.my.id/api/petugas/detail-antrean?id_resep=${idResep}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("Gagal mengambil detail antrean:", error);
    throw error;
  }
};
