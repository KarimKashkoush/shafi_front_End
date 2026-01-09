import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
      const [user, setUser] = useState(null);
      const [token, setToken] = useState(null);
      const [loading, setLoading] = useState(true); // 🔹 حالة تحميل

      useEffect(() => {
            const storedUser = localStorage.getItem("user");
            const storedToken = localStorage.getItem("token");

            if (storedUser) setUser(JSON.parse(storedUser));
            if (storedToken) setToken(storedToken);

            setLoading(false); // انتهى تحميل البيانات
      }, []);

      const login = (userData, tokenData) => {
            localStorage.setItem("user", JSON.stringify(userData));
            localStorage.setItem("token", tokenData);
            setUser(userData);
            setToken(tokenData);
      };

      const logout = () => {
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            setUser(null);
            setToken(null);
      };

      return (
            <AuthContext.Provider value={{ user, token, setUser, setToken, login, logout, loading }}>
                  {children}
            </AuthContext.Provider>
      );
}
