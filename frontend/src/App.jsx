// eslint-disable-next-line no-unused-vars
import react from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// usersauth
import SingIn from "./pages/usersauth/SignIn";
import Singup from "./pages/usersauth/SignUp";
import ResetPassword from "./pages/usersauth/ResetPassword";
import ResetPasswordConfirm from "./pages/usersauth/ResetPasswordConfirmation";

// Main pages
import Home from "./pages/Home";
import Diagnosis from "./pages/Diagnosis";
import AIAssistant from "./pages/AIAssistant";
import PatientEducation from "./pages/PatientEducation";
import Research from "./pages/Research";
import FAQ from "./pages/FAQ";
import CommunityForum from "./pages/CommunityForum";
import About from "./pages/About";
import Contact from "./pages/Contact";

import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthCallback from "./AuthCallback";
import Methodology from "./pages/Methodology";

// Admin Pages
import AdminLayout from "./pages/admin/components/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminSystem from "./pages/admin/AdminSystem";

function Signout() {
  localStorage.clear();
  return <Navigate to="/signin" />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main application routes */}
        <Route path="/" element={<Home />} />
        <Route
          path="/diagnosis"
          element={
            <ProtectedRoute>
              <Diagnosis />
            </ProtectedRoute>
          }
        />
        {/* Admin Section Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="system" element={<AdminSystem />} />
        </Route>
        <Route path="/ai-assistant" element={<AIAssistant />} />
        <Route path="/patient-education" element={<PatientEducation />} />
        <Route path="/research" element={<Research />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/community" element={<CommunityForum />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/methodology" element={<Methodology />} />

        {/* Authentication routes */}
        <Route path="/signin" element={<SingIn />} />
        <Route path="/signup" element={<Singup />} />
        <Route path="/signout" element={<Signout />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
        <Route
          path="/resetpassword/confirm"
          element={<ResetPasswordConfirm />}
        />
        <Route path="/auth/callback" element={<AuthCallback />} />
        {/* 404 route */}
        <Route path="*" element={<NotFound />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
