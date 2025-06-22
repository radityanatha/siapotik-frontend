import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/solid";
import { Home, Antrean, StokObat, Riwayat } from "@/pages/dashboard";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "dashboard",
        path: "/home",
        element: <Home />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "antrean",
        path: "/antrean",
        element: <Antrean />,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "stokobat",
        path: "/stokobat",
        element: <StokObat />,
      },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "riwayat",
        path: "/riwayat",
        element: <Riwayat />,
      },
    ],
  },
];

export default routes;
