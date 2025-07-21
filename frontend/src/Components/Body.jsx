import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import Feed from "./Feed";
import Profile from "./Profile";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

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
