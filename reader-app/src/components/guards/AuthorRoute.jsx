import { Navigate } from "react-router";
import { useAuth } from "../../contexts/AuthContext";

export default function AuthorRoute({ children }) {
  const { user, loading, isAuthorized } = useAuth();

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (!user || !isAuthorized("Author")) {
    return <Navigate to="/" replace />;
  }
  return children;
}
