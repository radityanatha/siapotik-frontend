import React, { useEffect, useState } from "react";
import { Pill } from "lucide-react";
import { Typography } from "@material-tailwind/react";
import { ClockIcon, UserIcon, UsersIcon } from "@heroicons/react/24/solid";

import { StatisticsCard } from "@/widgets/cards";
import { StatisticsChart } from "@/widgets/charts";
import { statisticsChartsData } from "@/data";
import { useSearch } from "@/context/SearchContext";

import {
  getTotalRegistrasi,
  getStokObat,
  getStatusSummary,
} from "@/api/cardInfo";

export function Home() {
  const { searchKeyword } = useSearch();

  const [jumlahStokObat, setJumlahStokObat] = useState(0);
  const [presentaseStokObatLayak, setPresentaseStokObatLayak] = useState(0);
  const [kategoriStokLabel, setKategoriStokLabel] = useState("");
  const [totalRegistrasi, setTotalRegistrasi] = useState(0);

  const [jumlahSelesai, setJumlahSelesai] = useState(0);
  const [jumlahSelesaiPembayaran, setJumlahSelesaiPembayaran] = useState(0);

  useEffect(() => {
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("✅ Token ditemukan:", token);

      const stokObatData = await getStokObat();
      console.log("📦 Data Stok Obat:", stokObatData);

      setJumlahStokObat(stokObatData.length);

      let stokCukup = 0, stokStabil = 0, stokGawat = 0;
      stokObatData.forEach(item => {
        const stok = item.stok;
        if (stok <= 100) stokGawat++;
        else if (stok <= 300) stokStabil++;
        else if (stok <= 700) stokCukup++;
      });

      const totalStokObat = stokObatData.length;
      const layak = stokCukup + stokStabil;
      const presentase = totalStokObat > 0 ? Math.round((layak / totalStokObat) * 100) : 0;
      setPresentaseStokObatLayak(presentase);

      let kategoriLabel = "Tidak diketahui";
      if (stokCukup >= stokStabil && stokCukup >= stokGawat) kategoriLabel = "Kategori Cukup";
      else if (stokStabil >= stokGawat) kategoriLabel = "Kategori Stabil";
      else kategoriLabel = "Kategori Gawat";
      setKategoriStokLabel(kategoriLabel);

      const totalReg = await getTotalRegistrasi();
      console.log("📋 Total Registrasi:", totalReg);
      setTotalRegistrasi(totalReg);

      const { selesai, selesaiPembayaran } = await getStatusSummary();
      console.log("📊 Status Summary:", { selesai, selesaiPembayaran });
      setJumlahSelesai(selesai);
      setJumlahSelesaiPembayaran(selesaiPembayaran);

    } catch (error) {
      console.error("❌ Gagal mengambil data:", error);
    }
  };

  fetchData();
}, []);

  const statisticsCardsData = [
    {
      color: "blue",
      icon: UsersIcon,
      title: "Total Registrasi",
      value: totalRegistrasi.toString(),
      footer: {
        color: "text-blue-500",
        value: "",
        label: "",
        barColor: "bg-blue-500",
        barWidth: "0%",
      },
    },
    {
      color: "green",
      icon: UserIcon,
      title: "Status Selesai",
      value: jumlahSelesai.toString(),
      footer: {
        color: "text-green-500",
        value: `${jumlahSelesai}`,
        label: "pasien telah selesai",
        barColor: "bg-green-400",
        barWidth: "100%",
      },
    },
    {
      color: "pink",
      icon: UserIcon,
      title: "Selesai Pembayaran",
      value: jumlahSelesaiPembayaran.toString(),
      footer: {
        color: "text-pink-500",
        value: `${jumlahSelesaiPembayaran}`,
        label: "pasien telah bayar",
        barColor: "bg-pink-400",
        barWidth: "100%",
      },
    },
    {
      color: "blue",
      icon: Pill,
      title: "Stok Obat",
      value: jumlahStokObat.toString(),
      footer: {
        color:
          presentaseStokObatLayak >= 70
            ? "text-green-500"
            : presentaseStokObatLayak >= 40
            ? "text-yellow-500"
            : "text-red-500",
        value: `${presentaseStokObatLayak}%`,
        label: kategoriStokLabel,
        barColor: "bg-green-400",
        barWidth: `${presentaseStokObatLayak}%`,
      },
    },
  ];

  const filteredCards = statisticsCardsData.filter(({ title }) =>
    title.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const filteredCharts = statisticsChartsData.filter(({ title }) =>
    title.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  return (
    <div className="mt-12">
      <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
        {filteredCards.map(({ icon, title, footer, ...rest }) => (
          <StatisticsCard
            key={title}
            {...rest}
            title={title}
            icon={React.createElement(icon, {
              className: "w-6 h-6 text-white",
            })}
            footer={
              <div>
                <Typography className="font-normal text-blue-gray-600">
                  <strong className={footer.color}>{footer.value}</strong>&nbsp;{footer.label}
                </Typography>
                {footer.barWidth && (
                  <div className="w-full h-1.5 bg-blue-gray-100 rounded-full mt-2">
                    <div
                      className={`h-full rounded-full ${footer.barColor}`}
                      style={{ width: footer.barWidth }}
                    />
                  </div>
                )}
              </div>
            }
          />
        ))}
      </div>

      <div className="mb-12 grid grid-cols-1 gap-y-12 gap-x-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredCharts.map((props) => (
          <StatisticsChart
            key={props.title}
            {...props}
            footer={
              <Typography variant="small" className="flex items-center font-normal text-blue-gray-600">
                <ClockIcon strokeWidth={2} className="h-4 w-4 text-blue-gray-400" />
                &nbsp;{props.footer}
              </Typography>
            }
          />
        ))}
      </div>
    </div>
  );
}

export default Home;
