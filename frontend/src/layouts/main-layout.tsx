import React from "react";
import { Outlet } from "react-router-dom";
import { LoginPage } from "@/pages/LoginPage";
import { RegisterPage } from "@/pages/RegisterPage";
import { useLocation, Navigate } from "react-router-dom";

// MainLayout component which decides which page to show based on authentication
export const MainLayout: React.FC = () => {
  const token = localStorage.getItem("token");
  const location = useLocation();

  // If there is no token, it means the user is not logged in
  if (!token) {
    switch (location.pathname) {
      // If the user is on the login page, render the LoginPage
      case "/login":
        return <LoginPage />;
      // If the user is on the register page, render the RegisterPage
      case "/register":
        return <RegisterPage />;
      // For any other routes, redirect the user to the login page
      default:
        return <Navigate to="/login" replace />;
    }
  }

  // If the user is authenticated (token exists), render the child routes via Outlet
  return (
    <>
      <div>
        <Outlet />
      </div>
    </>
  );
};
