import { Navigate } from "react-router";
import { useAuth } from "../../contexts/AuthContext";

export default function PublicOnlyRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }
  return children;
}
