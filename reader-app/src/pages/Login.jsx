import { useState } from "react";
// import { useContext, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
// import { AuthContext, useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router";

export default function Login() {
  // const [accessToken, setAccessToken] = useContext(AuthContext);
  // const { login, fetchUser } = useContext(AuthContext);
  const { login, fetchUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (await login(formData, setErrors)) {
      await fetchUser();
      navigate("/", { replace: true });
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <h1>Login</h1>
        {errors.length ? errors.map((error) => <p>{error.msg}</p>) : ""}
        <div>
          <label htmlFor="username">Username</label>
          <input
            onChange={handleChange}
            type="text"
            name="username"
            id="username"
            value={formData.username}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            onChange={handleChange}
            type="password"
            name="password"
            id="password"
            value={formData.password}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </>
  );
}
