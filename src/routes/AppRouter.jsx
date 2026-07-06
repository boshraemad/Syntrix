import Analytics from "@/pages/Analytics";
import Dashboards from "@/pages/Dashboards";
import DashboardDetail from "@/pages/DashboardDetail";
import Discover from "@/pages/Discover";
import HomePage from "@/pages/HomePage";
import Layout from "@/pages/Layout";
import Login from "@/pages/Login";
import Maps from "@/pages/Maps";
import Canvas from "@/pages/Canvas";
import MachineLearning from "@/pages/MachineLearning";
import Observability from "@/pages/Observability";
import Logs from "@/pages/Logs";
import LogSourceDetail from "@/pages/LogSourceDetail";
import Hosts from "@/pages/Hosts";
import HostDetail from "@/pages/HostDetail";
import AlertDetail from "@/pages/AlertDetail";
import SecurityHub from "@/pages/SecurityHub";
import Detection from "@/pages/Detection";
import SecurityAlerts from "@/pages/SecurityAlerts";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootErrorBoundary from "./RootErrorBoundary";
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
            {path:"Dashboards" , element:<Dashboards/>},
            {path:"dashboards/:dashboardId" , element:<DashboardDetail/>},
            {path:"Analytics" ,  element:<Analytics/> },
            {path:"maps", element:<Maps/>},
            {path:"canvas", element:<Canvas/>},
            {path:"machine-learning", element:<MachineLearning/>},
            {path:"observability", element:<Observability/>},
            {path:"observability/logs", element:<Logs/>},
            {path:"observability/logs/:sourceId", element:<LogSourceDetail/>},
            {path:"observability/hosts", element:<Hosts/>},
            {path:"observability/hosts/:hostId", element:<HostDetail/>},
            {path:"security", element:<SecurityHub/>},
            {path:"security/detection", element:<Detection/>},
            {path:"security/alerts", element:<SecurityAlerts/>},
            {path:"security/alerts/:alertId", element:<AlertDetail/>}
        ]
    }
]);

export default function AppRouter() {
  return (
    <>
        <RouterProvider router={router}/>
    </>
  )
}
