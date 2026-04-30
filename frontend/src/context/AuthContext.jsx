import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔥 Load user on refresh
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token || token === "undefined") {
      setLoading(false);
      return;
    }

    api
      .get("/auth/me")
      .then((res) => {
        console.log("AUTH USER:", res.data);
        setUser(res.data.user || res.data);
      })
      .catch((err) => {
        console.error("AUTH ERROR:", err.response?.data || err.message);
        localStorage.removeItem("token");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  // 🔥 LOGIN
  const login = (token, userData) => {
    console.log("LOGIN TOKEN:", token);

    if (!token || token === "undefined") return;

    localStorage.setItem("token", token);
    setUser(userData);
  };

  // 🔥 LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);