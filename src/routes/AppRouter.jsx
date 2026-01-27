import Analytics from "@/pages/Analytics";
import Discover from "@/pages/Discover";
import HomePage from "@/pages/HomePage";
import Layout from "@/pages/Layout";
import Login from "@/pages/Login";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
    {
        path:"login",
        element:<Login/>
    },
    {
        path:"/",
        element:<Layout/>,
        children:[
            {index:true , element:<HomePage/>},
            {path:"Discover" , element:<Discover/>},
            {path:"Analytics" ,  element:<Analytics/> }
        ]
    },
]);

export default function AppRouter() {
  return (
    <>
        <RouterProvider router={router}/>
    </>
  )
}
