import { NavLink } from "react-router";

export default function NavBar() {
  return (
    <nav>
      <div>
        <NavLink to="/">Posts</NavLink>
      </div>

      <div>
        <NavLink to="/login">Login</NavLink>
        <NavLink to="/register">Register</NavLink>
      </div>
    </nav>
  );
}
