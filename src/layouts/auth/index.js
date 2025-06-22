import { Routes, Route } from "react-router-dom";
import SignIn from "@/pages/auth/sign-in";

export function Auth() {
  return (
    <Routes>
      <Route path="sign-in" element={<SignIn />} />
    </Routes>
  );
}

export default Auth;
