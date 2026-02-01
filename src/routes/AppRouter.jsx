import Analytics from "@/pages/Analytics";
import Discover from "@/pages/Discover";
import HomePage from "@/pages/HomePage";
import Layout from "@/pages/Layout";
import Login from "@/pages/Login";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootErrorBoundary from "./RootErrorBoundary";
import ForgotPasswordPage from "@/pages/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/ResetPasswordPage";
import VerifyEmailPage from "@/pages/VerifyEmailPage";
import Authenticator from "@/pages/Authenticator";
const router = createBrowserRouter([
    {
        path:"login",
        element:<Login/>
    },
    {
        path:"/",
        errorElement:<RootErrorBoundary/>,
        element:<Authenticator><Layout/></Authenticator>,
        children:[
            {index:true , element:<HomePage/>},
            {path:"Discover" , element:<Discover/>},
            {path:"Analytics" ,  element:<Analytics/> }
        ]
    },
    {
        path:"/forgot-password",
        element:<ForgotPasswordPage/>
    }
    ,
    {
        path:"/reset-password",
        element:<ResetPasswordPage/>
    }
    ,
    {
        path:"/verify-email",
        element:<VerifyEmailPage/>
    }
]);

export default function AppRouter() {
  return (
    <>
        <RouterProvider router={router}/>
    </>
  )
}
