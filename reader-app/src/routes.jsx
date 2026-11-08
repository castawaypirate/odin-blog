import App from "./App";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Error from "./pages/Error";
import PublicOnlyRoute from "./components/guards/PublicOnlyRoute";
import PostsReview from "./pages/PostsReview";
import AuthorRoute from "./components/guards/AuthorRoute";

// import { createContext } from "react-router";

// const userRouterContext = createContext(null);
//
// async function authMiddleware({ context }, next) {
//   try {
//     const response = await fetch("http://localhost:8000/me", {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ...`,
//       },
//       credentials: "include",
//     });
//
//     if (!response.ok) {
//       const result = await response.json();
//       console.error(result);
//     } else {
//       const result = await response.json();
//       context.set(userRouterContext, result);
//       await next();
//     }
//   } catch (err) {
//     console.error(err);
//   }
// }
//
// async function userLoader({ context }) {
//   const user = context.get(userRouterContext);
//   return user;
// }

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
        path: "/review",
        element: (
          <AuthorRoute>
            <PostsReview />
          </AuthorRoute>
        ),
        // loader: userLoader,
      },
      {
        path: "/login",
        element: (
          <PublicOnlyRoute>
            <Login />
          </PublicOnlyRoute>
        ),
      },
      {
        path: "/register",
        element: (
          <PublicOnlyRoute>
            <Register />
          </PublicOnlyRoute>
        ),
      },
    ],
  },
];

export default routes;
