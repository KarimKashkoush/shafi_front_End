import { createContext, useEffect, useState } from "react";






export const AuthContext = createContext(null);


export function AuthProvider({ children }) {
      const [user, setUser] = useState(null);

      useEffect(() => {
            localStorage.getItem('user') ? setUser(JSON.parse(localStorage.getItem('user'))) : setUser(null);
      }, [])


      return <AuthContext value={{ setUser, user }} >{children}</AuthContext>

}
