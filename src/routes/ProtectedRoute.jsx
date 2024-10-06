import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Assuming you're using AuthContext

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();

  // If no user is authenticated, redirect to login page
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return children; // Render the protected component if user is logged in
};

export default ProtectedRoute;
