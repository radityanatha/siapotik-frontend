const API_URL = "https://ti054a04.agussbn.my.id/api";

export const getStokObat = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/petugas/obat`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error("Gagal mengambil data obat.");
    const json = await response.json();
    return json.data || [];
  } catch (error) {
    console.error("❌ Gagal mengambil data stok obat:", error);
    return [];
  }
};

export const getTotalRegistrasi = async () => {
  try {
    const token = "338|1l7yAp3VH2ETU1wcY7LjEtQNhisyEJrMraJCE2Pbc071c2fe"; // statis dari kamu
    const response = await fetch("https://ti054a02.agussbn.my.id/api/pemeriksaan", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error("Gagal mengambil data registrasi.");
    const json = await response.json();
    const data = json.data;

    if (!Array.isArray(data)) throw new Error("Data bukan array.");
    return data.reduce((acc, item) => acc + (item.pasien?.no_registrasi ? 1 : 0), 0);
  } catch (error) {
    console.error("❌ Gagal menghitung data registrasi:", error);
    return 0;
  }
};

export const getStatusSummary = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/pendaftaran`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error("Gagal mengambil data status.");
    const json = await response.json();
    const data = json.data;

    if (!Array.isArray(data)) throw new Error("Data bukan array.");

    let selesai = 0;
    let selesaiPembayaran = 0;

    data.forEach(item => {
      const statusRaw = item.pasien?.status_raw;
      if (statusRaw === 4) selesai++;
      else if (statusRaw === 3) selesaiPembayaran++;
    });

    return { selesai, selesaiPembayaran };
  } catch (error) {
    console.error("❌ Gagal menghitung data status:", error);
    return { selesai: 0, selesaiPembayaran: 0 };
  }
};
