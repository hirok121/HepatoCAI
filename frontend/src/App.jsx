import react from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import SingIn from "./pages/SignIn";
import Singup from "./pages/SignUp";
import Register from "./pages/Register";
import Home from "./pages/Home";
import FakeHome from "./pages/FakeHome";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthCallback from "./AuthCallback";

function Logout() {
  localStorage.clear();
  return <Navigate to="/signin" />;
}
function Signout() {
  localStorage.clear();
  return <Navigate to="/signin" />;
}

function RegisterAndLogout() {
  localStorage.clear();
  return <Register />;
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
        <Route path="/login" element={<Login />} />
        <Route path="/signin" element={<SingIn />} />
        <Route path="/signup" element={<Singup />} />
        <Route path="/signout" element={<Signout />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/register" element={<RegisterAndLogout />} />
        <Route path="*" element={<NotFound />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
