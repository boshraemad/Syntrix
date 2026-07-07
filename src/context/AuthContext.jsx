import { createContext , useContext } from "react"
import { useState } from "react";

const AuthContext = createContext();
export default function AuthProvider({children}) {
    const [accessToken , setAccessToken]=useState(()=>localStorage.getItem("token"));

    const logout=()=>{
      setAccessToken(null);
    }
  return (
    <AuthContext.Provider value={{accessToken , setAccessToken , logout}}>
        {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
    return useContext(AuthContext);
  }