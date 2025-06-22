import axios from "axios";

export const getStokObat = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get("https://ti054a04.agussbn.my.id/api/petugas/obat", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("Gagal mengambil data stok obat:", error);
    throw error;
  }
};
