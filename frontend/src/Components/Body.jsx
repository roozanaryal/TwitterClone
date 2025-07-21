import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import Feed from "./Feed";
import Profile from "./Profile";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import Explore from "./Explore";
import Tweet from "./Tweet";
import Bookmark from "./Bookmark";

const Body = () => {
  const appRouter = createBrowserRouter([
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      ),
      children: [
        {
          path: "/",
          element: <Feed />,
        },
        {
          path: "/profile",
          element: <Profile />,
        },
      ],
    },
    {
      path: "/explore",
      element: <Explore />,
      children: [
        {
          index: true,
          element: <Tweet />,
        },
      ],
    },
    {
      path: "/bookmarks",
      element: <Bookmark />,
      children: [
        {
          index: true,
          element: <Tweet />,
        },
      ],
    },
    {
      path: "/login",
      element: (
        <PublicRoute>
          <Login />
        </PublicRoute>
      ),
    },
  ]);
  return (
    <div>
      <RouterProvider router={appRouter} />
    </div>
  );
};

export default Body;
