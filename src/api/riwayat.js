// src/api/riwayat.jsx
export const getRiwayat = async () => {
  const token = localStorage.getItem("token");

  const response = await fetch("https://ti054a04.agussbn.my.id/api/petugas/riwayat", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Gagal mengambil data riwayat.");
  }

  const data = await response.json();
  return data.data || [];
};
