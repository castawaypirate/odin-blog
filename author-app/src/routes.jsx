import App from "./App";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Error from "./pages/Error";
import PublicOnlyRoute from "./components/guards/PublicOnlyRoute";
import AuthorRoute from "./components/guards/AuthorRoute";
import CreatePost from "./pages/CreatePost";
import EditPost from "./pages/EditPost";
import ViewPost from "./pages/ViewPost";

const routes = [
  {
    path: "/",
    element: <App />,
    errorElement: <Error />,
    children: [
      {
        path: "/",
        element: (
          <AuthorRoute>
            <Dashboard />
          </AuthorRoute>
        ),
      },
      {
        path: "/create",
        element: (
          <AuthorRoute>
            <CreatePost />
          </AuthorRoute>
        ),
      },
      {
        path: "/edit/:id",
        element: (
          <AuthorRoute>
            <EditPost />
          </AuthorRoute>
        ),
      },
      {
        path: "/post/:id",
        element: (
          <AuthorRoute>
            <ViewPost />
          </AuthorRoute>
        ),
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
