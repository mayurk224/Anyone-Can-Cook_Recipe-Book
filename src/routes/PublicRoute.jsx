// PublicRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Assuming you're using AuthContext

const PublicRoute = ({ children }) => {
  const { currentUser } = useAuth();

  // If the user is logged in, redirect to home or any other protected page
  if (currentUser) {
    return <Navigate to="/" />;
  }

  return children; // Render the public component if user is not logged in
};

export default PublicRoute;
