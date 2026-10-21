import { Outlet } from "react-router";
import NavBar from "./components/NavBar";
import { AuthProvider } from "./contexts/AuthContext";

import "./App.css";

function App() {
  return (
    <AuthProvider>
      <NavBar />
      <Outlet />
    </AuthProvider>
    // <>
    //   <NavBar />
    //   <Outlet />
    // </>
  );
}

export default App;
