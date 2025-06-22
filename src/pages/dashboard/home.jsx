import React, { useEffect, useState } from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  IconButton,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";
import {
  EllipsisVerticalIcon,
  ArrowUpIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon, ClockIcon } from "@heroicons/react/24/solid";

import { StatisticsCard } from "@/widgets/cards";
import { StatisticsChart } from "@/widgets/charts";
import { statisticsChartsData, ordersOverviewData } from "@/data";

import { BanknotesIcon, UserPlusIcon, UsersIcon, ChartBarIcon } from "@heroicons/react/24/solid";

import { useSearch } from "@/context/SearchContext";
import { fetchObatTransaksi } from "@/api/obatTransaksi";
import { fetchTransaksi } from "@/api/transaksi";

export function Home() {
  const { searchKeyword } = useSearch();

  const [moneyValue, setMoneyValue] = useState("Loading...");
  const [transaksiList, setTransaksiList] = useState([]);

  const statisticsCardsData = [
    {
      color: "blue",
      icon: BanknotesIcon,
      title: "Penghasilan Hari Ini",
      value: moneyValue,
      footer: {
        color: "text-blue-900",
        value: "+10%",
        label: "dari minggu lalu",
      },
    },
    {
      color: "blue",
      icon: UsersIcon,
      title: "Today's Users",
      value: "2,300",
      footer: {
        color: "text-blue-900",
        value: "+3%",
        label: "than last month",
      },
    },
    {
      color: "blue",
      icon: UserPlusIcon,
      title: "New Clients",
      value: "3,462",
      footer: {
        color: "text-red-500",
        value: "-2%",
        label: "than yesterday",
      },
    },
    {
      color: "blue",
      icon: ChartBarIcon,
      title: "Sales",
      value: "$103,430",
      footer: {
        color: "text-green-500",
        value: "+5%",
        label: "than yesterday",
      },
    },
  ];

  const filteredCards = statisticsCardsData.filter(({ title }) =>
    title.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const filteredCharts = statisticsChartsData.filter(({ title }) =>
    title.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  useEffect(() => {
  const getMoney = async () => {
    const total = await fetchObatTransaksi();
    const formatted = total.toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
    });
    setMoneyValue(formatted);
  };

  const getTransaksi = async () => {
    const data = await fetchTransaksi();
    setTransaksiList(data);
  };

  getMoney();
  getTransaksi();
}, []);


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
              <Typography className="font-normal text-blue-gray-600">
                <strong className={footer.color}>{footer.value}</strong>
                &nbsp;{footer.label}
              </Typography>
            }
          />
        ))}
      </div>

      <div className="mb-6 grid grid-cols-1 gap-y-12 gap-x-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredCharts.map((props) => (
          <StatisticsChart
            key={props.title}
            {...props}
            footer={
              <Typography
                variant="small"
                className="flex items-center font-normal text-blue-gray-600"
              >
                <ClockIcon strokeWidth={2} className="h-4 w-4 text-blue-gray-400" />
                &nbsp;{props.footer}
              </Typography>
            }
          />
        ))}
      </div>

      <div className="mb-4 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="overflow-hidden xl:col-span-2 border border-blue-gray-100 shadow-sm">
  <CardHeader
    floated={false}
    shadow={false}
    color="transparent"
    className="m-0 flex items-center justify-between p-6"
  >
    <div>
      <Typography variant="h6" color="blue-gray" className="mb-1">
        Pasien Dilayani
      </Typography>
      <Typography
        variant="small"
        className="flex items-center gap-1 font-normal text-blue-gray-600"
      >
        <CheckCircleIcon strokeWidth={3} className="h-4 w-4 text-blue-gray-200" />
        <strong>{transaksiList.length} transaksi</strong> telah diproses
      </Typography>
    </div>
  </CardHeader>
  <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
    <table className="w-full min-w-[640px] table-auto">
      <thead>
        <tr>
          {["No. Registrasi", "Tanggal Bayar", "Status", "Total Tagihan"].map((el) => (
            <th
              key={el}
              className="border-b border-blue-gray-50 py-3 px-6 text-left"
            >
              <Typography
                variant="small"
                className="text-[11px] font-medium uppercase text-blue-gray-400"
              >
                {el}
              </Typography>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {transaksiList.map((item, index) => (
          <tr key={index}>
            <td className="py-3 px-6">{item.no_registrasi}</td>
            <td className="py-3 px-6">{item.tanggal_bayar}</td>
            <td className="py-3 px-6">
              {item.status === 1 ? (
                <span className="text-green-600 font-semibold">Lunas</span>
              ) : (
                <span className="text-red-600 font-semibold">Belum Lunas</span>
              )}
            </td>
            <td className="py-3 px-6">
              Rp {parseInt(item.total_tagihan).toLocaleString("id-ID")}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </CardBody>
</Card>



        <Card className="border border-blue-gray-100 shadow-sm">
          <CardHeader floated={false} shadow={false} color="transparent" className="m-0 p-6">
            <Typography variant="h6" color="blue-gray" className="mb-2">
              Orders Overview
            </Typography>
            <Typography
              variant="small"
              className="flex items-center gap-1 font-normal text-blue-gray-600"
            >
              <ArrowUpIcon strokeWidth={3} className="h-3.5 w-3.5 text-green-500" />
              <strong>24%</strong> this month
            </Typography>
          </CardHeader>
          <CardBody className="pt-0">
            {ordersOverviewData.map(({ icon, color, title, description }, key) => (
              <div key={title} className="flex items-start gap-4 py-3">
                <div
                  className={`relative p-1 after:absolute after:-bottom-6 after:left-2/4 after:w-0.5 after:-translate-x-2/4 after:bg-blue-gray-50 after:content-[''] ${
                    key === ordersOverviewData.length - 1 ? "after:h-0" : "after:h-4/6"
                  }`}
                >
                  {React.createElement(icon, { className: `!w-5 !h-5 ${color}` })}
                </div>
                <div>
                  <Typography variant="small" color="blue-gray" className="block font-medium">
                    {title}
                  </Typography>
                  <Typography
                    as="span"
                    variant="small"
                    className="text-xs font-medium text-blue-gray-500"
                  >
                    {description}
                  </Typography>
                </div>
              </div>
            ))}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

export default Home;
