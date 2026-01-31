import AppRouter from "./routes/AppRouter"
import Authenticator from "./pages/Authenticator"
import { Toaster } from "react-hot-toast"
import AuthProvider from "./context/AuthContext"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const queryClient = new QueryClient();
function App() {
  return (
    // <QueryClientProvider client={queryClient}>
    //   <AuthProvider>
    //   <ReactQueryDevtools open={false}/>
    //   <AppRouter/>
    //   <Toaster/>
    // </AuthProvider>
    // </QueryClientProvider>
    <>
    <AppRouter/>
    <Toaster/>
    </>
  )
}

export default App
