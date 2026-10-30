import { Outlet } from "react-router";
import "./App.css";
import { AuthProvider } from "./contexts/AuthContext";
import NavBar from "./components/NavBar";

function App() {
  return (
    <AuthProvider>
      <NavBar />
      <Outlet />
    </AuthProvider>
  );
}

export default App;
