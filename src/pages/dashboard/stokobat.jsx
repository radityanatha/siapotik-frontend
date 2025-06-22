import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Chip,
} from "@material-tailwind/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { getStokObat } from "@/api/stokobat";
import { useSearch } from "@/context/SearchContext";

export function StokObat() {
  const [medicineData, setMedicineData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { searchKeyword } = useSearch();

  useEffect(() => {
    const fetchObat = async () => {
      try {
        const data = await getStokObat();
        const formattedData = data.map((item) => ({
          kode: item.id_obat || "-",
          namaObat: item.nama_obat || "-",
          kategori: item.id_kategori || "-",
          bentukSatuan: item.bentuk_satuan || "-",
          stok: item.stok || 0,
          hargaJual: `Rp. ${parseInt(item.harga_jual).toLocaleString("id-ID")}`,
          kadaluarsa: item.kadaluarsa || "-",
          status:
            item.stok <= 50
              ? "low"
              : new Date(item.kadaluarsa) < new Date(new Date().setMonth(new Date().getMonth() + 3))
              ? "expiring"
              : "available",
        }));
        setMedicineData(formattedData);
      } catch (error) {
        console.error("Gagal memuat stok obat:", error);
      }
    };

    fetchObat();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "available":
        return "green";
      case "low":
        return "amber";
      case "expiring":
        return "red";
      default:
        return "gray";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "available":
        return "Tersedia";
      case "low":
        return "Stok Rendah";
      case "expiring":
        return "Hampir Kadaluarsa";
      default:
        return "Tidak Diketahui";
    }
  };

  const filteredData = medicineData.filter((item) => {
    const keyword = searchKeyword.toLowerCase();
    return (
      String(item.kode).toLowerCase().includes(keyword) ||
      String(item.namaObat).toLowerCase().includes(keyword) ||
      String(item.kategori).toLowerCase().includes(keyword) ||
      String(item.bentukSatuan).toLowerCase().includes(keyword) ||
      String(item.stok).toLowerCase().includes(keyword) ||
      String(item.hargaJual).toLowerCase().includes(keyword) ||
      String(item.kadaluarsa).toLowerCase().includes(keyword) ||
      String(getStatusText(item.status)).toLowerCase().includes(keyword)
    );
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getPageNumbers = () => {
    const totalPageNumbers = 5;
    const totalNumbers = Math.min(totalPageNumbers, totalPages);
    const half = Math.floor(totalNumbers / 2);

    let start = Math.max(currentPage - half, 1);
    let end = start + totalNumbers - 1;

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(end - totalNumbers + 1, 1);
    }

    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="blue" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Inventory Obat
          </Typography>
        </CardHeader>

        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {[
                  "Kode",
                  "Nama Obat",
                  "Kategori",
                  "Bentuk Satuan",
                  "Stok",
                  "Harga Jual",
                  "Kadaluarsa",
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
              {currentItems.map((medicine, key) => {
                const className = `py-3 px-5 ${
                  key === currentItems.length - 1
                    ? ""
                    : "border-b border-blue-gray-50"
                }`;

                return (
                  <tr key={medicine.kode}>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {medicine.kode}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-semibold"
                      >
                        {medicine.namaObat}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-normal text-blue-gray-500">
                        {medicine.kategori}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-normal text-blue-gray-500">
                        {medicine.bentukSatuan}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography
                        className={`text-xs font-semibold ${
                          medicine.stok <= 50
                            ? "text-red-600"
                            : medicine.stok <= 100
                            ? "text-amber-600"
                            : "text-green-600"
                        }`}
                      >
                        {medicine.stok}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {medicine.hargaJual}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-normal text-blue-gray-500">
                        {medicine.kadaluarsa}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Chip
                        variant="gradient"
                        color={getStatusColor(medicine.status)}
                        value={getStatusText(medicine.status)}
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

          {/* Pagination */}
          <div className="flex justify-center mt-6 gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="w-9 h-9 flex items-center justify-center rounded-full text-sm font-bold text-blue-500 hover:bg-blue-100 disabled:text-gray-300 disabled:cursor-not-allowed"
            >
              &#8592;
            </button>

            {getPageNumbers().map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`w-9 h-9 flex items-center justify-center rounded-full text-sm font-bold transition-all duration-300
                  ${currentPage === page
                    ? "bg-blue-500 text-white scale-110 shadow-lg"
                    : "text-blue-500 hover:bg-blue-100"}`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="w-9 h-9 flex items-center justify-center rounded-full text-sm font-bold text-blue-500 hover:bg-blue-100 disabled:text-gray-300 disabled:cursor-not-allowed"
            >
              &#8594;
            </button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export default StokObat;
