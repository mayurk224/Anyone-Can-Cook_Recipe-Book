import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Adjust path if needed

const ProtectedRoute = ({ element: Component }) => {
  const { currentUser } = useAuth(); // Check user authentication

  if (!currentUser) {
    return <Navigate to="/login" replace />; // Redirect to login if not authenticated
  }

  return Component; // Render the protected component if authenticated
};

export default ProtectedRoute;
