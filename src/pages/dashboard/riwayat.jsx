import React, { useEffect, useState } from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  Chip,
  Spinner,
} from "@material-tailwind/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { useSearch } from "@/context/SearchContext";

export function Riwayat() {
  const [riwayatData, setRiwayatData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const { searchKeyword } = useSearch();

  const getStatusColor = (status) => {
    switch (status) {
      case "selesai":
        return "green";
      case "pending":
        return "gray";
      case "proses":
        return "blue";
      case "batal":
        return "red";
      default:
        return "gray";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "selesai":
        return "Selesai";
      case "pending":
        return "Pending";
      case "proses":
        return "Proses";
      case "batal":
        return "Batal";
      default:
        return "Unknown";
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString || dateString === "-") return "-";
    return new Date(dateString).toLocaleString("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://ti054a04.agussbn.my.id/api/petugas/riwayat",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!response.ok) throw new Error("Gagal mengambil data dari server.");

        const json = await response.json();

        const formattedData = json.data.map((item) => ({
          kodeEResep: item.id_resep || "-",
          rekamMedis: item.id_riwayat || "-",
          namaPasien: item.nama_pasien || "-",
          tanggalDiterima: formatDateTime(item.tanggal_diterima),
          tanggalSelesai: formatDateTime(item.tanggal_selesai),
          status: item.status || "pending",
        }));

        setRiwayatData(formattedData);
      } catch (err) {
        setError("Gagal mengambil data riwayat");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredData = riwayatData.filter((item) => {
    const keyword = searchKeyword.toLowerCase();
    return (
      String(item.namaPasien || "").toLowerCase().includes(keyword) ||
      String(item.kodeEResep || "").toLowerCase().includes(keyword) ||
      String(item.rekamMedis || "").toLowerCase().includes(keyword) ||
      String(item.tanggalDiterima || "").toLowerCase().includes(keyword) ||
      String(item.tanggalSelesai || "").toLowerCase().includes(keyword) ||
      String(item.status || "").toLowerCase().includes(keyword)
    );
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="blue" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Aktivitas
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          {loading ? (
            <div className="flex justify-center py-10">
              <Spinner color="blue" />
            </div>
          ) : error ? (
            <Typography color="red" className="text-center py-4">
              {error}
            </Typography>
          ) : (
            <>
              <table className="w-full min-w-[640px] table-auto">
                <thead>
                  <tr>
                    {[
                      "Kode E-Resep",
                      "Rekam Medis",
                      "Nama Pasien",
                      "Tanggal Diterima",
                      "Tanggal Selesai",
                      "Status",
                      "",
                    ].map((el) => (
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
                  {paginatedData.map((receipt, key) => {
                    const className = `py-3 px-5 ${
                      key === paginatedData.length - 1
                        ? ""
                        : "border-b border-blue-gray-50"
                    }`;

                    return (
                      <tr key={`${receipt.kodeEResep}-${key}`}>
                        <td className={className}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-semibold"
                          >
                            {receipt.kodeEResep}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-normal text-blue-gray-500">
                            {receipt.rekamMedis}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-normal text-blue-gray-500">
                            {receipt.namaPasien}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-normal text-blue-gray-500">
                            {receipt.tanggalDiterima}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-normal text-blue-gray-500">
                            {receipt.tanggalSelesai}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Chip
                            variant="gradient"
                            color={getStatusColor(receipt.status)}
                            value={getStatusText(receipt.status)}
                            className="py-0.5 px-2 text-[11px] font-medium w-fit"
                          />
                        </td>
                        <td className={className}>
                          <Typography
                            as="a"
                            href="#"
                            className="text-xs font-semibold text-blue-gray-600"
                          >
                            <EllipsisVerticalIcon
                              strokeWidth={2}
                              className="h-5 w-5 text-inherit"
                            />
                          </Typography>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Pagination UI */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-6">
                  <div className="flex gap-2 items-center bg-white px-4 py-2 rounded-lg shadow-md">
                    {[...Array(totalPages)].map((_, index) => {
                      const page = index + 1;
                      const isActive = page === currentPage;

                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300
                            ${isActive
                              ? "bg-blue-600 text-white scale-110 shadow-md"
                              : "bg-blue-100 text-blue-700 hover:bg-blue-300"
                            }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </CardBody>
      </Card>
    </div>
  );
}

export default Riwayat;
