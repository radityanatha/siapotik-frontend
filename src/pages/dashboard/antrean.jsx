import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography
} from "@material-tailwind/react";
import { getAntrean } from "@/api/antrean";
import { useSearch } from "@/context/SearchContext";
import { useNavigate } from "react-router-dom";

export function Antrean() {
  const [medicalRecordsData, setMedicalRecordsData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { searchKeyword } = useSearch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAntrean();
        const formattedData = data.map((item, index) => ({
          no: index + 1,
          rekamMedis: item.rm || "-",
          idResep: item.id_resep || "-",
          noRegistrasi: item.no_registrasi || "-",
          namaPoli: item.poli?.nama_poli || "-",
          antrean: item.no_antrian || "-",
          status: item.status || "-",
        }));

        setMedicalRecordsData(formattedData);
      } catch (error) {
        console.error("Error fetching antrean data:", error);
      }
    };

    fetchData();
  }, []);

  const StatusIndicator = ({ status }) => (
    <div className="flex justify-center">
      <div className={`w-3 h-3 rounded-full ${status === "Sudah Bayar" ? "bg-green-400" : "bg-blue-400"}`}></div>
    </div>
  );

  const filteredData = medicalRecordsData.filter((record) => {
    const keyword = searchKeyword.toLowerCase();
    return (
      String(record.rekamMedis).toLowerCase().includes(keyword) ||
      String(record.idResep).toLowerCase().includes(keyword) ||
      String(record.noRegistrasi).toLowerCase().includes(keyword) ||
      String(record.namaPoli).toLowerCase().includes(keyword) ||
      String(record.antrean).toLowerCase().includes(keyword) ||
      String(record.status).toLowerCase().includes(keyword)
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
            Antrean Obat
          </Typography>
        </CardHeader>

        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["No", "Rekam Medis", "ID Resep", "No. Registrasi", "Nama Poli", "Antrean", "Status", "Aksi"].map((el) => (
                  <th key={el} className="border-b border-blue-gray-50 py-3 px-5 text-left">
                    <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                      {el}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentItems.map((record, key) => {
                const className = `py-3 px-5 ${key === currentItems.length - 1 ? "" : "border-b border-blue-gray-50"}`;

                return (
                  <tr key={key}>
                    <td className={className}>{record.no}</td>
                    <td className={className}>{record.rekamMedis}</td>
                    <td className={className}>{record.idResep}</td>
                    <td className={className}>{record.noRegistrasi}</td>
                    <td className={className}>{record.namaPoli}</td>
                    <td className={className}>{record.antrean}</td>
                    <td className={className}><StatusIndicator status={record.status} /></td>
                    <td className={className}>
                      <button
                        onClick={() => navigate(`/dashboard/detail/${record.idResep}`)}
                        className="text-xs font-semibold text-blue-500 hover:underline"
                      >
                        Detail
                      </button>
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

export default Antrean;
