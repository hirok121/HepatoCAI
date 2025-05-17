import react from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// usersauth
import SingIn from "./pages/usersauth/SignIn";
import Singup from "./pages/usersauth/SignUp";
import ResetPassword from "./pages/usersauth/ResetPassword";
import ResetPasswordConfirm from "./pages/usersauth/ResetPasswordConfirmation";

import Home from "./pages/Home";
import FakeHome from "./pages/FakeHome";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthCallback from "./AuthCallback";

function Signout() {
  localStorage.clear();
  return <Navigate to="/signin" />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/fakehome"
          element={
            <ProtectedRoute>
              <FakeHome />
            </ProtectedRoute>
          }
        />
        <Route path="/signin" element={<SingIn />} />
        <Route path="/signup" element={<Singup />} />
        <Route path="/signout" element={<Signout />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
        <Route
          path="/resetpassword/confirm"
          element={<ResetPasswordConfirm />}
        />
        <Route path="/auth/callback" element={<AuthCallback />} />

        <Route path="*" element={<NotFound />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
