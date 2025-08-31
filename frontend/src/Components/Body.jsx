import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import Feed from "./Feed";
import Profile from "./Profile";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
// import Tweet from "./Tweet";
import Bookmark from "./Bookmark";
import BookmarkComponent from "./BookmarkComponent";
import AdminDashboard from "./AdminDashboard";
import AdminRoute from "./AdminRoute";

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
          index: true,
          element: <Feed />,
        },
        {
          path: "/profile",
          element: <Profile />,
        },
      ],
    },
    {
      path: "/bookmarks",
      element: <Bookmark />,
      children: [
        {
          index: true,
          element: <BookmarkComponent />,
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
    {
      path: "/admin",
      element: (
        <AdminRoute>
          <AdminDashboard />
        </AdminRoute>
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
