import App from "./App";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Error from "./pages/Error";
import { createContext } from "react-router";

const userRouterContext = createContext(null);

async function authMiddleware({ context }, next) {
  try {
    const response = await fetch("http://localhost:8000/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNlMmE4ZWY4LWJlZjQtNDM5MC1iMjVmLTM1MDBkZjk0NWQ1YiIsImlhdCI6MTc5MjU4NTMxOCwiZXhwIjoxNzkyNTg1NjE4fQ.HYimfCHpJeX5jdcw-O0zl9jxlqFe37akCHUwo0BMtj4`,
      },
      credentials: "include",
    });

    if (!response.ok) {
      const result = await response.json();
      console.error(result);
    } else {
      const result = await response.json();
      context.set(userRouterContext, result);
      await next();
    }
  } catch (err) {
    console.error(err);
  }
}

async function userLoader({ context }) {
  const user = context.get(userRouterContext);
  return user;
}

const routes = [
  {
    path: "/",
    element: <App />,
    errorElement: <Error />,
    // middleware: [authMiddleware],
    children: [
      {
        path: "/",
        element: <Home />,
        // loader: userLoader,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
    ],
  },
];

export default routes;
