import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../api/auth";

export function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const data = await login(email, password);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/dashboard/home");
    } catch (err) {
      setError(err.message || "Login gagal. Coba lagi.");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Blue Background with Floating Circles */}
      <div className="flex-1 relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 flex items-center justify-center overflow-hidden">
        <div className="absolute top-20 left-16 w-20 h-20 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full opacity-80"></div>
        <div className="absolute top-32 right-20 w-24 h-24 bg-gradient-to-br from-blue-300 to-blue-400 rounded-full opacity-70"></div>
        <div className="absolute bottom-40 left-12 w-28 h-28 bg-gradient-to-br from-teal-400 to-green-500 rounded-full opacity-75"></div>
        <div className="absolute top-60 left-1/3 w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full opacity-60"></div>
        <div className="absolute bottom-32 right-16 w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full opacity-70"></div>

        <div className="text-center text-white z-10 px-8">
          <h1 className="text-4xl font-bold mb-6 leading-tight">
            Selamat Datang di Sistem<br />
            Apotik
          </h1>
          <p className="text-lg opacity-90 max-w-md mx-auto leading-relaxed">
            Kelola sistem apotek Anda dengan mudah dan efisien.<br />
            Akses inventory, penjualan, dan laporan dalam satu<br />
            platform terintegrasi.
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 bg-gray-50 flex items-center justify-center p-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          {/* Logo + Judul */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4">
              <img src="/img/logors.png" alt="Logo Si-Apotik" className="w-full h-full object-contain" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Si-Apotik</h2>
          </div>

          {/* Login Form */}
          <div className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Masukkan email Anda"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50"
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Kata Sandi
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan kata sandi"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50"
              />
            </div>

            {/* Error Message */}
            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            {/* Login Button */}
            <button
              type="button"
              onClick={handleLogin}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 text-sm uppercase tracking-wide"
            >
              MASUK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
