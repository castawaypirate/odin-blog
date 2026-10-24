import { NavLink, useNavigate } from "react-router";
// import { useContext } from "react";
// import { AuthContext, useAuth } from "../contexts/AuthContext";
import { useAuth } from "../contexts/AuthContext";

export default function NavBar() {
  // const { user, logout } = useContext(AuthContext);
  const { user, logout, loading } = useAuth();
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
        <NavLink to="/">Posts</NavLink>
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
