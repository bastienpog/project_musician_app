import React from "react";
import { Outlet } from "react-router-dom";
import { LoginPage } from "@/pages/LoginPage";
import { RegisterPage } from "@/pages/RegisterPage";
import { useLocation, Navigate } from "react-router-dom";
export const MainLayout: React.FC = () => {
  const token = localStorage.getItem("token")
  const location = useLocation();

  if (!token) {
    switch (location.pathname) {
      case "/login":
        return <LoginPage />;
      case "/register":
        return <RegisterPage />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  return (
    <>
      <div>
        <Outlet />
      </div>
    </>
  );
};
