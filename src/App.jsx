import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";
import { Antrean, StokObat, Riwayat, Home } from "@/pages/dashboard";
import DetailAntrean from "@/pages/dashboard/detailantrean";

function App() {
  return (
    <Routes>
      <Route path="/auth/*" element={<Auth />} />

      <Route path="/dashboard/*" element={<Dashboard />}>
        <Route path="home" element={<Home />} />
        <Route path="antrean" element={<Antrean />} />
        <Route path="detail/:idResep" element={<DetailAntrean />} />
        <Route path="stokobat" element={<StokObat />} />
        <Route path="riwayat" element={<Riwayat />} />
      </Route>

      <Route path="*" element={<Navigate to="/auth/sign-in" replace />} />
    </Routes>
  );
}

export default App;
