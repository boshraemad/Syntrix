import AppRouter from "./routes/AppRouter"
import Authenticator from "./pages/Authenticator"
import { Toaster } from "react-hot-toast"
import AuthProvider from "./context/AuthContext"
import { ThemeProvider } from "./context/ThemeContext"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
const queryClient = new QueryClient();
function App() {

  return (
    <>
      <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} position="bottom" />
        <ThemeProvider>
        <AuthProvider>
        <AppRouter/>
        <Toaster/>
      </AuthProvider>
        </ThemeProvider>
    </QueryClientProvider>
    </>
  )
}

export default App
