import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";

export default function Register() {
  const { register, fetchUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirm: "",
  });
  const [errors, setErrors] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (await register(formData, setErrors)) {
      await fetchUser();
      navigate("/", { replace: true });
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <h1>Register</h1>
        {errors.length
          ? errors.map((error, index) => <p key={index}>{error.msg}</p>)
          : ""}
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
        <div>
          <label htmlFor="confirm">Confirm password</label>
          <input
            onChange={handleChange}
            type="password"
            name="confirm"
            id="confirm"
            value={formData.confirm}
          />
        </div>
        <button type="submit">Register</button>
      </form>
    </>
  );
}
