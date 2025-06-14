import { createContext, useState, useContext, useEffect } from "react";
import {
  getCurrentUser,
  login as loginService,
  logoutService,
  registerUser,
} from "../services/authService";
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Login
  const handleLogin = async (username, password) => {
    try {
      const user = await loginService(username, password);
      setCurrentUser(user);
      return user;
    } catch (err) {
      console.error("Login failed:", err.message);
      throw err;
    }
  };

  const handleRegister = async (user) => {
    try {
      const registeredUser = await registerUser(user);
      return registeredUser;
    } catch (err) {
      console.error("Register failed:", err.message);
      throw err;
    }
  };

  const handleLogout = () => {
    logoutService();
    setCurrentUser(null);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        console.log(error);
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const value = {
    currentUser,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    isAdmin: currentUser?.role === "ADMIN",
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
