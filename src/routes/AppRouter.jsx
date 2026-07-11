import { useSystemStatus } from "@/features/System/hooks/useGetSystemStatus";
import Analytics from "@/pages/Analytics";
import Dashboards from "@/pages/Dashboards";
import DashboardDetail from "@/pages/DashboardDetail";
import Discover from "@/pages/Discover";
import HomePage from "@/pages/HomePage";
import Layout from "@/pages/Layout";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
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
import Settings from "@/pages/Settings";

function AuthPageLayout() {
    const { data, isLoading, error } = useSystemStatus();

    if (isLoading) {
      return (
        <div className="min-h-screen bg-[#07090e] flex items-center justify-center">
          <div className="text-sm font-mono text-cyan-400 animate-pulse uppercase tracking-wider">
            Initializing Terminal Environment...
          </div>
        </div>
      );
    }
  
    // في حالة حدوث خطأ في الاتصال بالـ API
    if (error) {
      return (
        <div className="min-h-screen bg-[#07090e] flex items-center justify-center p-4">
          <div className="border border-red-500/20 bg-red-500/5 text-red-400 p-4 font-mono text-xs rounded-sm max-w-md">
            <p className="font-bold uppercase mb-1">CRITICAL: Environment Sync Fault</p>
            <p className="text-gray-400">Could not pull system status parameters. Ensure your backend is live.</p>
          </div>
        </div>
      );
    }
  
    const isFirstRun = data?.isFirstRun || data?.initialized === false;

    return isFirstRun ? <Signup /> : <Login />;
  }

const router = createBrowserRouter([
    {
        path:"login",
        element:<AuthPageLayout/>
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
            {path:"security/alerts/:alertId", element:<AlertDetail/>},
            {path:"setting", element:<Settings/>}
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
