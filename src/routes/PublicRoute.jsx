import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Adjust path if needed

const PublicRoute = ({ element: Component }) => {
  const { currentUser } = useAuth(); // Check user authentication

  if (currentUser) {
    return <Navigate to="/" replace />; // Redirect to home if already authenticated
  }

  return Component; // Render the public component if not authenticated
};

export default PublicRoute;
