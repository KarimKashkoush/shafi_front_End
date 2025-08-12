import { createContext, useEffect, useState } from "react";






export const AuthContext = createContext(null);


export function AuthProvider({ children }) {
      const [user, setUser] = useState(null);
      const [token, setToken] = useState(null);
      useEffect(() => {
            const storedUser = localStorage.getItem('user');
            const storedToken = localStorage.getItem('token');

            if (storedUser) setUser(JSON.parse(storedUser));
            else setUser(null);

            if (storedToken) setToken(storedToken);
            else setToken(null);
      }, []);

      return (
            <AuthContext.Provider value={{ setUser, user, token, setToken }}>
                  {children}
            </AuthContext.Provider>
      );

}
