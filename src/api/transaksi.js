// src/api/transaksi.js
export const fetchTransaksi = async () => {
  try {
    const response = await fetch("https://ti054a03.agussbn.my.id/api/transaksi");
    const data = await response.json();

    if (Array.isArray(data.data)) {
      return data.data;
    } else {
      console.warn("Format data transaksi tidak sesuai:", data);
      return [];
    }
  } catch (error) {
    console.error("Gagal fetch data transaksi:", error);
    return [];
  }
};
