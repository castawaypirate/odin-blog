import { Navigate } from "react-router";
import { useAuth } from "../../contexts/AuthContext";

export default function PublicOnlyRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <></>;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }
  return children;
}
