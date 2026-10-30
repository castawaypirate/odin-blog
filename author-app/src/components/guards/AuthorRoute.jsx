import { Navigate } from "react-router";
import { useAuth } from "../../contexts/AuthContext";

export default function AuthorRoute({ children }) {
  const { user, loading, isAuthorized } = useAuth();

  if (loading) {
    return <></>;
  }

  if (!user || !isAuthorized("Author")) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
