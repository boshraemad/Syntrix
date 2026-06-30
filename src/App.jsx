import AppRouter from "./routes/AppRouter"
import Authenticator from "./pages/Authenticator"
import { Toaster } from "react-hot-toast"
import AuthProvider from "./context/AuthContext"
import { ThemeProvider } from "./context/ThemeContext"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const queryClient = new QueryClient();
function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
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
