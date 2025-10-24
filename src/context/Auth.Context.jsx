import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
      const [user, setUser] = useState(null);
      const [token, setToken] = useState(null);

      useEffect(() => {
            const storedUser = localStorage.getItem("user");
            const storedToken = localStorage.getItem("token");

            if (storedUser) setUser(JSON.parse(storedUser));
            if (storedToken) setToken(storedToken);
      }, []);

      // 🔐 دالة تسجيل الدخول
      const login = (userData, tokenData) => {
            localStorage.setItem("user", JSON.stringify(userData));
            localStorage.setItem("token", tokenData);
            setUser(userData);
            setToken(tokenData);
      };

      // 🚪 دالة تسجيل الخروج
      const logout = () => {
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            setUser(null);
            setToken(null);
      };

      return (
            <AuthContext.Provider value={{ user, token, setUser, setToken, login, logout }}>
                  {children}
            </AuthContext.Provider>
      );
}
