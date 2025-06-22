import React, { useEffect, useState } from 'react';
import { getDetailAntrean } from '../../api/detailantrean';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardBody, Typography } from '@material-tailwind/react';

const DetailAntrean = () => {
  const { idResep } = useParams();
  const navigate = useNavigate();
  const [detail, setDetail] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const data = await getDetailAntrean(idResep);
        const filtered = data.filter(item => String(item.id_resep) === idResep);
        setDetail(filtered);
      } catch (error) {
        console.error('Gagal mengambil detail antrean:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [idResep]);

  if (loading) return <p className="p-4">Loading...</p>;
  if (!detail.length) return <p className="p-4">Tidak ada detail untuk resep ini.</p>;

  const info = detail[0]; // Asumsi info umum diambil dari elemen pertama

  return (
    <div className="p-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-blue-600 hover:underline"
      >
        ← Kembali
      </button>

      {/* Kartu Info Antrean */}
      <div className="flex items-center justify-between bg-transparent p-10 rounded-lg">
        <div className="w-32 h-32 flex flex-col items-center justify-center bg-white rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.15)] text-blue-900 font-bold text-lg transition-all duration-300 hover:scale-[1.03]">
          <span className="text-sm font-normal">Antrian</span>
          <span className="text-3xl">{info.no_antrean || '-'}</span>
        </div>

        <div className="grid grid-cols-2 gap-y-2 gap-x-8 text-sm text-blue-900 font-medium flex-1 ml-6">
          <p>Rekam Medis : <span className="font-normal">{info.no_rekam_medis || '-'}</span></p>
          <p>Nama Pasien : <span className="font-normal">{info.nama_pasien || '-'}</span></p>
          <p>ID Resep : <span className="font-normal">{info.id_resep}</span></p>
          <p>Status : <span className="font-normal">{info.status || '-'}</span></p>
          <p>ID Poli : <span className="font-normal">{info.id_poli || '-'}</span></p>
        </div>
      </div>

      {/* Tabel Obat - Material Tailwind Style */}
      <Card>
        <CardHeader variant="gradient" color="blue" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Antrean Obat
          </Typography>
        </CardHeader>

        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["Kode", "Nama Obat", "Kategori", "Bentuk Satuan", "Jumlah", "Pemakaian", "Total Harga"].map((el) => (
                  <th
                    key={el}
                    className="border-b border-blue-gray-50 py-3 px-5 text-left"
                  >
                    <Typography
                      variant="small"
                      className="text-[11px] font-bold uppercase text-blue-gray-400"
                    >
                      {el}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {detail.map((item, key) => {
                const className = `py-3 px-5 ${
                  key === detail.length - 1 ? "" : "border-b border-blue-gray-50"
                }`;

                return (
                  <tr key={key}>
                    <td className={className}>{item.id_obat}</td>
                    <td className={className}>{item.nama_obat}</td>
                    <td className={className}>{item.kategori}</td>
                    <td className={className}>{item.bentuk_satuan}</td>
                    <td className={className}>{item.jumlah}</td>
                    <td className={className}>{item.aturan_pakai}</td>
                    <td className={className}>
                      Rp{" "}
                      {Number(item.total_harga).toLocaleString("id-ID", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardBody>
      </Card>

      {/* Tombol Konfirmasi */}
      <div className="mt-6 flex justify-end">
        <button className="bg-blue-800 hover:bg-blue-900 text-white px-6 py-2 rounded-md font-medium">
          Konfirmasi
        </button>
      </div>
    </div>
  );
};

export default DetailAntrean;
