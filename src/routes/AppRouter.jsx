import Analytics from "@/pages/Analytics";
import Discover from "@/pages/Discover";
import HomePage from "@/pages/HomePage";
import Login from "@/pages/Login";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
    {
        path:"login",
        element:<Login/>
    },
    {
        path:"/",
        element:<HomePage/>
    },
    {
        path:"discover",
        element:<Discover/>
    },
    {
        path:"analytics",
        element:<Analytics/>
    }
]);

export default function AppRouter() {
  return (
    <>
        <RouterProvider router={router}/>
    </>
  )
}
