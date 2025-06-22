// src/api/obatTransaksi.js
export const fetchObatTransaksi = async () => {
  try {
    const response = await fetch("https://ti054a03.agussbn.my.id/api/obat_transaksi");
    const data = await response.json();

    const totalHarga = data.data?.reduce((total, item) => {
      return total + parseFloat(item.total_harga || 0);
    }, 0) || 0;

    return totalHarga; // angka numerik saja
  } catch (error) {
    console.error("Gagal fetch data obat_transaksi:", error);
    return 0;
  }
};
