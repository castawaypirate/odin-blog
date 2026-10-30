import { NavLink, useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";

export default function NavBar() {
  const { user, logout, loading, isAuthorized } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (await logout()) {
      navigate("/", { replace: true });
      return;
    }
    alert("Something went wrong");
  };

  return (
    <nav>
      <div>
        {loading ? (
          <></>
        ) : (
          <>
            {isAuthorized("Author") && <NavLink to="/">Dashboard</NavLink>}
            {isAuthorized("Author") && <NavLink to="/create">Create</NavLink>}
          </>
        )}
      </div>

      <div>
        {loading ? (
          <></>
        ) : (
          <>
            {user ? (
              <NavLink onClick={handleLogout}>Logout</NavLink>
            ) : (
              <>
                <NavLink to="/login">Login</NavLink>
                <NavLink to="/register">Register</NavLink>
              </>
            )}
          </>
        )}
      </div>
    </nav>
  );
}
